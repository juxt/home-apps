import { AddBoardModal, UpdateBoardModal } from "./components/BoardForms";
import NaturalDragAnimation from "natural-drag-animation-rbdnd";
import { useModalForm } from "./hooks";
import { AddColumnModal, UpdateColumnModal } from "./components/ColumnForms";
import { AddCardModal, UpdateCardModal } from "./components/CardForms";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  useKanbanDataQuery,
  useDeleteBoardMutation,
  useDeleteColumnMutation,
  useMoveCardMutation,
  useCardHistoryQuery,
} from "./generated/graphql";
import { LocationGenerics, TBoard, TCard, TColumn } from "./types";
import {
  defaultMutationProps,
  hasDuplicateCards,
  moveCard,
  notEmpty,
} from "./kanbanHelpers";
import { useQueryClient } from "react-query";
import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-location";
import classNames from "classnames";

type CardProps = {
  card: TCard;
  board: TBoard;
  index: number;
};

const DraggableCard = React.memo(({ card, index, board }: CardProps) => {
  const [, setIsOpen] = useModalForm({
    formModalType: "editCard",
    card: card,
    board: board,
  });
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => {
        const isDragging = snapshot.isDragging;
        const cardStyles = classNames(
          "bg-white rounded border-2 mb-2 p-2 border-gray-500 hover:border-blue-400",
          isDragging && "bg-blue-50 border-blue-400"
        );

        return (
          <NaturalDragAnimation
            style={provided.draggableProps.style}
            snapshot={snapshot}
          >
            {(style: object) => (
              <div
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={style}
                className={cardStyles}
                onClick={() => board?.id && setIsOpen(true)}
                ref={provided.innerRef}
              >
                <pre>{card.id}</pre>
                <p>{card.title}</p>
                {card?.description && card.description !== "<p></p>" && (
                  <div
                    className="ProseMirror h-auto w-full"
                    dangerouslySetInnerHTML={{ __html: card.description }}
                  />
                )}
              </div>
            )}
          </NaturalDragAnimation>
        );
      }}
    </Draggable>
  );
});

const Container = styled.div<{ isDragging: boolean }>`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 210px;
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
  const [, setEditColumnOpen] = useModalForm({
    formModalType: "editColumn",
    column,
  });
  const boardColumns = board?.columns.filter(notEmpty);
  return (
    <Container isDragging={false}>
      <button onClick={() => setEditColumnOpen(true)}>Edit Column</button>
      <button
        onClick={() => {
          const hasCards = cards.length > 0;
          if (hasCards) {
            toast.error(
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
              <DraggableCard key={t.id} card={t} board={board} index={i} />
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </Container>
  );
});

function processBoard(board: TBoard) {
  if (!board) return null;
  const columns = board?.columns.filter(notEmpty) || [];
  return {
    ...board,
    columns: columns.map((c) => ({
      ...c,
      cards: c.cards?.filter(notEmpty) || [],
    })),
  };
}

function Board({ board }: { board: TBoard }) {
  if (!board?.id) return null;
  const data = React.useMemo(() => processBoard(board), [board]);
  const [state, setState] = React.useState<TBoard>();
  React.useEffect(() => {
    if (data) {
      setState(data);
      console.log("board update from server");
    }
  }, [data]);
  const cols =
    state?.columns.filter(notEmpty).map((c) => {
      return {
        ...c,
        cards: c.cards?.filter(notEmpty) || [],
      };
    }) || [];
  const queryClient = useQueryClient();
  const moveCardMutation = useMoveCardMutation({
    ...defaultMutationProps(queryClient),
  });
  const deleteBoardMutation = useDeleteBoardMutation({
    ...defaultMutationProps(queryClient),
  });

  const navigate = useNavigate<LocationGenerics>();
  const [, setIsUpdateBoard] = useModalForm({
    formModalType: "editBoard",
    board: board,
  });
  const [, setIsAddColumn] = useModalForm({
    formModalType: "addColumn",
    board: board,
  });
  const [, setIsAddCard] = useModalForm({
    formModalType: "addCard",
    board: board,
  });
  const crudButtonClass = "px-4";
  return (
    <>
      <div className="flex bg-red-500 justify-between max-w-lg">
        <h1>{data?.name}</h1>
        <div className="flex justify-around">
          <button
            className={crudButtonClass}
            onClick={() => {
              if (!board?.id) {
                toast.error("No Board ID Found");
                return;
              }
              setIsUpdateBoard(true);
            }}
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
          <button onClick={() => setIsAddColumn(true)}>Add Column</button>
          <button onClick={() => setIsAddCard(true)}> Add Card</button>
        </div>
      </div>
      {data?.description && <p>{data.description}</p>}

      {state && (
        <DragDropContext
          onDragEnd={({ destination, source }) => {
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
            if (
              (startCol && hasDuplicateCards(startCol)) ||
              (endCol && hasDuplicateCards(endCol))
            ) {
              toast.error("Cannot move card to same column");
              return;
            }
            if (startCol) {
              const cardsInSourceCol =
                newState?.columns
                  .filter(notEmpty)
                  .find((c) => c.id === source.droppableId)
                  ?.cards?.filter(notEmpty)
                  .map((c) => c.id) || [];
              moveCardMutation.mutate({
                columnId: startCol?.id,
                cardIds: cardsInSourceCol,
              });
            }

            if (endCol && startCol !== endCol) {
              const cardsInEndCol =
                newState?.columns
                  .filter(notEmpty)
                  .find((c) => c.id === destination.droppableId)
                  ?.cards?.filter(notEmpty)
                  .map((c) => c.id) || [];
              moveCardMutation.mutate({
                columnId: endCol?.id,
                cardIds: cardsInEndCol,
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
                      cards={col.cards}
                      board={board}
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
  const [isModalOpen, setIsModalOpen] = useModalForm({
    formModalType: "addBoard",
  });
  const [isCardModalOpen, setIsCardModalOpen] = useModalForm({
    formModalType: "editCard",
  });
  const [isColumnModalOpen, setIsColumnModalOpen] = useModalForm({
    formModalType: "editColumn",
  });
  const [isUpdateBoard, setIsUpdateBoard] = useModalForm({
    formModalType: "editBoard",
  });
  const [isAddColumn, setIsAddColumn] = useModalForm({
    formModalType: "addColumn",
  });
  const [isAddCard, setIsAddCard] = useModalForm({
    formModalType: "addCard",
  });

  return (
    <div>
      {kanbanQueryResult.isLoading && <div>Loading...</div>}
      <AddBoardModal isOpen={!!isModalOpen} setIsOpen={setIsModalOpen} />
      <UpdateColumnModal
        isOpen={!!isColumnModalOpen}
        setIsOpen={setIsColumnModalOpen}
      />
      <UpdateCardModal
        isOpen={isCardModalOpen}
        setIsOpen={setIsCardModalOpen}
      />
      <UpdateBoardModal isOpen={isUpdateBoard} setIsOpen={setIsUpdateBoard} />
      <AddColumnModal isOpen={isAddColumn} setIsOpen={setIsAddColumn} />
      <AddCardModal isOpen={isAddCard} setIsOpen={setIsAddCard} />

      <button
        onClick={() => {
          queryClient.refetchQueries(["allColumns"]);
          setIsModalOpen(true);
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
