/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BookOpenIcon, DatabaseIcon } from '@heroicons/react/solid';
import {
  LocationGenerics,
  useCardHistory,
  useRollbackCardMutation,
  useCardByIdsQuery,
  useKanbanDataQuery,
  useCardHistoryQuery,
  CardHistoryQuery,
} from '@juxt-home/site';
import { Modal, Table } from '@juxt-home/ui-common';
import { notEmpty, useMobileDetect } from '@juxt-home/utils';
import { useMemo, useState } from 'react';
import { useSearch } from 'react-location';
import { useQueryClient } from 'react-query';
import { CellProps } from 'react-table';
import { toast } from 'react-toastify';
import { workflowId } from '../../constants';
import { CardView } from './CardView';

type TCardHistoryCard = NonNullable<
  NonNullable<CardHistoryQuery['cardHistory']>[0]
>;

function TitleComponent({ value }: CellProps<TCardHistoryCard>) {
  return <div className="text-sm truncate">{value || 'Untitled'}</div>;
}

export function CardHistory() {
  const [showPreviewModal, setShowPreviewModal] = useState<boolean | number>(
    false,
  );

  const handleClose = () => {
    setShowPreviewModal(false);
  };
  const screen = useMobileDetect();
  const isMobile = screen.isMobile();

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
      <div className="flex flex-row justify-between">
        <button
          type="button"
          title="Rollback"
          className="mt-3"
          onClick={() => handleRollback(row.original)}>
          {isMobile ? (
            <p className="preview-text">Rollback</p>
          ) : (
            <DatabaseIcon className="preview-icon" aria-hidden="true" />
          )}
        </button>

        <button
          type="button"
          title="Preview"
          className="mt-3"
          onClick={() => setShowPreviewModal(row.index)}>
          {isMobile ? (
            <p className="preview-text">Preview</p>
          ) : (
            <BookOpenIcon className="preview-icon" aria-hidden="true" />
          )}
        </button>
      </div>
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
          const taskHtmlChanged =
            history[i + 1] && history[i + 1]?.taskHtml !== card?.taskHtml;
          const nothingChanged =
            !titleChanged &&
            !hasDescriptionChanged &&
            !projectChanged &&
            !cvChanged &&
            !agentChanged &&
            !locationChanged &&
            !stateChanged &&
            !taskHtmlChanged &&
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
              taskHtmlChanged && 'task changed',
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

  const isOpen = typeof showPreviewModal === 'number';
  const previousDisabled =
    history !== undefined && showPreviewModal === history.length - 1;
  const nextDisabled = showPreviewModal === 0;
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
          <Modal
            isOpen={isOpen}
            handleClose={handleClose}
            hasPrevAndNextBtn
            previousDisabled={previousDisabled}
            nextDisabled={nextDisabled}
            updatePrev={() => setShowPreviewModal(+showPreviewModal + 1)}
            updateNext={() => setShowPreviewModal(+showPreviewModal - 1)}>
            {typeof showPreviewModal === 'number' &&
              history?.[showPreviewModal] && (
                <CardView card={history[showPreviewModal]!} />
              )}
          </Modal>
        </div>
      </div>
    </div>
  );
}
