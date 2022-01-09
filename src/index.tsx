import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  KanbanDataQuery,
  useKanbanDataQuery,
  useUpdateCardMutation,
} from "./generated/graphql";

import "./styles.css";
import { QueryClient, QueryClientProvider, UseQueryResult } from "react-query";
const queryClient = new QueryClient();
const { useState, memo } = React;

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

const TaskContainer = styled.div<{ isDragging: boolean }>`
  border: 1px solid lightgrey;
  padding: 8px;
  border-radius: 2px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.isDragging ? "red" : "white")};
  transition: background 0.1s;
`;

interface Task {
  id: string;
  title: string;
}

interface TaskProps {
  task: Task;
  index: number;
}

const Task = memo(({ task, index }: TaskProps) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <TaskContainer
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {task.title}
        </TaskContainer>
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

interface Column {
  id: string;
  title: string;
}

interface ColumnProps {
  tasks: Task[];
  index: number;
  column: Column;
}

const Column = memo(({ column, tasks, index }: ColumnProps) => (
  <Draggable draggableId={column.id} index={index}>
    {(provided, snapshot) => (
      <Container
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        isDragging={snapshot.isDragging}
        ref={provided.innerRef}
      >
        <Title {...provided.dragHandleProps}>{column.title}</Title>
        <Droppable droppableId={column.id} type="task">
          {(provided, snapshot) => (
            <List
              ref={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {tasks.map((t, i) => (
                <Task key={t.id} task={t} index={i} />
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </Container>
    )}
  </Draggable>
));

function Board({ boards }: { boards: KanbanDataQuery["allBoards"] }) {
  const board = boards && boards[0];
  const columns = board?.columns || [];
  const columns2 = columns.filter(notEmpty).map((column) => {
    return {
      ...column,
      title: column.name,
      taskList: column.cards
        .map((task) => {
          return task?.id;
        })
        .filter(notEmpty),
    };
  });
  const columns3 = indexById(columns2);
  const columnOrder = columns.map((column) => column?.id).filter(notEmpty);
  const cards = board?.cards && indexById(board.cards.filter(notEmpty));
  const data = {
    tasks: cards,
    columns: columns3,
    columnOrder,
  };
  const [state, setState] = useState(data);
  React.useEffect(() => {
    setState(data);
  }, [data]);

  const updateMutation = useUpdateCardMutation({
    onSuccess: (data) => {
      queryClient.refetchQueries(useKanbanDataQuery.getKey());
    },
  });
  return (
    <>
      <h1>{board?.name}</h1>
      {board?.description && <p>{board.description}</p>}
      <DragDropContext
        onDragEnd={({ destination, source, draggableId, type }) => {
          if (!destination) {
            return;
          }
          if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
          ) {
            return;
          }

          if (type === "column") {
            const newColOrd = Array.from(state.columnOrder);
            newColOrd.splice(source.index, 1);
            newColOrd.splice(destination.index, 0, draggableId);

            const newState = {
              ...state,
              columnOrder: newColOrd,
            };
            setState(newState);
          }

          const startcol = state.columns[source.droppableId];
          const endcol = state.columns[destination.droppableId];

          if (startcol === endcol) {
            const tasks = Array.from(
              startcol.cards.filter(notEmpty).map((task) => task.id)
            );
            tasks.splice(source.index, 1);
            tasks.splice(destination.index, 0, draggableId);

            const newCol = {
              ...startcol,
              taskIds: tasks,
            };

            const newState = {
              ...state,
              columns: {
                ...state.columns,
                [newCol.id]: newCol,
              },
            };

            setState(newState);
            return;
          }
          const startTaskIds = Array.from(
            startcol.cards.filter(notEmpty).map((task) => task.id)
          );
          updateMutation.mutate({
            cardId: draggableId,
            columnId: endcol.id,
          });
          startTaskIds.splice(source.index, 1);
          const newStart = {
            ...startcol,
            taskIds: startTaskIds,
          };
          const endTaskIds = Array.from(
            endcol.cards.filter(notEmpty).map((task) => task.id)
          );
          endTaskIds.splice(destination.index, 0, draggableId);
          const newEnd = {
            ...endcol,
            taskIds: endTaskIds,
          };
          const newState = {
            ...state,
            columns: {
              ...state.columns,
              [newStart.id]: newStart,
              [newEnd.id]: newEnd,
            },
          };
        }}
      >
        <Droppable droppableId="columns" direction="horizontal" type="column">
          {(provided) => (
            <Columns {...provided.droppableProps} ref={provided.innerRef}>
              {state.columnOrder.map((id, i) => {
                const col = state.columns[id];
                const tasks = board?.cards
                  .filter(
                    (card) =>
                      notEmpty(card) &&
                      col.cards.map((card) => card?.id).includes(card.id)
                  )
                  .filter(notEmpty);
                return (
                  <Column key={id} column={col} tasks={tasks!} index={i} />
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
        boards.filter(notEmpty).map((board) => <Board boards={[board]} />)}
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
