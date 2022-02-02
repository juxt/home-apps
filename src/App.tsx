import NaturalDragAnimation from "./components/lib/react-dnd-animation";
import { useHotkeys } from "react-hotkeys-hook";
import { useMobileDetect, useModalForm } from "./hooks";
import { NavTabs } from "./components/Tabs";
import { Heading } from "./components/Headings";
import {
  AddWorkflowStateModal,
  UpdateWorkflowStateModal,
} from "./components/WorkflowStateForms";
import { AddProjectModal, UpdateProjectModal } from "./components/ProjectForms";
import { AddCardModal, CardModal } from "./components/CardForms";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableLocation,
  DroppableProvided,
} from "react-beautiful-dnd";
import {
  useKanbanDataQuery,
  useMoveCardMutation,
  useCardByIdsQuery,
  CardByIdsQuery,
  useUpdateCardPositionMutation,
} from "./generated/graphql";
import { LocationGenerics, TWorkflow, TCard, TWorkflowState } from "./types";
import {
  defaultMutationProps,
  moveCard,
  notEmpty,
  uncompressBase64,
} from "./kanbanHelpers";
import { useQueryClient } from "react-query";
import React, { useEffect } from "react";
import { useNavigate, useSearch } from "react-location";
import classNames from "classnames";
import _ from "lodash";
import DOMPurify from "dompurify";
import Table from "./components/Table";
import Tippy, { useSingleton } from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

type CardProps = {
  card: TCard;
  workflow: TWorkflow;
  index: number;
};

const DraggableCard = React.memo(({ card, index, workflow }: CardProps) => {
  const [, setIsOpen] = useModalForm({
    formModalType: "editCard",
    cardId: card.id,
    workflowId: workflow?.id,
    workflowStateId: workflow?.workflowStates.find((state) =>
      state?.cards?.find((c) => c?.id === card.id)
    )?.id,
  });
  const { data: detailedCard } = useCardByIdsQuery(
    {
      ids: [card.id],
    },
    {
      enabled: false,
      select: (data) => data?.cardsByIds?.filter(notEmpty)[0],
    }
  );
  const search = useSearch<LocationGenerics>();

  const imageString = detailedCard?.files?.filter((file) =>
    file?.type.startsWith("image")
  )?.[0]?.lzbase64;
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => {
        const isDragging = snapshot.isDragging && !snapshot.isDropAnimating;
        const cardStyles = classNames(
          "bg-white w-full sm:w-52 lg:w-64 rounded border-2 mb-2 p-2 border-gray-500 hover:border-blue-400",
          isDragging && "bg-blue-50 border-blue-400 shadow-lg",
          !card?.project && "border-red-500 bg-red-50"
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
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setIsOpen(true);
                  }
                }}
                onClick={() => workflow?.id && setIsOpen(true)}
                ref={provided.innerRef}
              >
                {search?.devMode && <pre>{card.id}</pre>}
                <p className="uppercase text-gray-800 font-extralight text-sm">
                  {card.project?.name}
                </p>
                <p className="prose lg:prose-xl">{card.title}</p>
                {detailedCard?.description &&
                  detailedCard.description !== "<p></p>" && (
                    <div
                      className="ProseMirror h-min max-h-32 w-full my-2 overflow-y-hidden"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(detailedCard.description),
                      }}
                    />
                  )}
                {imageString && (
                  <img
                    src={uncompressBase64(imageString)}
                    width={100}
                    height={100}
                    className="rounded"
                    alt="Card Image"
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

type WorkflowStateProps = {
  workflowState: TWorkflowState;
  isDragging: boolean;
  cards: TCard[];
  workflow: NonNullable<TWorkflow>;
  tooltipTarget: any;
};

const WorkflowState = React.memo(
  ({
    workflowState,
    cards,
    workflow,
    isDragging,
    tooltipTarget,
  }: WorkflowStateProps) => {
    const isFirst = workflow.workflowStates?.[0]?.id === workflowState.id;
    const [, setIsOpen] = useModalForm({
      formModalType: "editWorkflowState",
      workflowStateId: workflowState.id,
    });
    return (
      <>
        <Droppable droppableId={workflowState.id} type="card">
          {(provided, snapshot) => (
            <div
              style={{
                borderColor: snapshot.isDraggingOver ? "gray" : "transparent",
              }}
              className={classNames(
                "transition sm:mx-1 border-4",
                isFirst && "sm:ml-0",
                snapshot.isDraggingOver &&
                  "bg-blue-50 shadow-sm  border-dashed ",
                " mt-4 flex flex-col ",
                cards.length === 0 && "relative h-36"
              )}
            >
              <div
                onClick={() => workflow?.id && setIsOpen(true)}
                className={classNames(
                  "prose xl:prose-xl cursor-pointer isolate",
                  cards.length === 0 &&
                    !snapshot.isDraggingOver &&
                    "sm:transition sm:rotate-90 sm:relative sm:top-2 sm:left-10 sm:origin-top-left sm:whitespace-nowrap"
                )}
              >
                {cards.length === 0 && !snapshot.isDraggingOver ? (
                  <>
                    <h3 className="text-white">col</h3>
                    <h3 className="absolute top-2">{workflowState.name}</h3>
                  </>
                ) : (
                  <Tippy
                    singleton={tooltipTarget}
                    delay={[100, 500]}
                    content={
                      <div className="text-sm">
                        <p>Column ID {workflowState.id}</p>
                        <p>{workflowState?.description}</p>
                        <p>
                          {cards.length} card{cards.length === 1 ? "" : "s"}
                        </p>
                        <p>Click to edit</p>
                      </div>
                    }
                  >
                    <div
                      style={{ marginBlock: "8px" }}
                      className="flex items-center justify-between my-2"
                    >
                      <h3 style={{ marginBlock: 0 }}>{workflowState.name}</h3>
                      <span className="px-2 bg-blue-50  text-gray-500 font-extralight rounded-md ">
                        {cards.length}
                      </span>
                    </div>
                  </Tippy>
                )}
              </div>

              <div
                className="h-full juxt-kanban-cols-container overflow-scroll no-scrollbar"
                ref={provided.innerRef}
                {...provided.droppableProps}
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
              </div>
            </div>
          )}
        </Droppable>
      </>
    );
  }
);

function filteredCards(
  cards: TCard[] | undefined,
  projectId: string | undefined
) {
  if (!projectId) {
    return cards;
  }

  return (
    cards?.filter(
      (card) =>
        (projectId === "" && card?.project) ||
        (card?.project?.name && card.project?.id === projectId)
    ) ?? []
  );
}

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

function WorkflowStateContainer({
  provided,
  isDragging,
  cols,
  workflow,
}: {
  provided: DroppableProvided;
  isDragging: boolean;
  cols: NonNullable<TWorkflowState[]>;
  workflow: NonNullable<TWorkflow>;
}) {
  const [source, target] = useSingleton();
  return (
    <div
      className="flex sm:flex-row flex-col max-w-full h-full"
      {...provided.droppableProps}
      ref={provided.innerRef}
    >
      <Tippy
        singleton={source}
        delay={[500, 100]}
        moveTransition="transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)"
      />
      {cols.map((col) => {
        return (
          <WorkflowState
            key={col.id}
            tooltipTarget={target}
            isDragging={isDragging}
            workflowState={col}
            cards={col?.cards?.filter(notEmpty) || []}
            workflow={workflow}
          />
        );
      })}
      {provided.placeholder}
    </div>
  );
}

function Workflow({ workflow }: { workflow: TWorkflow }) {
  if (!workflow?.id) return null;
  const search = useSearch<LocationGenerics>();
  const { workflowProjectId, devMode } = search;
  const data = React.useMemo(
    () => processWorkflow(workflow, workflowProjectId),
    [workflow, workflowProjectId]
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
        cards:
          c.cards
            ?.filter((card) => devMode || card?.project)
            .filter(notEmpty) || [],
      };
    }) || [];
  const queryClient = useQueryClient();
  const updateCardPosMutation = useUpdateCardPositionMutation({
    ...defaultMutationProps(queryClient),
  });
  const moveCardMutation = useMoveCardMutation({
    ...defaultMutationProps(queryClient),
  });

  const updateServerCards = React.useCallback(
    (
      state: TWorkflow,
      startCol: TWorkflowState,
      endCol: TWorkflowState,
      source: DraggableLocation,
      destination: DraggableLocation,
      draggableId: string,
      prevCardId?: string | false
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
          previousCard: prevCardId || "start",
        });
      }
    },
    [moveCardMutation]
  );

  const [, setIsAddCard] = useModalForm({
    formModalType: "addCard",
    workflowId: workflow.id,
  });

  useHotkeys("n", () => {
    setIsAddCard(true);
  });
  const [isDragging, setIsDragging] = React.useState(false);
  const isGrid = search.view === "table";
  const gridData = React.useMemo(() => {
    return [
      ...cols
        .filter(notEmpty)
        .flatMap((c) => [
          ...c.cards.map((card) => ({ ...card, state: c.name })),
        ]),
    ];
  }, [cols]);
  const gridColumns = React.useMemo(() => {
    return [
      {
        id: "name",
        Header: "Name",
        accessor: "title",
      },
      {
        id: "state",
        Header: "State",
        accessor: "state",
      },
      {
        id: "project",
        Header: "Project",
        accessor: "project.name",
      },
      {
        id: "lastUpdated",
        Header: "Last Updated",
        accessor: "_siteValidTime",
      },
    ];
  }, []);

  return (
    <div className="px-4 h-full-minus-nav">
      <Heading workflow={workflow} handleAddCard={() => setIsAddCard(true)} />
      {isGrid && <Table data={gridData} columns={gridColumns} />}
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
              destination
            );
            const startCol = cols.find((c) => c.id === source.droppableId);
            const endCol = cols.find((c) => c.id === destination.droppableId);
            const prevCardId =
              destination.index === 0
                ? false
                : newFilteredState?.workflowStates.find(
                    (state) => state?.id === destination.droppableId
                  )?.cards?.[destination.index - 1]?.id;
            if (!startCol || !endCol) return;

            if (!workflowProjectId) {
              // if there are no filters, just use the local state in the mutation
              updateServerCards(
                newFilteredState,
                startCol,
                endCol,
                source,
                destination,
                draggableId,
                prevCardId
              );
            } else {
              // if there are filters, things are more tricky...
              // the general idea is to find the card behind the new location of our dragged card
              // and then find that previousCards index in the unfiltered workflow-state
              // then we can move the card in the unfiltered workflow-state and use that to update the server

              const unfilteredStartCol =
                unfilteredWorkflow?.workflowStates.find(
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
                  : !!unfilteredCardIdx && endCards[unfilteredCardIdx - 1]?.id;
              const prevCardIdx = unfilteredEndCol?.cards?.findIndex(
                (c) => c?.id === prevCardId
              );
              const unfilteredSource = {
                ...source,
                index: unfilteredSourceIdx,
              };
              if (typeof prevCardIdx !== "number") {
                console.log("no prev card idx");
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

              const newState = moveCard(
                unfilteredWorkflow,
                unfilteredSource,
                unfilteredDestination
              );
              if (unfilteredStartCol && unfilteredEndCol) {
                updateServerCards(
                  newState,
                  unfilteredStartCol,
                  unfilteredEndCol,
                  unfilteredSource,
                  unfilteredDestination,
                  draggableId,
                  prevCardId
                );
              }
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
              <WorkflowStateContainer
                key={provided.droppableProps["data-rbd-droppable-context-id"]}
                isDragging={isDragging}
                workflow={workflow}
                provided={provided}
                cols={cols}
              />
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}

export function App() {
  const search = useSearch<LocationGenerics>();
  const refetch = search.modalState?.formModalType ? false : false;
  const kanbanQueryResult = useKanbanDataQuery(undefined, {
    refetchInterval: refetch,
  });
  const workflow = kanbanQueryResult.data?.allWorkflows?.[0];
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
  const [isEditProject, setIsEditProject] = useModalForm({
    formModalType: "editProject",
  });
  const projects = kanbanQueryResult.data?.allProjects || [];
  const allCardIds =
    workflow?.workflowStates
      ?.flatMap((ws) => ws?.cards?.map((c) => c?.id))
      .filter(notEmpty) || [];

  const queryClient = useQueryClient();
  const prefetchCards = async () => {
    const data = await queryClient.fetchQuery(
      useCardByIdsQuery.getKey({ ids: _.uniq(allCardIds) }),
      useCardByIdsQuery.fetcher({ ids: _.uniq(allCardIds) }),
      { staleTime: Infinity }
    );
    data?.cardsByIds?.forEach((c) => {
      if (!c) return;
      queryClient.setQueryData(useCardByIdsQuery.getKey({ ids: [c.id] }), {
        cardsByIds: [c],
      });
    });
  };

  useEffect(() => {
    if (allCardIds.length > 0) {
      prefetchCards();
    }
  }, [JSON.stringify(allCardIds)]);

  useEffect(() => {
    if (workflow) {
      workflow.workflowStates.forEach((ws) => {
        ws?.cards?.forEach((c) => {
          if (!c) return;
          const currentCard = queryClient.getQueryData<CardByIdsQuery>(
            useCardByIdsQuery.getKey({ ids: [c.id] })
          );
          const currentTime = currentCard?.cardsByIds?.[0]?._siteValidTime;
          if (!currentTime) {
            return;
          }
          if (currentCard && currentTime === c._siteValidTime) {
            return;
          }

          queryClient.fetchQuery(
            useCardByIdsQuery.getKey({ ids: [c.id] }),
            useCardByIdsQuery.fetcher({ ids: [c.id] })
          );
        });
      });
    }
  }, [workflow]);

  return (
    <>
      {kanbanQueryResult.isLoading && <div>Loading...</div>}
      <AddWorkflowStateModal
        isOpen={!!isModalOpen}
        handleClose={() => setIsModalOpen(false)}
      />
      <UpdateWorkflowStateModal
        isOpen={!!isWorkflowStateModalOpen}
        handleClose={() => setIsWorkflowStateModalOpen(false)}
      />
      <CardModal
        isOpen={isCardModalOpen}
        handleClose={() => setIsCardModalOpen(false)}
      />
      <AddCardModal
        isOpen={isAddCard}
        handleClose={() => setIsAddCard(false)}
      />
      <AddProjectModal
        isOpen={isAddProject}
        handleClose={() => setIsAddProject(false)}
      />
      <UpdateProjectModal
        isOpen={isEditProject}
        handleClose={() => setIsEditProject(false)}
      />
      <NavTabs
        navName="workflowProjectId"
        tabs={[...projects, { id: "", name: "All" }]
          .filter(notEmpty)
          .map((project) => ({
            id: project.id,
            name: project.name,
            count:
              workflow?.workflowStates.reduce(
                (acc, ws) =>
                  acc +
                  (ws?.cards?.filter((c) => {
                    if (project.id === "") {
                      return c?.project?.id;
                    } else {
                      return project?.id && c?.project?.id === project.id;
                    }
                  })?.length || 0),
                0
              ) || 0,
          }))}
      />

      {workflow && <Workflow key={workflow.id} workflow={workflow} />}
    </>
  );
}
