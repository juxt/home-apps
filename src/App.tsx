import { ModalForm } from "./components/Modal";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  useKanbanDataQuery,
  useUpdateCardMutation,
  Column as TColumn,
  useCreateColumnMutation,
  useCreateBoardMutation,
  MutationCreateBoardArgs,
  useDeleteBoardMutation,
  useAllColumnsQuery,
  CreateColumnMutationVariables,
  useDeleteColumnMutation,
} from "./generated/graphql";
import { Option, TBoard, TCard } from "./types";
import { distinctBy, moveCard, notEmpty } from "./kanbanHelpers";
import { QueryClient, useQueryClient } from "react-query";
import React from "react";
import { useForm } from "react-hook-form";

const defaultMutationProps = (queryClient: QueryClient) => ({
  onSettled: () => {
    queryClient.refetchQueries(useKanbanDataQuery.getKey());
  },
});

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
          {card.id}
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
  const boardColumns = board?.columns.filter(notEmpty).map((c) => c.id) || [];
  return (
    <Container isDragging={false}>
      <button
        onClick={() =>
          deleteColMutation.mutate({
            id: column.id,
            boardId: board.id,
            columnIds: [...boardColumns.filter((c) => c !== column.id)],
          })
        }
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

type AddColumnInput = Omit<
  Omit<Omit<CreateColumnMutationVariables, "colId">, "columnIds">,
  "boardId"
>;

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
  const updateMutation = useUpdateCardMutation({
    ...defaultMutationProps(queryClient),
  });
  const addMutation = useUpdateCardMutation({
    ...defaultMutationProps(queryClient),
  });
  const deleteBoardMutation = useDeleteBoardMutation({
    ...defaultMutationProps(queryClient),
  });
  const addCard = () => {
    if (!board) return;
    const newId = `card-${Date.now()}`;
    const newCard = {
      title: "New Card" + Math.random(),
      cardId: newId,
      cardIds: [...cols[0].cards.map((c) => c.id), newId],
      priority: 0,
      description: "",
      boardId: board.id,
      columnId: cols[0].id,
    };
    addMutation.mutate({
      ...newCard,
    });
  };
  const colNameRef = React.useRef<HTMLInputElement>(null);
  const addColMutation = useCreateColumnMutation({
    ...defaultMutationProps(queryClient),
  });
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const addColumn = (col: AddColumnInput) => {
    if (board) {
      setIsModalOpen(false);
      const colId = `col-${Date.now()}`;
      addColMutation.mutate({
        ...col,
        columnIds: [...cols.map((c) => c.id), colId],
        boardId: board.id,
        colId,
      });
    }
  };
  const crudButtonClass = "px-4";
  const formHooks = useForm<AddColumnInput>();
  return (
    <>
      <div className="flex bg-red-500 justify-between max-w-lg">
        <h1>{data?.name}</h1>
        <div className="flex justify-around">
          <button
            className={crudButtonClass}
            onClick={() => {
              console.log("edit board");
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
          <button onClick={() => setIsModalOpen(true)}>Add Column</button>
        </div>
      </div>
      {data?.description && <p>{data.description}</p>}
      <ModalForm<AddColumnInput>
        title="Add Column"
        formHooks={formHooks}
        onSubmit={formHooks.handleSubmit(addColumn, console.warn)}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        fields={[
          {
            id: "name",
            path: "columnName",
            rules: {
              required: true,
            },
            label: "Column Name",
            type: "text",
          },
        ]}
      />
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
              updateMutation.mutate({
                columnId: startCol?.id,
                cardId: draggableId,
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
              updateMutation.mutate({
                columnId: endCol?.id,
                cardId: draggableId,
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

type AddBoardInput = Omit<MutationCreateBoardArgs, "columnIds"> & {
  columnIds: Option[] | undefined;
};

export function App() {
  const kanbanQueryResult = useKanbanDataQuery();
  const boards = kanbanQueryResult.data?.allBoards || [];
  const queryClient = useQueryClient();
  const addBoardMutation = useCreateBoardMutation({
    ...defaultMutationProps(queryClient),
  });
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const addBoard = (input: AddBoardInput) => {
    console.log("add board", input);
    setIsModalOpen(false);
    const { columnIds, ...boardInput } = input;

    const newColumns =
      columnIds?.map((c) => {
        return {
          name: c.label,
          id: "col" + Math.random().toString(),
        };
      }) || [];
    const data = {
      ...boardInput,
      columns: newColumns,
      columnIds: newColumns?.map((c) => c.id),
    };
    addBoardMutation.mutate(data);
  };
  const formHooks = useForm<AddBoardInput>();
  const columnResult = useAllColumnsQuery();
  const cols =
    columnResult.data?.allColumns?.filter(notEmpty).map((c) => {
      return {
        value: c.id,
        label: c.name,
      };
    }) || [];
  const columns = distinctBy<typeof cols[0]>(cols, "label") || [];
  return (
    <div>
      {kanbanQueryResult.isLoading && <div>Loading...</div>}
      <ModalForm<AddBoardInput>
        title="Add Board"
        formHooks={formHooks}
        fields={[
          {
            id: "columns",
            type: "multiselect",
            options: columns,
            path: "columnIds",
            label: "Columns",
          },
          {
            id: "BoardName",
            placeholder: "Board Name",
            type: "text",
            rules: {
              required: true,
            },
            path: "name",
          },
          {
            id: "BoardDescription",
            placeholder: "Board Description",
            type: "text",
            path: "description",
          },
        ]}
        onSubmit={formHooks.handleSubmit(addBoard, console.warn)}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
      <button
        onClick={() => {
          queryClient.refetchQueries(["allColumns"]);
          return setIsModalOpen(true);
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
