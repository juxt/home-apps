import { NavTabs } from '@juxt-home/ui-common';
import { notEmpty } from '@juxt-home/utils';
import { useQueryClient } from 'react-query';
import { useEffect } from 'react';
import { useSearch } from 'react-location';
import * as _ from 'lodash-es';
import {
  LocationGenerics,
  useCardByIdsQuery,
  useKanbanDataQuery,
  useModalForm,
} from '@juxt-home/site';
import {
  AddProjectModal,
  UpdateProjectModal,
  Workflow,
  AddWorkflowStateModal,
  UpdateWorkflowStateModal,
} from '@juxt-home/ui-kanban';
import { AddHiringCardModal, HiringCardModal } from './components/CardForms';

export function App() {
  const search = useSearch<LocationGenerics>();
  const refetch = search.modalState?.formModalType ? false : 3000;
  const kanbanQueryResult = useKanbanDataQuery(undefined, {
    refetchInterval: refetch,
  });
  const workflow = kanbanQueryResult.data?.allWorkflows?.[0];
  const [isModalOpen, setIsModalOpen] = useModalForm({
    formModalType: 'addWorkflowState',
  });
  const [isCardModalOpen, setIsCardModalOpen] = useModalForm({
    formModalType: 'editCard',
  });
  const [isWorkflowStateModalOpen, setIsWorkflowStateModalOpen] = useModalForm({
    formModalType: 'editWorkflowState',
  });

  const [isAddCard, setIsAddCard] = useModalForm({
    formModalType: 'addCard',
  });
  const [isAddProject, setIsAddProject] = useModalForm({
    formModalType: 'addProject',
  });
  const [isEditProject, setIsEditProject] = useModalForm({
    formModalType: 'editProject',
  });
  const projects = kanbanQueryResult.data?.allProjects || [];
  const allCardIds =
    workflow?.workflowStates
      ?.flatMap((ws) => ws?.cards?.map((c) => c?.id))
      .filter(notEmpty) || [];

  const queryClient = useQueryClient();
  const prefetchCards = async () => {
    const data = await queryClient.fetchQuery(
      useCardByIdsQuery.getKey({ ids: _.uniq(allCardIds) }),
      useCardByIdsQuery.fetcher({ ids: _.uniq(allCardIds) }),
      { staleTime: Infinity },
    );
    data?.cardsByIds?.forEach((c) => {
      if (!c) return;
      queryClient.setQueryData(useCardByIdsQuery.getKey({ ids: [c.id] }), {
        cardsByIds: [c],
      });
    });
  };

  useEffect(() => {
    if (allCardIds.length > 0) {
      prefetchCards();
    }
  }, [JSON.stringify(allCardIds)]);

  return (
    <>
      {kanbanQueryResult.isLoading && <div>Loading...</div>}
      <AddWorkflowStateModal
        isOpen={!!isModalOpen}
        handleClose={() => setIsModalOpen(false)}
      />
      <UpdateWorkflowStateModal
        isOpen={!!isWorkflowStateModalOpen}
        handleClose={() => setIsWorkflowStateModalOpen(false)}
      />
      <HiringCardModal
        isOpen={isCardModalOpen}
        handleClose={() => setIsCardModalOpen(false)}
      />
      <AddHiringCardModal
        isOpen={isAddCard}
        handleClose={() => setIsAddCard(false)}
      />
      <AddProjectModal
        isOpen={isAddProject}
        handleClose={() => setIsAddProject(false)}
      />
      <UpdateProjectModal
        isOpen={isEditProject}
        handleClose={() => setIsEditProject(false)}
      />
      <NavTabs
        navName="workflowProjectId"
        tabs={[...projects, { id: '', name: 'All' }]
          .filter(notEmpty)
          .map((project) => ({
            id: project.id,
            name: project.name,
            count:
              workflow?.workflowStates.reduce(
                (acc, ws) =>
                  acc +
                  (ws?.cards?.filter((c) => {
                    if (project.id === '') {
                      return c?.project?.id;
                    }
                    return project?.id && c?.project?.id === project.id;
                  })?.length || 0),
                0,
              ) || 0,
          }))}
      />

      {workflow && <Workflow key={workflow.id} workflow={workflow} />}
    </>
  );
}
