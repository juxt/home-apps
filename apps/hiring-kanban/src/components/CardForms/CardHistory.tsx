/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BookOpenIcon,
  DatabaseIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/solid';
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
import { notEmpty } from '@juxt-home/utils';
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

function DoubleIconDisabled({
  title,
  updatePreview,
  leftIcon,
  rightIcon,
}: {
  title: string;
  updatePreview: () => void;
  leftIcon: boolean;
  rightIcon: boolean;
}) {
  return (
    <button type="button" title={title} disabled onClick={() => updatePreview}>
      {leftIcon && (
        <ChevronDoubleLeftIcon
          aria-hidden="true"
          className="absolute -mt-60 ml-10  h-8 w-8 text-stone-400 cursor-not-allowed"
        />
      )}
      {rightIcon && (
        <ChevronDoubleRightIcon
          aria-hidden="true"
          className="absolute -mt-60 h-8 w-8 text-stone-400 cursor-not-allowed"
          style={{ marginLeft: '50rem' }}
        />
      )}
      )
    </button>
  );
}

export function CardHistory() {
  const [showPreviewModal, setShowPreviewModal] = useState<boolean | number>(
    false,
  );

  const handleClose = () => {
    setShowPreviewModal(false);
  };

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
          <DatabaseIcon
            className="h-5 w-8 text-stone-700 hover:text-indigo-700"
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          title="Preview"
          className="mt-3"
          onClick={() => setShowPreviewModal(row.index)}>
          <BookOpenIcon
            className="h-6 w-8 text-stone-700 hover:text-indigo-700"
            aria-hidden="true"
          />
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

          <Modal isOpen={!!showPreviewModal} handleClose={handleClose}>
            {typeof showPreviewModal === 'number' &&
              history?.[showPreviewModal] && (
                <>
                  <CardView card={history[showPreviewModal]!} />
                  {showPreviewModal === history.length - 1 ? (
                    <DoubleIconDisabled
                      title="Previous"
                      updatePreview={() =>
                        setShowPreviewModal(showPreviewModal + 1)
                      }
                      leftIcon
                      rightIcon={false}
                    />
                  ) : (
                    <button
                      type="button"
                      title="Previous"
                      onClick={() => setShowPreviewModal(showPreviewModal + 1)}>
                      <ChevronDoubleLeftIcon
                        className="absolute -mt-60 ml-10  h-8 w-8 text-stone-400 hover:text-indigo-700"
                        aria-hidden="true"
                      />
                    </button>
                  )}

                  {showPreviewModal === 0 ? (
                    <DoubleIconDisabled
                      title="Next"
                      updatePreview={() =>
                        setShowPreviewModal(showPreviewModal - 1)
                      }
                      rightIcon
                      leftIcon={false}
                    />
                  ) : (
                    <button
                      type="button"
                      title="Next"
                      onClick={() => setShowPreviewModal(showPreviewModal - 1)}>
                      <ChevronDoubleRightIcon
                        style={{ marginLeft: '50rem' }}
                        className="absolute -mt-60 h-8 w-8 text-stone-400 hover:text-indigo-700"
                        aria-hidden="true"
                      />
                    </button>
                  )}
                </>
              )}
          </Modal>
        </div>
      </div>
    </div>
  );
}
