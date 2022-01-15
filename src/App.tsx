import { AddWorkflowModal } from "./components/WorkflowForms";
import NaturalDragAnimation from "natural-drag-animation-rbdnd";
import { useModalForm } from "./hooks";
import {
  AddWorkflowStateModal,
  UpdateWorkflowStateModal,
} from "./components/WorkflowStateForms";
import { AddProjectModal } from "./components/ProjectForms";
import { AddCardModal, UpdateCardModal } from "./components/CardForms";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  useKanbanDataQuery,
  useDeleteWorkflowMutation,
  useDeleteWorkflowStateMutation,
  useMoveCardMutation,
  useCardHistoryQuery,
  useAllProjectsQuery,
} from "./generated/graphql";
import { LocationGenerics, TWorkflow, TCard, TWorkflowState } from "./types";
import {
  defaultMutationProps,
  hasDuplicateCards,
  moveCard,
  notEmpty,
} from "./kanbanHelpers";
import { useQueryClient } from "react-query";
import React from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearch } from "react-location";
import classNames from "classnames";

type CardProps = {
  card: TCard;
  workflow: TWorkflow;
  index: number;
};

const DraggableCard = React.memo(({ card, index, workflow }: CardProps) => {
  const [, setIsOpen] = useModalForm({
    formModalType: "editCard",
    card: card,
    workflow: workflow,
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
                onClick={() => workflow?.id && setIsOpen(true)}
                ref={provided.innerRef}
              >
                <pre>{card.id}</pre>
                <p>{card.title}</p>
                <p>{card.project?.name}</p>
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

const WorkflowStates = styled.div`
  display: flex;
`;

type WorkflowStateProps = {
  workflowState: TWorkflowState;
  cards: TCard[];
  workflow: NonNullable<TWorkflow>;
};

const WorkflowState = React.memo(
  ({ workflowState, cards, workflow }: WorkflowStateProps) => {
    const queryClient = useQueryClient();
    const deleteColMutation = useDeleteWorkflowStateMutation({
      ...defaultMutationProps(queryClient),
    });
    const [, setEditWorkflowStateOpen] = useModalForm({
      formModalType: "editWorkflowState",
      workflowState,
    });
    const workflowWorkflowStates = workflow?.workflowStates.filter(notEmpty);
    return (
      <Container isDragging={false}>
        <button onClick={() => setEditWorkflowStateOpen(true)}>
          Edit WorkflowState
        </button>
        <button
          onClick={() => {
            const hasCards = cards.length > 0;
            if (hasCards) {
              toast.error(
                "Cannot delete a workflowState with cards, please move them somewhere else"
              );
              return;
            }
            return deleteColMutation.mutate({
              id: workflowState.id,
              workflowId: workflow.id,
              workflowStateIds: [
                ...workflowWorkflowStates
                  .filter((c) => c.id !== workflowState.id)
                  .map((c) => c.id),
              ],
            });
          }}
        >
          Delete
        </button>
        <Title>{workflowState.name}</Title>
        <Droppable droppableId={workflowState.id} type="card">
          {(provided, snapshot) => (
            <List
              ref={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {cards.map((t, i) => (
                <DraggableCard
                  key={t.id}
                  card={t}
                  workflow={workflow}
                  index={i}
                />
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </Container>
    );
  }
);

function filteredCards(
  cards: TCard[] | undefined,
  filters: LocationGenerics["Search"]["filters"] | undefined
) {
  if (!filters) {
    return cards;
  }

  return (
    cards?.filter(
      (card) => !filters.projectId || card.project?.id === filters.projectId
    ) ?? []
  );
}

function processWorkflow(
  workflow: TWorkflow,
  filters: LocationGenerics["Search"]["filters"] | undefined
) {
  if (!workflow) return null;
  const workflowStates = workflow?.workflowStates.filter(notEmpty) || [];
  return {
    ...workflow,
    workflowStates: workflowStates.map((c) => ({
      ...c,
      cards: filteredCards(c.cards?.filter(notEmpty), filters),
    })),
  };
}

function Workflow({ workflow }: { workflow: TWorkflow }) {
  if (!workflow?.id) return null;
  const { filters } = useSearch<LocationGenerics>();
  const data = React.useMemo(
    () => processWorkflow(workflow, filters),
    [workflow, filters]
  );
  const [filteredState, setState] = React.useState<TWorkflow>();
  const unfilteredWorkflow = useKanbanDataQuery()?.data?.allWorkflows?.find(
    (c) => c?.id === workflow.id
  );
  React.useEffect(() => {
    if (data) {
      setState(data);
      console.log("workflow update from server");
    }
  }, [data]);
  const cols =
    filteredState?.workflowStates.filter(notEmpty).map((c) => {
      return {
        ...c,
        cards: c.cards?.filter(notEmpty) || [],
      };
    }) || [];
  const queryClient = useQueryClient();
  const moveCardMutation = useMoveCardMutation({
    ...defaultMutationProps(queryClient),
  });
  const deleteWorkflowMutation = useDeleteWorkflowMutation({
    ...defaultMutationProps(queryClient),
  });

  const [, setIsAddWorkflowState] = useModalForm({
    formModalType: "addWorkflowState",
    workflow,
  });
  const [, setIsAddCard] = useModalForm({
    formModalType: "addCard",
    workflow,
  });
  const crudButtonClass = "px-4";
  return (
    <>
      <div className="flex bg-red-500 justify-between max-w-lg">
        <h1>{data?.name}</h1>
        <div className="flex justify-around">
          <button
            className={crudButtonClass}
            onClick={() =>
              data?.id && deleteWorkflowMutation.mutate({ workflowId: data.id })
            }
          >
            Delete
          </button>
          <button
            className={crudButtonClass}
            onClick={() => setIsAddWorkflowState(true)}
          >
            Add WorkflowState
          </button>
          <button
            className={crudButtonClass}
            onClick={() => setIsAddCard(true)}
          >
            {" "}
            Add Card
          </button>
        </div>
      </div>
      {data?.description && <p>{data.description}</p>}

      {filteredState && (
        <DragDropContext
          onDragEnd={({ destination, source, draggableId }) => {
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
              destination
            );
            const startCol = cols.find((c) => c.id === source.droppableId);
            const endCol = cols.find((c) => c.id === destination.droppableId);

            const unfilteredStartCol = unfilteredWorkflow?.workflowStates.find(
              (c) => c?.id === source.droppableId
            );
            const unfilteredEndCol = unfilteredWorkflow?.workflowStates.find(
              (c) => c?.id === destination.droppableId
            );
            const unfilteredSourceIdx =
              unfilteredStartCol?.cards?.findIndex(
                (c) => c?.id === draggableId
              ) || source.index;
            const newEndCol = newFilteredState?.workflowStates.find(
              (c) => c?.id === destination.droppableId
            );
            const unfilteredCardIdx = newEndCol?.cards?.findIndex(
              (c) => c?.id === draggableId
            );
            const endCards = newEndCol?.cards?.filter(notEmpty) || [];
            const prevCardId =
              destination.index === 0
                ? undefined
                : unfilteredCardIdx && endCards[unfilteredCardIdx - 1]?.id;
            const prevCardIdx = unfilteredEndCol?.cards?.findIndex(
              (c) => c?.id === prevCardId
            );
            const unfilteredSource = { ...source, index: unfilteredSourceIdx };
            if (typeof prevCardIdx !== "number") {
              console.log("no prev card idx");
              return;
            }
            const unfilteredDestination = {
              ...destination,
              index: prevCardIdx + 1,
            };
            console.log(unfilteredSource, unfilteredDestination);

            const newState = moveCard(
              unfilteredWorkflow,
              unfilteredSource,
              unfilteredDestination
            );
            if (
              (startCol && hasDuplicateCards(startCol)) ||
              (endCol && hasDuplicateCards(endCol))
            ) {
              toast.error("Cannot move card to same workflowState");
              return;
            }
            if (startCol) {
              const cardsInSourceCol =
                newState?.workflowStates
                  .filter(notEmpty)
                  .find((c) => c.id === source.droppableId)
                  ?.cards?.filter(notEmpty)
                  .map((c) => c.id) || [];
              moveCardMutation.mutate({
                workflowStateId: startCol?.id,
                cardIds: cardsInSourceCol,
              });
            }

            if (endCol && startCol !== endCol) {
              const cardsInEndCol =
                newState?.workflowStates
                  .filter(notEmpty)
                  .find((c) => c.id === destination.droppableId)
                  ?.cards?.filter(notEmpty)
                  .map((c) => c.id) || [];
              moveCardMutation.mutate({
                workflowStateId: endCol?.id,
                cardIds: cardsInEndCol,
              });
            }

            setState(newFilteredState);
          }}
        >
          <Droppable
            droppableId="workflowStates"
            direction="horizontal"
            type="workflowState"
          >
            {(provided) => (
              <WorkflowStates
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {cols.map((col) => {
                  return (
                    <WorkflowState
                      key={col.id}
                      workflowState={col}
                      cards={col.cards}
                      workflow={workflow}
                    />
                  );
                })}
                {provided.placeholder}
              </WorkflowStates>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </>
  );
}

export function App() {
  const kanbanQueryResult = useKanbanDataQuery({}, {});
  const workflows = kanbanQueryResult.data?.allWorkflows || [];
  const navigate = useNavigate<LocationGenerics>();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useModalForm({
    formModalType: "addWorkflowState",
  });
  const [isCardModalOpen, setIsCardModalOpen] = useModalForm({
    formModalType: "editCard",
  });
  const [isWorkflowStateModalOpen, setIsWorkflowStateModalOpen] = useModalForm({
    formModalType: "editWorkflowState",
  });

  const [isAddCard, setIsAddCard] = useModalForm({
    formModalType: "addCard",
  });
  const [isAddProject, setIsAddProject] = useModalForm({
    formModalType: "addProject",
  });
  const search = useSearch<LocationGenerics>();
  const projectQuery = useAllProjectsQuery();
  const projects = projectQuery.data?.allProjects || [];
  return (
    <div>
      {kanbanQueryResult.isLoading && <div>Loading...</div>}
      <AddWorkflowStateModal
        isOpen={!!isModalOpen}
        setIsOpen={setIsModalOpen}
      />
      <UpdateWorkflowStateModal
        isOpen={!!isWorkflowStateModalOpen}
        setIsOpen={setIsWorkflowStateModalOpen}
      />
      <UpdateCardModal
        isOpen={isCardModalOpen}
        setIsOpen={setIsCardModalOpen}
      />
      <AddCardModal isOpen={isAddCard} setIsOpen={setIsAddCard} />
      <AddProjectModal isOpen={isAddProject} setIsOpen={setIsAddProject} />
      {projects.length > 0 &&
        [...projects, { id: undefined, name: "All" }]
          .filter(notEmpty)
          .map((project) => (
            <div key={project.id + project.name}>
              <h1>{project.name}</h1>
              <div>
                <button
                  onClick={() =>
                    navigate({
                      search: {
                        ...search,
                        filters: {
                          ...search.filters,
                          projectId: project.id,
                        },
                      },
                    })
                  }
                >
                  View
                </button>
              </div>
            </div>
          ))}

      <button onClick={() => setIsAddProject(true)}>Add Project</button>
      {workflows.length > 0 &&
        workflows
          .filter(notEmpty)
          .map((workflow) => (
            <Workflow key={workflow.id} workflow={workflow} />
          ))}
    </div>
  );
}
