import { useHotkeys } from 'react-hotkeys-hook';
import { notEmpty } from '@juxt-home/utils';
import * as _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DraggableLocation,
  DragDropContext,
  Droppable,
} from 'react-beautiful-dnd';
import { useSearch, useNavigate } from 'react-location';
import { useQueryClient } from 'react-query';
import { Column, Row } from 'react-table';
import {
  defaultMutationProps,
  filteredCards,
  filteredCols,
  moveCard,
} from './utils';
import {
  TWorkflow,
  TWorkflowState,
  LocationGenerics,
  useModalForm,
  useKanbanDataQuery,
  useMoveCardMutation,
  useUpdateCardPositionMutation,
} from '@juxt-home/site';
import {
  SelectColumnFilter,
  Table,
  DateFilter,
  DateFilterFn,
} from '@juxt-home/ui-common';
import { Heading } from './Headings';
import { WorkflowStateContainer } from './WorkflowState';

function processWorkflow(workflow: TWorkflow, projectId: string | undefined) {
  if (!workflow) return null;
  const workflowStates = workflow?.workflowStates.filter(notEmpty) || [];
  return {
    ...workflow,
    workflowStates: workflowStates.map((c) => ({
      ...c,
      cards: filteredCards(c.cards?.filter(notEmpty), projectId),
    })),
  };
}

export function Workflow({ workflow }: { workflow: TWorkflow }) {
  const search = useSearch<LocationGenerics>();
  const { workflowProjectId, devMode } = search;
  const data = useMemo(
    () => processWorkflow(workflow, workflowProjectId),
    [workflow, workflowProjectId],
  );
  const [filteredState, setState] = useState<TWorkflow>();
  const unfilteredWorkflow = useKanbanDataQuery()?.data?.allWorkflows?.find(
    (c) => c?.id === workflow?.id,
  );

  useEffect(() => {
    if (data) {
      setState(data);
    }
  }, [data]);

  const queryClient = useQueryClient();
  const updateCardPosMutation = useUpdateCardPositionMutation({
    ...defaultMutationProps(queryClient),
  });
  const moveCardMutation = useMoveCardMutation({
    ...defaultMutationProps(queryClient),
  });

  const updateServerCards = useCallback(
    (
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
          cardIds: _.uniq(cardsInSourceCol),
        });
      } else if (endCol) {
        moveCardMutation.mutate({
          workflowStateId: endCol?.id,
          cardId: draggableId,
          previousCard: prevCardId || 'start',
        });
      }
    },
    [moveCardMutation, updateCardPosMutation],
  );

  const [, setIsAddCard] = useModalForm({
    formModalType: 'addCard',
    workflowId: workflow?.id,
  });

  useHotkeys('c', () => {
    setIsAddCard(true);
  });
  const [isDragging, setIsDragging] = useState(false);
  const isGrid = search.view === 'table';

  const cols = useMemo(
    () =>
      (filteredState && filteredCols({ filteredState, devMode: !!devMode })) ||
      [],
    [filteredState, devMode],
  );
  const gridData = useMemo(() => {
    return [
      ...cols
        .filter(notEmpty)
        .flatMap((c) => [
          ...c.cards.map((card) => ({ ...card, state: c.name })),
        ]),
    ];
  }, [cols]);
  const gridColumns: Array<Column> = useMemo(
    () => [
      {
        Header: 'id',
        accessor: 'id',
      },
      {
        id: 'name',
        Header: 'Name',
        accessor: 'title',
      },
      {
        id: 'state',
        Header: 'State',
        accessor: 'state',
        Filter: SelectColumnFilter,
      },
      {
        id: 'created',
        Header: 'Created',
        accessor: 'createdAt',
        Filter: DateFilter,
        filter: DateFilterFn,
      },
      {
        id: 'lastUpdated',
        Header: 'Last Edited',
        accessor: '_siteValidTime',
        Filter: DateFilter,
        filter: DateFilterFn,
      },
    ],
    [],
  );
  const navigate = useNavigate<LocationGenerics>();

  const openCardForm = ({ values }: { values: typeof gridColumns[0] }) => {
    const cardId = values.id;
    if (cardId) {
      navigate({
        replace: true,
        search: {
          ...search,
          modalState: {
            cardId,
            formModalType: 'editCard',
            workflowId: workflow?.id,
            workflowStateId: workflow?.workflowStates.find((state) =>
              state?.cards?.find((c) => c?.id === cardId),
            )?.id,
          },
        },
      });
    }
  };

  return (
    <div className="px-4 h-full-minus-nav">
      <Heading workflow={workflow} handleAddCard={() => setIsAddCard(true)} />
      {isGrid && (
        <Table
          onRowClick={openCardForm}
          hiddenColumns={['id']}
          data={gridData}
          columns={gridColumns}
        />
      )}
      {!isGrid && filteredState && (
        <DragDropContext
          onDragStart={() => setIsDragging(true)}
          onDragEnd={({ destination, source, draggableId }) => {
            setIsDragging(false);
            if (
              !destination ||
              (destination.droppableId === source.droppableId &&
                destination.index === source.index)
            ) {
              return;
            }
            const newFilteredState = moveCard(
              filteredState,
              source,
              destination,
            );
            const startCol = cols.find((c) => c.id === source.droppableId);
            const endCol = cols.find((c) => c.id === destination.droppableId);
            const prevCardId =
              destination.index === 0
                ? false
                : newFilteredState?.workflowStates.find(
                    (state) => state?.id === destination.droppableId,
                  )?.cards?.[destination.index - 1]?.id;
            if (!startCol || !endCol) return;

            if (!workflowProjectId && newFilteredState) {
              // if there are no filters, just use the local state in the mutation
              updateServerCards(
                newFilteredState,
                startCol,
                endCol,
                source,
                destination,
                draggableId,
                prevCardId,
              );
            } else {
              // if there are filters, things are more tricky...
              // the general idea is to find the card behind the new location of our dragged card
              // and then find that previousCards index in the unfiltered workflow-state
              // then we can move the card in the unfiltered workflow-state and use that to update the server

              const unfilteredStartCol =
                unfilteredWorkflow?.workflowStates.find(
                  (c) => c?.id === source.droppableId,
                );
              const unfilteredEndCol = unfilteredWorkflow?.workflowStates.find(
                (c) => c?.id === destination.droppableId,
              );
              const unfilteredSourceIdx =
                unfilteredStartCol?.cards?.findIndex(
                  (c) => c?.id === draggableId,
                ) || source.index;
              const newEndCol = newFilteredState?.workflowStates.find(
                (c) => c?.id === destination.droppableId,
              );
              const unfilteredCardIdx = newEndCol?.cards?.findIndex(
                (c) => c?.id === draggableId,
              );
              const endCards = newEndCol?.cards?.filter(notEmpty) || [];
              const prevUnfilteredCardId =
                destination.index === 0
                  ? undefined
                  : !!unfilteredCardIdx && endCards[unfilteredCardIdx - 1]?.id;
              const prevCardIdx = unfilteredEndCol?.cards?.findIndex(
                (c) => c?.id === prevUnfilteredCardId,
              );
              const unfilteredSource = {
                ...source,
                index: unfilteredSourceIdx,
              };
              if (typeof prevCardIdx !== 'number') {
                return;
              }
              const isSameColMoveDown =
                source.droppableId === destination.droppableId &&
                source.index < destination.index;
              const newCardIdx = isSameColMoveDown
                ? prevCardIdx
                : prevCardIdx + 1;
              const unfilteredDestination = {
                ...destination,
                index: newCardIdx,
              };

              if (
                unfilteredStartCol &&
                unfilteredEndCol &&
                unfilteredWorkflow
              ) {
                const newState = moveCard(
                  unfilteredWorkflow,
                  unfilteredSource,
                  unfilteredDestination,
                );
                if (newState) {
                  updateServerCards(
                    newState,
                    unfilteredStartCol,
                    unfilteredEndCol,
                    unfilteredSource,
                    unfilteredDestination,
                    draggableId,
                    prevCardId,
                  );
                }
              }
            }

            setState(newFilteredState);
          }}>
          {workflow && (
            <Droppable
              droppableId="workflowStates"
              direction="horizontal"
              type="workflowState">
              {(provided) => (
                <WorkflowStateContainer
                  key={provided.droppableProps['data-rbd-droppable-context-id']}
                  isDragging={isDragging}
                  workflow={workflow}
                  provided={provided}
                  cols={cols}
                />
              )}
            </Droppable>
          )}
        </DragDropContext>
      )}
    </div>
  );
}
