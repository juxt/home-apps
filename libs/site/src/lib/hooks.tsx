import { notEmpty } from '@juxt-home/utils';
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
} from '..';

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

export function useWorkflowStates() {
  const { modalState } = useSearch<LocationGenerics>();
  const id = modalState?.workflowId || '';
  const workflowStateResult = useKanbanDataQuery(undefined, {
    enabled: id !== '',
    select: (data) =>
      data?.allWorkflows
        ?.find((w) => w?.id === id)
        ?.workflowStates.filter(notEmpty),
  });
  return workflowStateResult;
}

export function useStatesOptions() {
  const workflowStateResult = useWorkflowStates();
  const cols =
    workflowStateResult?.data?.map((c) => ({
      value: c.id,
      label: c.name,
    })) || [];
  return cols;
}

export function useWorkflowState(id?: string) {
  const workflowStateResult = useKanbanDataQuery(undefined, {
    select: (data) =>
      data?.allWorkflowStates?.filter(notEmpty).find((s) => s.id === id),
  });
  return workflowStateResult;
}

export function useProjectOptions() {
  const kanbanDataQuery = useKanbanDataQuery(undefined, {
    select: (data) => data?.allProjects?.filter(notEmpty),
  });
  return (
    kanbanDataQuery?.data?.map((p) => ({
      label: p.name,
      value: p.id,
    })) ?? []
  );
}

export function useCurrentProject() {
  const projectId = useSearch<LocationGenerics>().workflowProjectId;
  const projectQuery = useKanbanDataQuery(undefined, {
    select: (data) =>
      data?.allProjects?.filter(notEmpty).find((p) => p.id === projectId),
  });
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

export function useCommentForCard(cardId: string) {
  const query = useCommentsForCardQuery(
    { id: cardId },
    {
      select: (data) =>
        data?.commentsForCard?.filter(notEmpty).filter((c) => !c?.parentId),
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
