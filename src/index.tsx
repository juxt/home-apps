import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  useKanbanDataQuery,
  useUpdateCardMutation,
  Column as TColumn,
  useCreateCardMutation,
} from "./generated/graphql";
import { TBoard, TCard } from "./types";
import { immutableMove, moveCard, notEmpty } from "./kanbanHelpers";

import "./styles.css";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const CardContainer = styled.div<{ isDragging: boolean }>`
  border: 1px solid lightgrey;
  padding: 8px;
  border-radius: 2px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.isDragging ? "red" : "white")};
  transition: background 0.1s;
`;

type CardProps = {
  card: TCard;
  index: number;
};

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

function processBoard(board: TBoard) {
  const columns = board?.columns.filter(notEmpty) || [];
  return {
    ...board,
    columns: columns.map((c) => ({
      ...c,
      cards: c.cards
        .filter((card) => board?.cards.find((bCard) => bCard?.id === card?.id))
        .filter(notEmpty)
        .sort((a, b) => a.priority - b.priority),
    })),
  };
}

function Board({ board }: { board: TBoard }) {
  const data = React.useMemo(() => processBoard(board), [board]);
  const [state, setState] = React.useState<TBoard>();
  React.useEffect(() => {
    if (data?.name) {
      setState(data as TBoard);
    }
  }, [data]);
  const cols =
    state?.columns.filter(notEmpty).map((c) => {
      return {
        ...c,
        cards: c.cards.filter(notEmpty),
      };
    }) || [];

  const updateMutation = useUpdateCardMutation({
    onSettled: () => {
      queryClient.refetchQueries(useKanbanDataQuery.getKey());
    },
  });
  const addMutation = useCreateCardMutation({
    onSettled: () => {
      queryClient.refetchQueries(useKanbanDataQuery.getKey());
    },
  });
  const addCard = () => {
    if (!board) return;
    const newCard = {
      title: "New Card" + Math.random(),
      priority: 0,
      description: "",
      boardId: board.id,
      columnId: cols[0].id,
    };
    addMutation.mutate({
      ...newCard,
    });
  };

  return (
    <>
      <h1>{data?.name}</h1>
      {data?.description && <p>{data.description}</p>}
      <button onClick={addCard}>Add Card</button>
      {state && (
        <DragDropContext
          onDragEnd={({ destination, source, draggableId }) => {
            if (
              !destination ||
              (destination.droppableId === source.droppableId &&
                destination.index === source.index)
            ) {
              return;
            }
            const newState = moveCard(state, source, destination);
            newState?.columns.filter(notEmpty).map((col) => {
              col.cards.filter(notEmpty).map((card, index) => {
                if (card.id === draggableId || card.priority !== index) {
                  updateMutation.mutate({
                    cardId: card.id,
                    columnId: col.id,
                    priority: index,
                  });
                }
              });
            });
            setState(newState);
          }}
        >
          <Droppable droppableId="columns" direction="horizontal" type="column">
            {(provided) => (
              <Columns {...provided.droppableProps} ref={provided.innerRef}>
                {cols.map((col) => {
                  return <Column key={col.id} column={col} cards={col.cards} />;
                })}
                {provided.placeholder}
              </Columns>
            )}
          </Droppable>
        </DragDropContext>
      )}
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
