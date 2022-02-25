import { notEmpty } from '@juxt-home/utils';
import _ from 'lodash';
import { DraggableLocation } from 'react-beautiful-dnd';
import { useNavigate, useSearch } from 'react-location';
import { UseQueryOptions } from 'react-query';
import {
  useKanbanDataQuery,
  CardByIdsQuery,
  useCardByIdsQuery,
  useCommentsForCardQuery,
  CardHistoryQuery,
  useCardHistoryQuery,
  LocationGenerics,
  CommentsForCardQuery,
  TWorkflow,
  TWorkflowState,
  useUpdateCardPositionMutation,
  useMoveCardMutation,
} from '..';
import { useUpdateHiringCardMutation } from '../generated/graphql';

type ModalState = LocationGenerics['Search']['modalState'];

export function useModalForm(
  modalState: ModalState,
): [boolean, (shouldOpen: boolean) => void] {
  const { modalState: currentModalState, ...search } =
    useSearch<LocationGenerics>();
  const navigate = useNavigate();
  const isModalOpen =
    currentModalState?.formModalType === modalState.formModalType;

  const setIsModalOpen = (shouldOpen: boolean) => {
    if (shouldOpen) {
      navigate({
        replace: true,
        search: {
          ...search,
          modalState: { ...currentModalState, ...modalState },
        },
      });
    } else {
      navigate({
        replace: true,
        search: {
          ...search,
        },
      });
    }
  };
  return [isModalOpen, setIsModalOpen];
}

export function useWorkflowStates({ workflowId }: { workflowId: string }) {
  const workflowStateResult = useKanbanDataQuery(
    { id: workflowId },
    {
      select: (data) => data?.workflow?.workflowStates.filter(notEmpty),
    },
  );
  return workflowStateResult;
}

export function useStatesOptions({
  workflowId,
}: {
  workflowId: string;
}): [ReturnType<typeof useWorkflowStates>, { value: string; label: string }[]] {
  const workflowStateResult = useWorkflowStates({ workflowId });
  const cols =
    workflowStateResult?.data?.map((c) => ({
      value: c.id,
      label: c.name,
    })) || [];
  return [workflowStateResult, cols];
}

export function useWorkflowState(workflowId: string, wsId?: string) {
  const workflowStateResult = useKanbanDataQuery(
    { id: workflowId },
    {
      select: (data) =>
        data?.workflow?.workflowStates
          ?.filter(notEmpty)
          .find((s) => s.id === wsId),
    },
  );
  return workflowStateResult;
}

export function useProjectOptions(workflowId: string) {
  const kanbanDataQuery = useKanbanDataQuery(
    { id: workflowId },
    {
      select: (data) => data?.allWorkflowProjects?.filter(notEmpty),
    },
  );
  return (
    kanbanDataQuery?.data?.map((p) => ({
      label: p.name,
      value: p.id,
    })) ?? []
  );
}

export function useCurrentProject(workflowId: string) {
  const workflowProjectId = useSearch<LocationGenerics>().workflowProjectId;
  const projectQuery = useKanbanDataQuery(
    { id: workflowId },
    {
      select: (data) =>
        data?.allWorkflowProjects
          ?.filter(notEmpty)
          .find((p) => p.id === workflowProjectId),
    },
  );
  return projectQuery;
}

export function useCardById(
  cardId?: string,
  opts?: UseQueryOptions<CardByIdsQuery, Error, CardByIdsQuery>,
) {
  const queryResult = useCardByIdsQuery(
    { ids: [cardId || ''] },
    {
      ...opts,
      select: (data) => ({
        ...data,
        cardsByIds: data?.cardsByIds?.filter(notEmpty),
      }),
      enabled: !!cardId,
      staleTime: 5000,
    },
  );
  return { ...queryResult, card: queryResult.data?.cardsByIds?.[0] };
}

export function useCommentForEntity(
  eId: string,
  opts: UseQueryOptions<CommentsForCardQuery, Error, CommentsForCardQuery> = {},
) {
  const query = useCommentsForCardQuery(
    { id: eId },
    {
      ...opts,
      select: (data) => ({
        ...data,
        commentsForCard: data?.commentsForCard
          ?.filter(notEmpty)
          .filter((c) => !c?.parentId),
      }),
    },
  );
  return query;
}

export function useCardHistory(
  cardId?: string,
  opts?: UseQueryOptions<CardHistoryQuery, Error, CardHistoryQuery>,
) {
  const queryResult = useCardHistoryQuery(
    { id: cardId || '' },
    {
      ...opts,
      select: (data) => ({
        ...data,
        cardHistory: data?.cardHistory?.filter((card) => card?._siteValidTime),
      }),
      enabled: !!cardId,
      staleTime: 5000,
    },
  );
  return { ...queryResult, history: queryResult.data?.cardHistory };
}

export function useUserId() {
  // should probably make a user query
  const { data } = useKanbanDataQuery(
    { id: 'WorkflowHiring' },
    {
      select: (data) => data?.myJuxtcode,
      staleTime: Infinity,
    },
  );
  return data;
}

export function useMoveCard({ handleSuccess }: { handleSuccess: () => void }) {
  const updateCardPosMutation = useUpdateCardPositionMutation({
    onSuccess: handleSuccess,
  });
  const moveCardMutation = useMoveCardMutation({
    onSuccess: handleSuccess,
  });
  const updateCardMutation = useUpdateHiringCardMutation();
  const updateServerCards = (
    state: TWorkflow,
    startCol: TWorkflowState,
    endCol: TWorkflowState,
    source: DraggableLocation,
    destination: DraggableLocation,
    draggableId: string,
    prevCardId?: string | false,
  ) => {
    if (startCol === endCol) {
      const cardsInSourceCol =
        state?.workflowStates
          .filter(notEmpty)
          .find((c) => c.id === source.droppableId)
          ?.cards?.filter(notEmpty)
          .map((c) => c.id) || [];
      updateCardPosMutation.mutate({
        workflowStateId: startCol?.id,
        workflowState: {
          cardIds: _.uniq(cardsInSourceCol),
        },
      });
    } else if (endCol) {
      updateCardMutation.mutate({
        cardId: draggableId,
        card: {
          stateStr: endCol.name,
        },
      });

      moveCardMutation.mutate({
        workflowStateId: endCol?.id,
        cardId: draggableId,
        previousCard: prevCardId || 'start',
      });
    }
  };
  return [updateServerCards];
}
