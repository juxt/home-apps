import { notEmpty } from '@juxt-home/utils';
import { Draggable, Droppable, DroppableProvided } from 'react-beautiful-dnd';
import Tippy, { useSingleton, TippyProps } from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import classNames from 'classnames';
import { sanitize } from 'isomorphic-dompurify';
import { useSearch } from 'react-location';
import NaturalDragAnimation from './lib/react-dnd-animation';
import {
  TCard,
  TWorkflow,
  useCardByIdsQuery,
  TWorkflowState,
  LocationGenerics,
  useModalForm,
} from '@juxt-home/site';
import { memo } from 'react';

type CardProps = {
  card: TCard;
  workflow: TWorkflow;
  index: number;
};

const DraggableCard = memo(({ card, index, workflow }: CardProps) => {
  const [, setIsOpen] = useModalForm({
    formModalType: 'editCard',
    cardId: card.id,
    workflowId: workflow?.id,
    workflowStateId: workflow?.workflowStates.find((state) =>
      state?.cards?.find((c) => c?.id === card.id),
    )?.id,
  });
  const { data: detailedCard } = useCardByIdsQuery(
    {
      ids: [card.id],
    },
    {
      enabled: false,
      select: (data) => data?.cardsByIds?.filter(notEmpty)[0],
    },
  );
  const search = useSearch<LocationGenerics>();
  const showDetails = search?.showDetails;
  const details = showDetails && {
    imageSrc:
      detailedCard?.files?.filter((file) => file?.type.startsWith('image'))?.[0]
        ?.base64 ?? '',
    descriptionHtml:
      detailedCard?.description &&
      detailedCard?.description !== '<p></p>' &&
      sanitize(detailedCard?.description),
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => {
        const isDragging = snapshot.isDragging && !snapshot.isDropAnimating;
        const cardStyles = classNames(
          'text-left bg-white w-full sm:w-52 lg:w-64 rounded border-2 mb-2 p-2 border-gray-500 hover:border-blue-400',
          isDragging && 'bg-blue-50 border-blue-400 shadow-lg',
          !card?.project && 'border-red-500 bg-red-50',
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
                <p className="uppercase text-gray-800 font-extralight text-sm">
                  {card.project?.name}
                </p>
                <p className="prose lg:prose-xl">{card.title}</p>
                {details && details.descriptionHtml && (
                  <div
                    className="ProseMirror h-min max-h-32 w-full my-2 overflow-y-auto"
                    dangerouslySetInnerHTML={{
                      __html: details.descriptionHtml,
                    }}
                  />
                )}
                {details && details.imageSrc && (
                  <img
                    src={details.imageSrc}
                    width={100}
                    height={100}
                    className="rounded"
                    alt="Card"
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
              'transition sm:mx-1 border-4',
              isFirst && 'sm:ml-0',
              snapshot.isDraggingOver && 'bg-blue-50 shadow-sm  border-dashed ',
              ' flex flex-col ',
              cards.length === 0 && 'relative h-36',
            )}>
            <button
              type="button"
              onClick={() => workflow?.id && setIsOpen(true)}
              className={classNames(
                'prose cursor-pointer isolate',
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
                  content={
                    <div className="text-sm">
                      <p>
                        Column ID
                        {workflowState.id}
                      </p>
                      <p>{workflowState?.description}</p>
                      <p>
                        {cards.length} card
                        {cards.length === 1 ? '' : 's'}
                      </p>
                      <p>Click to edit</p>
                    </div>
                  }>
                  <div
                    style={{ marginBlock: '8px' }}
                    className="flex items-center justify-between my-2">
                    <h3 style={{ marginBlock: 0 }}>{workflowState.name}</h3>
                    <span className="px-2 bg-blue-50  text-gray-500 font-extralight rounded-md ">
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
  return (
    <div
      className="flex sm:flex-row flex-col max-w-full"
      {...provided.droppableProps}
      ref={provided.innerRef}>
      <Tippy
        singleton={source}
        delay={[500, 100]}
        moveTransition="transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)"
      />
      {cols.map((col) => (
        <WorkflowState
          key={col.id}
          tooltipTarget={target}
          isDragging={isDragging}
          workflowState={col}
          cards={col?.cards?.filter(notEmpty) || []}
          workflow={workflow}
        />
      ))}
      {provided.placeholder}
    </div>
  );
}
