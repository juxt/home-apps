import {useEffect, useState} from 'react';
import {useSearch, useNavigate} from 'react-location';
import {UseQueryOptions} from 'react-query';
import {
  CardByIdsQuery,
  CardHistoryQuery,
  useCardByIdsQuery,
  useCardHistoryQuery,
  useCommentsForCardQuery,
  useKanbanDataQuery,
} from './generated/graphql';
import {notEmpty} from './kanbanHelpers';
import {LocationGenerics} from './types';

type ModalState = LocationGenerics['Search']['modalState'];

export function useModalForm(
  modalState: ModalState
): [boolean, (shouldOpen: boolean) => void] {
  const {modalState: currentModalState, ...search} =
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
          modalState: {...currentModalState, ...modalState},
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

function getMobileDetect(userAgent: string) {
  const isAndroid = (): boolean => Boolean(userAgent.match(/Android/i));
  const isIos = (): boolean => Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  const isOpera = (): boolean => Boolean(userAgent.match(/Opera Mini/i));
  const isWindows = (): boolean => Boolean(userAgent.match(/IEMobile/i));
  const isSSR = (): boolean => Boolean(userAgent.match(/SSR/i));

  const isMobile = (): boolean =>
    Boolean(isAndroid() || isIos() || isOpera() || isWindows());
  const isDesktop = (): boolean => Boolean(!isMobile() && !isSSR());
  return {
    isMobile,
    isDesktop,
    isAndroid,
    isIos,
    isSSR,
  };
}

export function useMobileDetect() {
  const userAgent =
    typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;
  return getMobileDetect(userAgent);
}

export function useWorkflowStates() {
  const {modalState} = useSearch<LocationGenerics>();
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
    workflowStateResult?.data?.map((c) => {
      return {
        value: c.id,
        label: c.name,
      };
    }) || [];
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
    kanbanDataQuery?.data?.map((p) => {
      return {
        label: p.name,
        value: p.id,
      };
    }) ?? []
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
  opts?: UseQueryOptions<CardByIdsQuery, Error, CardByIdsQuery>
) {
  const queryResult = useCardByIdsQuery(
    {ids: [cardId || '']},
    {
      ...opts,
      select: (data) => ({
        ...data,
        cardsByIds: data?.cardsByIds?.filter(notEmpty),
      }),
      enabled: !!cardId,
      staleTime: 5000,
    }
  );
  return {...queryResult, card: queryResult.data?.cardsByIds?.[0]};
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useCommentForCard(cardId: string) {
  const query = useCommentsForCardQuery(
    {id: cardId},
    {
      select: (data) =>
        data?.commentsForCard?.filter(notEmpty).filter((c) => !c?.parentId),
    }
  );
  return query;
}

export function useCardHistory(
  cardId?: string,
  opts?: UseQueryOptions<CardHistoryQuery, Error, CardHistoryQuery>
) {
  const queryResult = useCardHistoryQuery(
    {id: cardId || ''},
    {
      ...opts,
      select: (data) => ({
        ...data,
        ca: data?.cardHistory?.filter((card) => card?._siteValidTime),
      }),
      enabled: !!cardId,
      staleTime: 5000,
    }
  );
  return {...queryResult, history: queryResult.data?.ca};
}
