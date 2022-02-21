import {
  LocationGenerics,
  useCardHistory,
  useRollbackCardMutation,
  useCardByIdsQuery,
  useKanbanDataQuery,
  useCardHistoryQuery,
  CardHistoryQuery,
} from '@juxt-home/site';
import { Table } from '@juxt-home/ui-common';
import { notEmpty } from '@juxt-home/utils';
import { useMemo } from 'react';
import { useSearch } from 'react-location';
import { useQueryClient } from 'react-query';
import { CellProps } from 'react-table';
import { toast } from 'react-toastify';
import { workflowId } from '../../constants';

type TCardHistoryCard = NonNullable<
  NonNullable<CardHistoryQuery['cardHistory']>[0]
>;

function TitleComponent({ value }: CellProps<TCardHistoryCard>) {
  return <div className="text-sm truncate">{value || 'Untitled'}</div>;
}

export function CardHistory() {
  const cardId = useSearch<LocationGenerics>().modalState?.cardId;
  const { history, isLoading, isError, error } = useCardHistory(cardId);
  const queryClient = useQueryClient();
  const rollbackMutation = useRollbackCardMutation({
    onSettled: (data) => {
      const id = data?.rollbackCard?.id || '';
      queryClient.refetchQueries(useCardByIdsQuery.getKey({ ids: [id] }));
      queryClient.refetchQueries(useKanbanDataQuery.getKey({ id: workflowId }));
      queryClient.refetchQueries(useCardHistoryQuery.getKey({ id }));
    },
  });
  const handleRollback = async (card: TCardHistoryCard) => {
    toast.promise(
      rollbackMutation.mutateAsync({ id: card.id, asOf: card._siteValidTime }),
      {
        success: 'Card rolled back successfully',
        error: 'Card rollback failed',
        pending: 'Rolling back card...',
      },
    );
  };
  // eslint-disable-next-line react/no-unstable-nested-components
  function RollbackButton({ row }: CellProps<TCardHistoryCard>) {
    return (
      <button
        type="button"
        className="inline-flex justify-center items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => handleRollback(row.original)}>
        Rollback
      </button>
    );
  }

  const data = useMemo(
    () =>
      history
        ?.filter(notEmpty)
        .filter((h) => h._siteSubject)
        .map((card, i) => {
          const hasDescriptionChanged =
            history[i + 1] && history[i + 1]?.description !== card?.description;
          const projectChanged =
            history[i + 1] &&
            history[i + 1]?.project?.name !== card?.project?.name;
          const cvChanged =
            history[i + 1] && history[i + 1]?.cvPdf?.name !== card?.cvPdf?.name;
          const filesChanged =
            history[i + 1] &&
            history[i + 1]?.files?.map((f) => f?.name).toString() !==
              card?.files?.map((f) => f?.name).toString();
          const titleChanged =
            history[i + 1] && history[i + 1]?.title !== card?.title;
          const locationChanged =
            history[i + 1] && history[i + 1]?.location !== card?.location;
          const agentChanged =
            history[i + 1] && history[i + 1]?.agent !== card?.agent;
          const stateChanged =
            history[i + 1] && history[i + 1]?.stateStr !== card?.stateStr;
          const nothingChanged =
            !titleChanged &&
            !hasDescriptionChanged &&
            !projectChanged &&
            !cvChanged &&
            !agentChanged &&
            !locationChanged &&
            !stateChanged &&
            !filesChanged;

          return {
            ...card,
            nothingChanged,
            hasDescriptionChanged,
            projectChanged,
            cvChanged,
            filesChanged,
            titleChanged,
            diff: [
              titleChanged && 'Title changed',
              hasDescriptionChanged && 'description changed',
              projectChanged && 'project changed',
              cvChanged && 'cv changed',
              stateChanged && `state changed to ${card.stateStr}`,
              filesChanged && 'files changed',
              agentChanged && 'agent changed',
              locationChanged && 'location changed',
            ]
              .filter((s) => s)
              .join(', '),
          };
        }),
    [history],
  );

  const cols = useMemo(
    () => [
      {
        Header: 'Diff',
        accessor: 'diff',
      },
      {
        Header: 'Title',
        accessor: 'title',
        Cell: TitleComponent,
      },
      {
        Header: 'Project',
        accessor: 'project.name',
      },
      {
        Header: 'Edited By',
        accessor: '_siteSubject',
      },
      {
        Header: 'Updated at',
        accessor: '_siteValidTime',
      },
      {
        Header: 'Actions',
        Cell: RollbackButton,
      },
    ],
    [],
  );

  return (
    <div className="relative h-full">
      <div className="flex flex-col lg:flex-row justify-around items-center lg:items-start h-full">
        <div className="flex flex-col h-full w-full overflow-x-auto lg:w-fit lg:overflow-x-hidden px-4 relative">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {isLoading
                ? 'Loading...'
                : isError
                ? `Error: ${error?.name} - ${error?.message}`
                : 'Card History'}
            </h1>
          </div>
          {history && <Table columns={cols} data={data} />}
        </div>
      </div>
    </div>
  );
}
