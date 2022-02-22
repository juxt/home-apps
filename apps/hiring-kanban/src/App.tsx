import { NavTabs } from '@juxt-home/ui-common';
import { notEmpty } from '@juxt-home/utils';
import { useSearch } from 'react-location';
import {
  LocationGenerics,
  useKanbanDataQuery,
  useModalForm,
} from '@juxt-home/site';
import {
  AddProjectModal,
  UpdateWorkflowProjectModal,
  Workflow,
  AddWorkflowStateModal,
  UpdateWorkflowStateModalWrapper,
} from '@juxt-home/ui-kanban';
import {
  AddHiringCardModalWrapper as AddHiringCardModal,
  EditHiringCardModal as HiringCardModal,
} from './components/CardForms';
import { workflowId } from './constants';

export function App() {
  const search = useSearch<LocationGenerics>();
  const refetch = search.modalState?.formModalType ? false : 3000;
  const kanbanQueryResult = useKanbanDataQuery(
    { id: 'WorkflowHiring' },
    {
      refetchInterval: refetch,
    },
  );
  const workflow = kanbanQueryResult.data?.workflow;
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
  const projects = kanbanQueryResult.data?.allWorkflowProjects || [];
  return (
    <>
      {kanbanQueryResult.isLoading && <div>Loading cards...</div>}
      <AddWorkflowStateModal
        isOpen={!!isModalOpen}
        workflowId={workflowId}
        handleClose={() => setIsModalOpen(false)}
      />
      <UpdateWorkflowStateModalWrapper
        isOpen={!!isWorkflowStateModalOpen}
        workflowId={workflowId}
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
      <UpdateWorkflowProjectModal
        isOpen={isEditProject}
        workflowId={workflowId}
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
