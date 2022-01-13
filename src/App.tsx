import { AddBoardModal, UpdateBoardModal } from "./components/BoardForms";
import { AddColumnModal } from "./components/ColumnForms";
import { AddCardModal } from "./components/CardForms";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  useKanbanDataQuery,
  useDeleteBoardMutation,
  useDeleteColumnMutation,
  useMoveCardMutation,
} from "./generated/graphql";
import { BoardFormModalTypes, TBoard, TCard, TColumn } from "./types";
import { defaultMutationProps, moveCard, notEmpty } from "./kanbanHelpers";
import { useQueryClient } from "react-query";
import React from "react";

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
          {card.id + " " + card.title + " " + card?.description}
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
  board: NonNullable<TBoard>;
};

const Column = React.memo(({ column, cards, board }: ColumnProps) => {
  const queryClient = useQueryClient();
  const deleteColMutation = useDeleteColumnMutation({
    ...defaultMutationProps(queryClient),
  });
  const boardColumns = board?.columns.filter(notEmpty);
  return (
    <Container isDragging={false}>
      <button
        onClick={() => {
          const hasCards = cards.length > 0;
          if (hasCards) {
            alert(
              "Cannot delete a column with cards, please move them somewhere else"
            );
            return;
          }
          return deleteColMutation.mutate({
            id: column.id,
            boardId: board.id,
            columnIds: [
              ...boardColumns
                .filter((c) => c.id !== column.id)
                .map((c) => c.id),
            ],
          });
        }}
      >
        Delete
      </button>
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
  );
});

function processBoard(board: TBoard) {
  const columns = board?.columns.filter(notEmpty) || [];
  return {
    ...board,
    columns: columns.map((c) => ({
      ...c,
      cards: c.cards.filter(notEmpty),
    })),
  };
}

function Board({ board }: { board: TBoard }) {
  const data = React.useMemo(() => processBoard(board), [board]);
  const [state, setState] = React.useState<TBoard>();
  React.useEffect(() => {
    if (data?.name) {
      // no idea why typescript thinks data.name is possibly undefined here...
      setState(data as TBoard);
      console.log("board update from server");
    }
  }, [data]);
  const cols =
    state?.columns.filter(notEmpty).map((c) => {
      return {
        ...c,
        cards: c.cards.filter(notEmpty),
      };
    }) || [];
  const queryClient = useQueryClient();
  const moveCardMutation = useMoveCardMutation({
    ...defaultMutationProps(queryClient),
  });
  const deleteBoardMutation = useDeleteBoardMutation({
    ...defaultMutationProps(queryClient),
  });
  const [formModal, setFormModal] = React.useState<BoardFormModalTypes>();

  const crudButtonClass = "px-4";
  return (
    <>
      <div className="flex bg-red-500 justify-between max-w-lg">
        {board?.id && (
          <>
            <UpdateBoardModal
              isOpen={formModal === "editBoard"}
              setIsOpen={setFormModal}
              board={board}
            />
            <AddColumnModal
              isOpen={formModal === "addColumn"}
              setIsOpen={setFormModal}
              board={board}
              cols={cols}
            />
            <AddCardModal
              isOpen={formModal === "addCard"}
              setIsOpen={setFormModal}
              board={board}
              cols={cols}
            />
          </>
        )}

        <h1>{data?.name}</h1>
        <div className="flex justify-around">
          <button
            className={crudButtonClass}
            onClick={() => setFormModal("editBoard")}
          >
            Edit
          </button>

          <button
            className={crudButtonClass}
            onClick={() =>
              data?.id && deleteBoardMutation.mutate({ boardId: data.id })
            }
          >
            Delete
          </button>
          <button onClick={() => setFormModal("addColumn")}>Add Column</button>
          <button onClick={() => setFormModal("addCard")}> Add Card</button>
        </div>
      </div>
      {data?.description && <p>{data.description}</p>}

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
            const startCol = cols.find((c) => c.id === source.droppableId);
            const endCol = cols.find((c) => c.id === destination.droppableId);
            if (startCol) {
              const cards =
                newState?.columns
                  .filter(notEmpty)
                  .find((c) => c.id === source.droppableId)
                  ?.cards.filter(notEmpty)
                  .map((c) => c.id) || [];
              moveCardMutation.mutate({
                columnId: startCol?.id,
                cardIds: cards,
              });
            }

            if (endCol && startCol !== endCol) {
              const cards =
                newState?.columns
                  .filter(notEmpty)
                  .find((c) => c.id === destination.droppableId)
                  ?.cards.filter(notEmpty)
                  .map((c) => c.id) || [];
              moveCardMutation.mutate({
                columnId: endCol?.id,
                cardIds: cards,
              });
            }

            setState(newState);
          }}
        >
          <Droppable droppableId="columns" direction="horizontal" type="column">
            {(provided) => (
              <Columns {...provided.droppableProps} ref={provided.innerRef}>
                {cols.map((col) => {
                  return (
                    <Column
                      key={col.id}
                      column={col}
                      board={board as NonNullable<TBoard>}
                      cards={col.cards}
                    />
                  );
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

export function App() {
  const kanbanQueryResult = useKanbanDataQuery();
  const boards = kanbanQueryResult.data?.allBoards || [];
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] =
    React.useState<BoardFormModalTypes>(false);

  return (
    <div>
      {kanbanQueryResult.isLoading && <div>Loading...</div>}
      <AddBoardModal isOpen={!!isModalOpen} setIsOpen={setIsModalOpen} />
      <button
        onClick={() => {
          queryClient.refetchQueries(["allColumns"]);
          return setIsModalOpen("addBoard");
        }}
      >
        Add Board
      </button>
      {boards.length > 0 &&
        boards
          .filter(notEmpty)
          .map((board) => <Board key={board.id} board={board} />)}
    </div>
  );
}
