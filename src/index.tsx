import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  KanbanDataQuery,
  useKanbanDataQuery,
  useUpdateCardMutation,
  Column as TColumn,
  Card as TCard,
} from "./generated/graphql";

import "./styles.css";
import { QueryClient, QueryClientProvider, UseQueryResult } from "react-query";

const queryClient = new QueryClient();

type Boards = NonNullable<KanbanDataQuery["allBoards"]>;
type Board = Boards[0];

export function isDefined<T>(argument: T | undefined): argument is T {
  return argument !== undefined;
}
export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  if (value === null || value === undefined) return false;
  return true;
}

function indexById<T extends { id: string }>(
  array: Array<T>
): { [id: string]: T } {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item.id]: item,
    };
  }, initialValue);
}

const CardContainer = styled.div<{ isDragging: boolean }>`
  border: 1px solid lightgrey;
  padding: 8px;
  border-radius: 2px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.isDragging ? "red" : "white")};
  transition: background 0.1s;
`;

interface CardProps {
  card: TCard;
  index: number;
}

const DraggableCard = React.memo(({ card, index }: CardProps) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <CardContainer
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {card.title}
        </CardContainer>
      )}
    </Draggable>
  );
});

const Container = styled.div<{ isDragging: boolean }>`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 200px;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => (props.isDragging ? "lightgreen" : "white")};
`;
const Title = styled.h3`
  padding: 8px;
`;
const List = styled.div<{ isDraggingOver: boolean }>`
  padding: 8px;
  transition: background 0.1s;
  background-color: ${(props) =>
    props.isDraggingOver ? "lightgrey" : "inherit "};
  flex-grow: 1;
`;

const Columns = styled.div`
  display: flex;
`;

type ColumnProps = {
  column: TColumn;
  cards: TCard[];
};

const Column = React.memo(({ column, cards }: ColumnProps) => (
  <Container isDragging={false}>
    <Title>{column.name}</Title>
    <Droppable droppableId={column.id} type="card">
      {(provided, snapshot) => (
        <List
          ref={provided.innerRef}
          {...provided.droppableProps}
          isDraggingOver={snapshot.isDraggingOver}
        >
          {cards.map((t, i) => (
            <DraggableCard key={t.id} card={t} index={i} />
          ))}
          {provided.placeholder}
        </List>
      )}
    </Droppable>
  </Container>
));

function processBoard(board: Board) {
  const columns = board?.columns || [];
  const indexedCols = indexById(columns.filter(notEmpty));
  const columnOrder = columns.map((column) => column?.id).filter(notEmpty);
  return {
    cards:
      board?.cards.filter(notEmpty).sort((a, b) => a.priority - b.priority) ||
      [],
    columns: indexedCols,
    columnOrder,
  };
}

function immutableMove<T>(arr: Array<T>, from: number, to: number) {
  return arr.reduce((prev, current, idx, self) => {
    if (from === to) {
      prev.push(current);
    }
    if (idx === from) {
      return prev;
    }
    if (from < to) {
      prev.push(current);
    }
    if (idx === to) {
      prev.push(self[from]);
    }
    if (from > to) {
      prev.push(current);
    }
    return prev;
  }, [] as Array<T>);
}

function Board({ board }: { board: Board }) {
  const data = React.useMemo(() => processBoard(board), [board]);
  const [state, setState] = React.useState(data);

  React.useEffect(() => {
    console.log("Board changed");
    setState(data);
  }, [data]);
  const updateMutation = useUpdateCardMutation({
    onSettled: () => {
      queryClient.refetchQueries(useKanbanDataQuery.getKey());
    },
  });
  return (
    <>
      <h1>{board?.name}</h1>
      {board?.description && <p>{board.description}</p>}
      <DragDropContext
        onDragEnd={({ destination, source, draggableId }) => {
          const draggedCard = state.cards.find(
            (card) => card.id === draggableId
          );
          if (!destination || !draggedCard) {
            return;
          }
          if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
          ) {
            return;
          }

          const startcol = state.columns[source.droppableId];
          const endcol = state.columns[destination.droppableId];
          const orderedCards = immutableMove(
            state.cards,
            source.index,
            destination.index
          );
          if (startcol === endcol) {
            orderedCards.map((card, index) => {
              if (card.priority !== index) {
                updateMutation.mutate({
                  cardId: card.id,
                  priority: index,
                });
              }
            });

            const newState = {
              ...state,
              cards: orderedCards,
            };
            setState(newState);
            return;
          }
          const startColCards = [
            ...startcol.cards
              .filter((card) => card?.id !== draggableId)
              .filter(notEmpty),
          ];
          const newStart = {
            ...startcol,
            cards: startColCards,
          };
          const endColCards = [...endcol.cards.filter(notEmpty)];
          endColCards.splice(destination.index, 0, draggedCard);
          const newEnd = {
            ...endcol,
            cards: endColCards,
          };
          const newCards = [
            ...state.cards
              .filter((card) => card?.id !== draggableId)
              .filter(notEmpty),
            { ...draggedCard, priority: destination.index },
          ].sort((a, b) => a.priority - b.priority);
          const newState = {
            ...state,
            cards: newCards,
            columns: {
              ...state.columns,
              [newStart.id]: newStart,
              [newEnd.id]: newEnd,
            },
          };
          setState(newState);
          updateMutation.mutate({
            cardId: draggedCard.id,
            priority: destination.index,
            columnId: endcol.id,
          });
        }}
      >
        <Droppable droppableId="columns" direction="horizontal" type="column">
          {(provided) => (
            <Columns {...provided.droppableProps} ref={provided.innerRef}>
              {state.columnOrder.map((id) => {
                const col = state.columns[id];
                const cards = state.cards.filter((card) =>
                  col.cards.find((task) => task && task.id === card.id)
                );

                return (
                  <Column
                    key={col.id}
                    column={col as TColumn}
                    cards={cards as TCard[]}
                  />
                );
              })}
              {provided.placeholder}
            </Columns>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}

function App() {
  const kanbanQueryResult = useKanbanDataQuery();
  const boards = kanbanQueryResult.data?.allBoards || [];

  return (
    <div>
      {kanbanQueryResult.isLoading && <div>Loading...</div>}
      {boards.length > 0 &&
        boards
          .filter(notEmpty)
          .map((board) => <Board key={board.id} board={board} />)}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
  rootElement
);
