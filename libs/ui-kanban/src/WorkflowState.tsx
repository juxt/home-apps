import { notEmpty, take } from '@juxt-home/utils';
import { Draggable, Droppable, DroppableProvided } from 'react-beautiful-dnd';
import Tippy, { useSingleton, TippyProps } from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import classNames from 'classnames';
import { useSearch } from 'react-location';
import NaturalDragAnimation from './lib/react-dnd-animation';
import {
  TCard,
  TWorkflow,
  TWorkflowState,
  LocationGenerics,
  useModalForm,
  useUser,
  useDeleteCardFromColumnMutation,
  juxters,
} from '@juxt-home/site';
import { memo } from 'react';
import { ArchiveActiveIcon } from '@juxt-home/ui-common';

type CardProps = {
  card: TCard;
  workflow: TWorkflow;
  index: number;
};

const DraggableCard = memo(({ card, index, workflow }: CardProps) => {
  const workflowState = workflow?.workflowStates.find((state) =>
    state?.cards?.find((c) => c?.id === card.id),
  );
  const [, setIsOpen] = useModalForm({
    formModalType: 'editCard',
    cardId: card.id,
    workflowStateId: workflowState?.id,
  });
  const search = useSearch<LocationGenerics>();
  const showMyCards = search?.showMyCards;
  const { id: username } = useUser();
  const isMyCard =
    showMyCards && username && card?.currentOwnerUsernames?.includes(username);
  const updateState = useDeleteCardFromColumnMutation();
  const handleDeleteCard = (cardId: string) => {
    const id = workflowState?.id;
    if (id && workflowState.cards) {
      updateState.mutate({
        cardId,
        workflowStateId: id,
      });
    }
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => {
        const isDragging = snapshot.isDragging && !snapshot.isDropAnimating;
        const cardStyles = classNames(
          'text-left relative bg-white card-width rounded border-2 mb-2 p-2 border-gray-500 hover:border-blue-400',
          isDragging && 'bg-blue-50 border-blue-400 shadow-lg',
          isMyCard && 'border-green-400',
          !card?.project && 'border-red-500 bg-red-50',
        );
        const owners = juxters.filter((j) =>
          card?.currentOwnerUsernames?.includes(j.staffRecord.juxtcode),
        );
        return (
          <NaturalDragAnimation
            style={provided.draggableProps.style}
            snapshot={snapshot}>
            {(style: object) => (
              <div
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={style}
                className={cardStyles}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setIsOpen(true);
                  }
                }}
                onClick={() => workflow?.id && setIsOpen(true)}
                ref={provided.innerRef}>
                {search?.devMode && <pre className="truncate">{card.id}</pre>}
                {search?.devMode && (
                  <ArchiveActiveIcon
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteCard(card.id);
                    }}
                    className="w-5 h-5 absolute top-0 right-0"
                  />
                )}
                <div className="flex justify-between">
                  <p className="uppercase text-gray-800 font-extralight text-sm">
                    {card.project?.name}
                  </p>
                  {owners.length > 0 && (
                    <div className="flex">
                      {take(owners, 3).map((o) => (
                        <Tippy
                          key={o.avatar}
                          theme="light"
                          content={o.name}
                          placement="top">
                          <img
                            className={classNames('w-6 h-6 rounded-full mr-2')}
                            src={o.avatar}
                            alt="card owner"
                          />
                        </Tippy>
                      ))}
                    </div>
                  )}
                </div>

                <p className="prose lg:prose-xl">{card.title}</p>
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
  tooltipTarget: TippyProps['singleton'];
};

const WorkflowState = memo(
  ({ workflowState, cards, workflow, tooltipTarget }: WorkflowStateProps) => {
    const isFirst = workflow.workflowStates?.[0]?.id === workflowState.id;
    const [, setIsOpen] = useModalForm({
      formModalType: 'editWorkflowState',
      workflowStateId: workflowState.id,
    });
    return (
      <Droppable droppableId={workflowState.id} type="card">
        {(provided, snapshot) => (
          <div
            style={{
              borderColor: snapshot.isDraggingOver ? 'gray' : 'transparent',
            }}
            className={classNames(
              'transition sm:mx-1 border-4 h-full',
              isFirst && 'sm:ml-0',
              snapshot.isDraggingOver && 'bg-blue-50 shadow-sm  border-dashed ',
              ' flex flex-col ',
              cards.length === 0 && 'relative h-36',
            )}>
            <button
              type="button"
              onClick={() => workflow?.id && setIsOpen(true)}
              className={classNames(
                'prose cursor-pointer isolate default-tippy-tooltip',
                cards.length === 0 &&
                  !snapshot.isDraggingOver &&
                  'sm:transition sm:rotate-90 sm:relative sm:top-2 sm:left-10 sm:origin-top-left sm:whitespace-nowrap',
              )}>
              {cards.length === 0 && !snapshot.isDraggingOver ? (
                <>
                  <h3 className="text-white">col</h3>
                  <h3 className="absolute top-2">{workflowState.name}</h3>
                </>
              ) : (
                <Tippy
                  singleton={tooltipTarget}
                  delay={[100, 500]}
                  className=" bg-slate-800 text-white text-center relative rounded text-sm whitespace-normal outline-none transition-all p-2"
                  content={
                    <div className="text-sm">
                      {workflowState?.description && (
                        <>
                          <p>{workflowState?.description}</p>
                          <br />
                        </>
                      )}
                      <p>
                        Click to edit column name, description and default
                        roles/tasks
                      </p>
                    </div>
                  }>
                  <div className="card-width flex items-center justify-between my-2">
                    <h3 className="m-0 text-left truncate">
                      {workflowState.name}
                    </h3>
                    <span className="px-2 bg-blue-50 text-gray-500 font-extralight rounded-md ">
                      {cards.length}
                    </span>
                  </div>
                </Tippy>
              )}
            </button>

            <div
              className="h-full juxt-kanban-cols-container overflow-scroll no-scrollbar"
              ref={provided.innerRef}
              {...provided.droppableProps}>
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
    );
  },
);

export function WorkflowStateContainer({
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
  const search = useSearch<LocationGenerics>();
  const colIds = search?.filters?.colIds ?? search?.filters?.roleFilters ?? [];
  const hideEmptyStates = search?.hideEmptyStates;
  const hiddenColumnIds = new Set(colIds);
  return (
    <div
      className="flex sm:flex-row flex-col max-w-full h-column-height-sm lg:h-column-height-lg"
      {...provided.droppableProps}
      ref={provided.innerRef}>
      <Tippy
        singleton={source}
        delay={[500, 100]}
        moveTransition="transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)"
      />
      {cols
        .filter((col) => !hiddenColumnIds.has(col.id))
        .filter((col) =>
          hideEmptyStates ? col.cards && col.cards.length > 0 : true,
        )
        .map((col) => {
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
