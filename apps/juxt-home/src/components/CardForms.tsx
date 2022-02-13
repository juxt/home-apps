import {
  BaseSyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as yup from 'yup';
import { LocationGenerics, ModalStateProps, Option } from '../types';
import { useForm } from 'react-hook-form';
import Table from './Table';
import { CellProps } from 'react-table';

import { useThrottleFn } from 'react-use';
import { yupResolver } from '@hookform/resolvers/yup';
import { CommentInputSchema } from '../generated/validation';

import SplitPane from 'react-split-pane';

import { Slider } from '@mantine/core';

import { Modal, ModalForm } from './Modal';
import classNames from 'classnames';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import {
  CreateHiringCardMutationVariables,
  UpdateHiringCardMutationVariables,
  useCardByIdsQuery,
  CardByIdsQuery,
  useCreateHiringCardMutation,
  useUpdateHiringCardMutation,
  CardHistoryQuery,
  useRollbackCardMutation,
  useKanbanDataQuery,
  useCardHistoryQuery,
  useCreateCommentMutation,
  useCommentsForCardQuery,
  CreateCommentMutationVariables,
  useMoveCardMutation,
  useDeleteCommentMutation,
} from '../generated/graphql';
import { defaultMutationProps } from '@juxt-home/kanban-helpers';
import { notEmpty, base64toBlob } from '@juxt-home/utils';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate, useSearch } from 'react-location';
import { ErrorMessage, FilePreview, Form, RenderField } from './Form';
import {
  useCardById,
  useCardHistory,
  useCommentForCard,
  useMobileDetect,
  useProjectOptions,
  useWorkflowStates,
} from '../hooks';
import { OptionsMenu } from './Menus';
import { ModalTabs } from './Tabs';
import { ChatAltIcon, ChevronDownIcon, XIcon } from '@heroicons/react/solid';
import {
  ArchiveActiveIcon,
  ArchiveInactiveIcon,
  DeleteActiveIcon,
  DeleteInactiveIcon,
} from './Icons';
import DOMPurify from 'dompurify';
import { Disclosure } from '@headlessui/react';
import _ from 'lodash-es';
import { Button } from './Buttons';
import { Tiptap } from './Tiptap';

function PdfViewer({ pdfString }: { pdfString?: string }) {
  const pdfUrl = useMemo(() => {
    const pdfBlob = pdfString && base64toBlob(pdfString);
    if (pdfBlob) {
      return URL.createObjectURL(pdfBlob);
    }
    return null;
  }, [pdfString]);
  // clean up object url on unmount
  useEffect(
    () => () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    },
    [pdfUrl],
  );
  return pdfUrl ? <Viewer fileUrl={pdfUrl} /> : <p>No Pdf</p>;
}

type AddCardInput = CreateHiringCardMutationVariables & {
  project: Option;
  workflowState: Option;
};

type AddCardModalProps = ModalStateProps;

export function AddCardModal({ isOpen, handleClose }: AddCardModalProps) {
  const queryClient = useQueryClient();
  const addCardMutation = useCreateHiringCardMutation({
    ...defaultMutationProps(queryClient),
  });
  const { workflowProjectId } = useSearch<LocationGenerics>();
  const cols = useWorkflowStates().data || [];
  const stateOptions = cols.filter(notEmpty).map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const formHooks = useForm<AddCardInput>();

  useEffect(() => {
    if (stateOptions.length > 0) {
      formHooks.setValue('workflowState', stateOptions[0]);
    }
  }, [stateOptions]);

  const addCard = (card: AddCardInput) => {
    if (!cols.length) {
      toast.error('No workflowStates to add card to');
      return;
    }
    handleClose();
    const newId = `card-${Date.now()}`;
    const { project, workflowState, ...cardInput } = card;
    toast.promise(
      addCardMutation.mutateAsync({
        cardId: newId,
        workflowStateId: workflowState?.value || cols[0].id,
        cardIds: [
          ...(cols
            .find((c) => c.id === workflowState?.value)
            ?.cards?.filter(notEmpty)
            .map((c) => c.id) || []),
          newId,
        ],
        card: {
          ...cardInput.card,
          projectId: project?.value,
        },
      }),
      {
        pending: 'Creating card...',
        success: 'Card created!',
        error: 'Error creating card',
      },
    );

    formHooks.resetField('card');
  };

  const projectOptions = useProjectOptions();
  const label = projectOptions.find(
    (p) => p.value === workflowProjectId,
  )?.label;
  useEffect(() => {
    if (workflowProjectId) {
      if (workflowProjectId && label) {
        formHooks.setValue('project', {
          label,
          value: workflowProjectId,
        });
      }
    }
  }, [workflowProjectId, label]);
  return (
    <ModalForm<AddCardInput>
      title="Add Card"
      formHooks={formHooks}
      fields={[
        {
          id: 'CardState',
          label: 'Card State',
          rules: {
            required: true,
          },
          options: stateOptions,
          path: 'workflowState',
          type: 'select',
        },
        {
          id: 'CardProject',
          type: 'select',
          options: projectOptions,
          label: 'Project',
          path: 'project',
        },
        {
          label: 'CV PDF',
          id: 'CVPDF',
          type: 'file',
          accept: 'application/pdf',
          multiple: false,
          path: 'card.cvPdf',
        },
        {
          id: 'CardName',
          placeholder: 'Card Name',
          label: 'Name',
          type: 'text',
          rules: {
            required: true,
          },
          path: 'card.title',
        },
        {
          id: 'CardDescription',
          label: 'Description',
          placeholder: 'Card Description',
          type: 'tiptap',
          path: 'card.description',
        },
        {
          label: 'Files',
          accept: 'image/jpeg, image/png, image/gif, application/pdf',
          id: 'CardFiles',
          type: 'multifile',
          path: 'card.files',
        },
      ]}
      onSubmit={formHooks.handleSubmit(addCard, console.warn)}
      isOpen={isOpen}
      handleClose={handleClose}
    />
  );
}

type UpdateCardInput = UpdateHiringCardMutationVariables & {
  project: Option;
  workflowState: Option;
};

export function UpdateCardForm({ handleClose }: { handleClose: () => void }) {
  const { modalState } = useSearch<LocationGenerics>();
  const cardId = modalState?.cardId;
  const queryClient = useQueryClient();
  const updateCardMutation = useUpdateHiringCardMutation({
    onSuccess: (data) => {
      const id = data.updateHiringCard?.id;
      if (id) {
        queryClient.refetchQueries(useCardByIdsQuery.getKey({ ids: [id] }));
      }
    },
  });
  const moveCardMutation = useMoveCardMutation({
    ...defaultMutationProps(queryClient),
  });

  const cols = useWorkflowStates().data || [];
  const stateOptions = cols.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const { card } = useCardById(cardId);

  const updateCard = (input: UpdateCardInput) => {
    handleClose();
    const { workflowState, project, ...cardInput } = input;
    const cardData = {
      card: { ...cardInput.card, projectId: project?.value },
      cardId: input.cardId,
    };

    const state = cols.find((c) => c.id === workflowState?.value);
    if (card && !_.isEqual(cardData.card, card)) {
      updateCardMutation.mutate({
        card: cardData.card,
        cardId: input.cardId,
      });
    }
    if (state && state.id !== card?.workflowState?.id) {
      moveCardMutation.mutate({
        workflowStateId: state.id,
        cardId: input.cardId,
        previousCard: 'end',
      });
    }
  };

  const formHooks = useForm<UpdateCardInput>({
    defaultValues: {
      card,
      cardId: card?.id,
    },
  });

  const processCard = async () => {
    if (!card) return;
    const processFiles = card.files?.filter(notEmpty).map(async (f) => {
      const previewUrl = f.name.startsWith('image') && f.base64;
      return {
        ...f,
        preview: previewUrl,
      };
    });
    const doneFiles = processFiles && (await Promise.all(processFiles));
    formHooks.setValue('card.files', doneFiles);
  };

  useEffect(() => {
    if (card) {
      formHooks.setValue('workflowState', {
        label: card?.workflowState?.name || 'Select a state',
        value: card?.workflowState?.id || '',
      });
      const projectId = card?.project?.id;
      formHooks.setValue('card', { ...card });
      if (card?.files) processCard();
      formHooks.setValue('card.cvPdf', card?.cvPdf);
      if (card.project?.name && projectId) {
        formHooks.setValue('project', {
          label: card.project?.name,
          value: projectId,
        });
      }
    }
  }, [card]);

  const title = card?.title
    ? `${card.title}: ${card.workflowState?.name}`
    : 'Update Card';
  const projectOptions = useProjectOptions();
  return (
    <div className="relative h-full overflow-y-auto">
      <Form
        title={title}
        formHooks={formHooks}
        fields={[
          {
            id: 'CardName',
            placeholder: 'Card Name',
            type: 'text',
            rules: {
              required: true,
            },
            path: 'card.title',
            label: 'Name',
          },
          {
            id: 'CardProject',
            type: 'select',
            rules: {
              required: {
                value: true,
                message: 'Please select a project',
              },
            },
            options: projectOptions,
            label: 'Project',
            path: 'project',
          },
          {
            id: 'CardState',
            label: 'Card State',
            rules: {
              required: true,
            },
            options: stateOptions,
            path: 'workflowState',
            type: 'select',
          },
          {
            label: 'CV PDF',
            id: 'CVPDF',
            type: 'file',
            accept: 'application/pdf',
            multiple: false,
            path: 'card.cvPdf',
          },
          {
            label: 'Description',
            id: 'CardDescription',
            placeholder: 'Card Description',
            type: 'tiptap',
            path: 'card.description',
          },
          {
            label: 'Other Files (optional)',
            accept: 'image/jpeg, image/png, image/gif, application/pdf',
            id: 'CardFiles',
            type: 'multifile',
            path: 'card.files',
          },
        ]}
        onSubmit={formHooks.handleSubmit(updateCard, console.warn)}
      />
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          form={title}
          className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
          Submit
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={handleClose}>
          Cancel
        </button>
      </div>
      <div className="absolute top-7 sm:top-5 right-4">
        <OptionsMenu
          options={[
            {
              label: 'Archive',
              id: 'archive',
              Icon: ArchiveInactiveIcon,
              ActiveIcon: ArchiveActiveIcon,
              props: {
                onClick: () => {
                  handleClose();
                  if (card?.id) {
                    toast.promise(
                      updateCardMutation.mutateAsync({
                        cardId: card.id,
                        card: {
                          ...card,
                          projectId: null,
                        },
                      }),
                      {
                        pending: 'Archiving card...',
                        success: 'Card archived!',
                        error: 'Error archiving card',
                      },
                    );
                  }
                },
              },
            },
          ]}
        />
      </div>
    </div>
  );
}

function CommentSection({ cardId }: { cardId: string }) {
  const { data: comments } = useCommentForCard(cardId);
  const queryClient = useQueryClient();
  const commentMutationProps = {
    onSettled: () => {
      queryClient.refetchQueries(
        useCommentsForCardQuery.getKey({ id: cardId }),
      );
    },
  };
  const addCommentMutation = useCreateCommentMutation(commentMutationProps);
  const deleteCommentMutation = useDeleteCommentMutation(commentMutationProps);
  const addComment = (input: CreateCommentMutationVariables) => {
    toast.promise(
      addCommentMutation.mutateAsync({
        Comment: {
          ...input.Comment,
          cardId,
        },
      }),
      {
        pending: 'Adding comment...',
        success: 'Comment added!',
        error: 'Error adding comment',
      },
      {
        autoClose: 500,
      },
    );
  };
  const schema = yup.object({ Comment: CommentInputSchema() });
  const formHooks = useForm<CreateCommentMutationVariables>({
    resolver: yupResolver(schema),
    defaultValues: {
      Comment: {
        cardId,
      },
    },
  });

  const submitComment = (e?: BaseSyntheticEvent) => {
    formHooks.handleSubmit(addComment, console.warn)(e);
    formHooks.reset();
  };
  const commentFormProps = {
    formHooks,
    cardId,
    onSubmit: submitComment,
  };
  const error = formHooks.formState.errors.Comment?.text;
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (
        (event.code === 'Enter' || event.code === 'NumpadEnter') &&
        (event.ctrlKey || event.metaKey)
      ) {
        submitComment();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);
  const gravatar = () => 'https://avatars.githubusercontent.com/u/9809256?v=4';

  return (
    <section aria-labelledby="activity-title" className="sm:h-full">
      <div className="divide-y divide-gray-200 pr-2">
        <div className="pb-4">
          <h2 id="activity-title" className="text-lg font-medium text-gray-900">
            Activity
          </h2>
        </div>
        <div className="pt-6">
          {/* Activity feed */}
          <div className="flow-root h-full">
            <ul className="-mb-8">
              {comments &&
                _.sortBy(comments, (c) => c._siteValidTime).map(
                  (item, itemIdx) => (
                    <li key={item.id} className="text-left">
                      <div className="relative pb-8">
                        {itemIdx !== comments.length - 1 ? (
                          <span
                            className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex items-start space-x-3">
                          <div className="relative">
                            <img
                              className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
                              src={gravatar()}
                              alt=""
                            />

                            <span className="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px">
                              <ChatAltIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div>
                              <div className="text-sm flex flex-row justify-between">
                                <button
                                  type="button"
                                  className="font-medium text-gray-900">
                                  {item?._siteSubject || 'alx'}
                                </button>
                                <OptionsMenu
                                  options={[
                                    {
                                      label: 'Delete',
                                      id: 'delete',
                                      Icon: DeleteInactiveIcon,
                                      ActiveIcon: DeleteActiveIcon,
                                      props: {
                                        onClick: () => {
                                          toast.promise(
                                            deleteCommentMutation.mutateAsync({
                                              commentId: item.id,
                                            }),
                                            {
                                              pending: 'Deleting comment...',
                                              success: 'Comment deleted!',
                                              error: 'Error deleting comment',
                                            },
                                            {
                                              autoClose: 1000,
                                            },
                                          );
                                        },
                                      },
                                    },
                                  ]}
                                />
                              </div>
                              <p className="mt-0.5 text-sm text-gray-500">
                                Commented {item._siteValidTime}
                              </p>
                            </div>
                            <div className="mt-2 text-sm text-gray-700">
                              <p>{item.text}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ),
                )}
            </ul>
          </div>
          <div className="mt-10">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
                    src={gravatar()}
                    alt=""
                  />

                  <span className="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px">
                    <ChatAltIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <form onSubmit={commentFormProps.onSubmit}>
                  <div>
                    <label htmlFor="comment" className="sr-only">
                      Comment
                    </label>
                    <RenderField
                      field={{
                        id: 'commentText',
                        path: 'Comment.text',
                        placeholder: 'Type a comment (ctrl+enter to send)',
                        type: 'textarea',
                      }}
                      props={commentFormProps}
                    />
                    <ErrorMessage error={error} />
                  </div>
                  <div className="my-6 flex items-center justify-end space-x-4">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
                      Comment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InterviewModal({
  handleClose,
  show,
}: {
  show: boolean;
  handleClose: () => void;
}) {
  const [questionNumber, setQuestionNumber] = useState(1);

  const questions = [
    {
      id: 'q-1',
      question:
        'Tell me about a time where your communication with others helped you build rapport or create better relationships and outcomes?',
      lookingFor: [
        'How did they learn about the other person?',
        'Were their exchanges based on respect, or simply getting an outcome?',
        ' Did they continue the effort? Did they only do so to get a result, or do they show a pattern of always working at relationships?',
      ],
      weak: [
        'Only interested in other person for potential outcome',
        'Does not consistently build relationships',
        'Only calls when they want something',
        'Cannot demonstrate clear business benefit',
      ],
      strong: [
        'Creates strategy for building relationships',
        'Articulates benefit of wide ranging relationships',
        'Gives before getting',
        'Maintains relationships without near term business gain',
      ],
    },
    {
      id: 'q-2',
      question:
        'Tell me about an effective relationship you have created and kept over a long period. How did you achieve that?',
      lookingFor: [
        'What do they describe as "long"?',
        'What actions did they take to keep the relationship active?',
        'Was there reciprocity – a willingness to share as well as benefit?',
        'What different forms of communication do they use?',
        'How do they communicate in ways that are helpful to the other person?',
      ],
      weak: [
        'Long is less than 1-2 years',
        'Relies on other person to make contact',
        'Does not offer to give before getting',
        'Communicates in a limited way',
        'Has only internal relationships',
      ],
      strong: [
        'Has a strategy for maintaining relationship',
        'Gives without prospect of getting',
        'Communicates in multiple ways',
        'Has relationships in different companies/industries',
        'Demonstrates different communication styles',
      ],
    },
  ];
  const [scores, setScores] = useState<Record<string, number | undefined>>(
    Object.fromEntries(questions.map(({ id }) => [id, undefined])),
  );

  const question = questions[questionNumber - 1];
  const sliderMarks = [
    { value: 0, label: '💩' },
    { value: 25, label: '😕' },
    { value: 50, label: '🤷‍♀️' },
    { value: 75, label: '👌' },
    { value: 100, label: '😎' },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    ref.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  const handleNext = () => {
    setQuestionNumber((prev) => prev + 1);
    scrollToTop();
  };

  const handlePrev = () => {
    setQuestionNumber((prev) => prev - 1);
    scrollToTop();
  };
  useEffect(() => {
    setTimeout(() => ref.current?.scrollTo({ top: 0 }), 50);
  }, [show]);

  return (
    <Modal className="h-screen-80" isOpen={show} handleClose={handleClose}>
      <div ref={ref} className="relative py-16 bg-white overflow-auto">
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="text-lg max-w-prose mx-auto">
            <h1>
              <span className="block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">
                Interview 1
              </span>
              <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Question {questionNumber}
              </span>
            </h1>
            <div className="bg-indigo-700 rounded-lg">
              <div className="text-center mt-4 py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
                <p className="text-xl leading-6 text-indigo-50">
                  {question.question}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto">
            <h2>Behaviours to look for:</h2>
            <ul>
              {question.lookingFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="flex space-x-4">
              <div>
                <h2>Weak</h2>
                <ul>
                  {question.weak.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2>Strong</h2>
                <ul>
                  {question.strong.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full">
                <h2>Score:</h2>
                <Slider
                  key={`slider-${questionNumber}`}
                  value={scores[question.id] || 0}
                  onChange={(value) => {
                    setScores({
                      ...scores,
                      [question.id]: value,
                    });
                  }}
                  labelTransition="skew-down"
                  labelTransitionDuration={150}
                  labelTransitionTimingFunction="ease"
                  label={(val) =>
                    sliderMarks.find((mark) => mark.value === val)?.label
                  }
                  defaultValue={50}
                  step={25}
                  marks={[
                    { value: 0, label: 'Weak' },
                    { value: 100, label: 'Strong' },
                  ]}
                />
                <h2>What was said:</h2>
                <div className="flex justify-center">
                  <Tiptap
                    key={`tiptap-${questionNumber}`}
                    onChange={() => null}
                    withTaskListExtension
                    withLinkExtension
                    withTypographyExtension
                    withPlaceholderExtension
                    withMentionSuggestion
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav
        className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        aria-label="Pagination">
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Question <span className="font-medium">{questionNumber}</span> of{' '}
            <span className="font-medium">{questions.length}</span>
          </p>
        </div>
        <div className="flex-1 flex justify-between sm:justify-end">
          <Button
            onClick={() => {
              ref.current?.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
              handlePrev();
            }}
            disabled={questionNumber === 1}
            className="mr-2">
            Previous
          </Button>
          {questionNumber === questions.length ? (
            <Button primary onClick={handleNext}>
              Submit
            </Button>
          ) : (
            <Button
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </nav>
    </Modal>
  );
}

function CloseIcon(open: boolean) {
  return (
    <ChevronDownIcon
      className={classNames(
        'w-4 h-4',
        open ? 'transform rotate-180 text-primary-500' : '',
      )}
    />
  );
}

function CardInfo({
  card,
  resetSplit,
}: {
  card: NonNullable<NonNullable<CardByIdsQuery['cardsByIds']>[0]>;
  resetSplit?: () => void;
}) {
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [splitSize, setSplitSize] = useState(
    parseInt(localStorage.getItem('hsplitPos') || '700', 10),
  );
  const handleResize = (size?: number) => {
    if (size) {
      localStorage.setItem('hsplitPos', size.toString());
    }
  };
  useThrottleFn(handleResize, 500, [splitSize]);

  const accordionButtonClass = classNames(
    'flex items-center justify-between w-full px-4 py-2 my-2 rounded-base cursor-base focus:outline-none',
    'bg-orange-50 rounded-lg text-primary-800 dark:bg-primary-200 dark:bg-opacity-15 dark:text-primary-200',
  );
  return (
    <>
      <InterviewModal
        show={showQuestionModal}
        handleClose={() => setShowQuestionModal(false)}
      />
      <div className="h-full rounded">
        {resetSplit && (
          <button
            type="button"
            className="lg:hidden absolute top-0 z-20 bg-white left-0 mr-4 mt-4 cursor-pointer"
            onClick={resetSplit}>
            Reset Split
          </button>
        )}
        <SplitPane
          onChange={setSplitSize}
          style={{
            overflowY: 'auto',
          }}
          split="horizontal"
          defaultSize={splitSize}>
          <div className="text-center mx-4 flex flex-col w-full items-center justify-center isolate">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {card.title}
            </h2>
            <p>{card.id}</p>
            {card?.project?.name && (
              <p>
                Project:
                {card.project.name}
              </p>
            )}
            <p className="text-gray-500">
              Last Updated
              {card._siteValidTime}
            </p>
            {card?._siteSubject && (
              <p className="text-gray-500">
                By:
                {card._siteSubject}
              </p>
            )}
            {card?.workflowState && (
              <p className="text-gray-500">
                Status:
                {card.workflowState.name}
              </p>
            )}
            {card?.description && (
              <div
                className="ProseMirror prose text-left bg-white shadow-lg w-full no-scrollbar h-full mb-4"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(card?.description || ''),
                }}
              />
            )}
          </div>
          <div className="max-w-4xl overflow-y-auto lg:overflow-y-hidden h-full mx-auto text-center flex flex-wrap lg:flex-nowrap items-center lg:items-baseline">
            <div className="w-full lg:h-full lg:overflow-y-auto m-4">
              {true && (
                <Disclosure defaultOpen as="div" className="mt-2 w-full">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={accordionButtonClass}>
                        <span>Interview 1</span>
                        {CloseIcon(open)}
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-muted">
                        <div className="mt-2 flex justify-between items-center">
                          Status: Booked for 03/02/22 at 4pm
                          <Button onClick={() => setShowQuestionModal(true)}>
                            Start
                          </Button>
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              )}
              {card?.files && card?.files.length > 0 && (
                <Disclosure as="div" className="mt-2 w-full">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={accordionButtonClass}>
                        <span>Other Files</span>
                        {CloseIcon(open)}
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-muted">
                        {card?.files && (
                          <div className="mt-2 flex justify-between">
                            {card.files.filter(notEmpty).map((file) => (
                              <div
                                key={file.name}
                                className="flex items-center">
                                <FilePreview file={file} />
                              </div>
                            ))}
                          </div>
                        )}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              )}
            </div>
            <div className="w-full px-4 sm:h-full lg:overflow-y-auto">
              <CommentSection cardId={card.id} />
            </div>
          </div>
        </SplitPane>
      </div>
    </>
  );
}

function CardView() {
  const cardId = useSearch<LocationGenerics>().modalState?.cardId;
  const { data, isLoading } = useCardById(cardId);

  const card = data?.cardsByIds?.[0];
  const screen = useMobileDetect();
  const isMobile = screen.isMobile();

  const [splitSize, setSplitSize] = useState(
    parseInt(localStorage.getItem('vsplitPos') || '900', 10),
  );
  const [splitKey, setSplitKey] = useState(splitSize);
  const handleResize = (size?: number) => {
    if (size) {
      localStorage.setItem('vsplitPos', size.toString());
    }
  };
  useThrottleFn(handleResize, 500, [splitSize]);
  const resetSplit = () => {
    setSplitSize(400);
    setSplitKey(splitSize);
    localStorage.removeItem('vsplitPos');
  };

  const pdfData = card?.cvPdf?.base64;

  return (
    <div className="relative h-full">
      <div className="flex h-full flex-col lg:flex-row justify-around items-center lg:items-start ">
        {isMobile ? (
          <div className="w-full h-full overflow-y-scroll">
            {card && <CardInfo card={card} />}
          </div>
        ) : (
          <SplitPane
            pane2Style={{
              overflowY: 'auto',
            }}
            paneStyle={{
              height: '100%',
            }}
            key={splitKey}
            split="vertical"
            defaultSize={splitSize}
            onChange={setSplitSize}>
            {isLoading && (
              <div className="flex flex-col justify-center items-center h-full">
                <div className="text-center">
                  <h1 className="text-3xl font-extrabold text-gray-900">
                    Loading Card Details...
                  </h1>
                </div>
              </div>
            )}
            {card && (
              <CardInfo
                resetSplit={splitSize > 400 ? resetSplit : undefined}
                card={card}
              />
            )}
            {!card && (
              <div className="flex flex-col justify-center items-center h-full">
                <h1 className="text-3xl font-extrabold text-gray-900">
                  No Card Found
                </h1>
              </div>
            )}
            <div>
              {pdfData ? (
                <div className="max-w-3xl block overflow-y-auto">
                  {/* passing splitSize as a key forces the viewer to rerender when split is changed */}
                  <PdfViewer key={splitSize} pdfString={pdfData} />
                </div>
              ) : (
                <div className="text-center">
                  <h1 className="text-3xl font-extrabold text-gray-900">
                    No CV found
                  </h1>
                </div>
              )}
            </div>
          </SplitPane>
        )}
      </div>
    </div>
  );
}

type TCardHistoryCard = NonNullable<
  NonNullable<CardHistoryQuery['cardHistory']>[0]
>;

function TitleComponent({ value }: CellProps<TCardHistoryCard>) {
  return <div className="text-sm truncate">{value || 'Untitled'}</div>;
}

function CardHistory() {
  const cardId = useSearch<LocationGenerics>().modalState?.cardId;
  const { history } = useCardHistory(cardId);
  const queryClient = useQueryClient();
  const rollbackMutation = useRollbackCardMutation({
    onSettled: (data) => {
      const id = data?.rollbackCard?.id || '';
      queryClient.refetchQueries(useCardByIdsQuery.getKey({ ids: [id] }));
      queryClient.refetchQueries(useKanbanDataQuery.getKey());
      queryClient.refetchQueries(useCardHistoryQuery.getKey({ id }));
    },
  });
  const handleRollback = async (card: TCardHistoryCard) => {
    toast.promise(
      rollbackMutation.mutateAsync({ id: card.id, asOf: card._siteValidTime }),
      {
        success: 'Card rolled back successfully',
        error: 'Card rollback failed',
        pending: 'Rolling back card...',
      },
    );
  };
  // eslint-disable-next-line react/no-unstable-nested-components
  function RollbackButton({ row }: CellProps<TCardHistoryCard>) {
    return (
      <button
        type="button"
        className="inline-flex justify-center items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => handleRollback(row.original)}>
        Rollback
      </button>
    );
  }
  const data = useMemo(
    () =>
      history?.filter(notEmpty).map((card, i) => {
        const hasDescriptionChanged =
          history[i + 1] && history[i + 1]?.description !== card?.description;
        const projectChanged =
          history[i + 1] &&
          history[i + 1]?.project?.name !== card?.project?.name;
        const cvChanged =
          history[i + 1] && history[i + 1]?.cvPdf?.name !== card?.cvPdf?.name;
        const filesChanged =
          history[i + 1] &&
          history[i + 1]?.files?.map((f) => f?.name).toString() !==
            card?.files?.map((f) => f?.name).toString();
        const titleChanged =
          history[i + 1] && history[i + 1]?.title !== card?.title;
        const nothingChanged =
          !titleChanged &&
          !hasDescriptionChanged &&
          !projectChanged &&
          !cvChanged &&
          !filesChanged;

        return {
          ...card,
          nothingChanged,
          hasDescriptionChanged,
          projectChanged,
          cvChanged,
          filesChanged,
          titleChanged,
          diff: [
            titleChanged && 'Title changed',
            hasDescriptionChanged && 'description changed',
            projectChanged && 'project changed',
            cvChanged && 'cv changed',
            filesChanged && 'files changed',
          ]
            .filter((s) => s)
            .join(', '),
        };
      }),
    [history],
  );

  const cols = useMemo(
    () => [
      {
        Header: 'Diff',
        accessor: 'diff',
      },
      {
        Header: 'Title',
        accessor: 'title',
        Cell: TitleComponent,
      },
      {
        Header: 'Project',
        accessor: 'project.name',
      },
      {
        Header: 'Edited By',
        accessor: '_siteSubject',
      },
      {
        Header: 'Updated at',
        accessor: '_siteValidTime',
      },
      {
        Header: 'Actions',
        Cell: RollbackButton,
      },
    ],
    [],
  );

  return (
    <div className="relative h-full">
      {!history ? (
        <div className="flex flex-col lg:flex-row justify-around items-center lg:items-start h-screen">
          <div className="flex flex-col justify-center items-center h-full">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-gray-900">
                Loading Card History...
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row justify-around items-center lg:items-start h-full">
          <div className="flex flex-col h-full w-full overflow-x-auto lg:w-fit lg:overflow-x-hidden px-4 relative">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-gray-900">
                Card History
              </h1>
            </div>
            <Table columns={cols} data={data} />
          </div>
        </div>
      )}
    </div>
  );
}

type CardModalProps = ModalStateProps;

export function CardModal({ isOpen, handleClose }: CardModalProps) {
  const { cardModalView, ...search } = useSearch<LocationGenerics>();
  const cardId = useSearch<LocationGenerics>().modalState?.cardId;
  const { data, error } = useCardById(cardId);
  const navigate = useNavigate<LocationGenerics>();
  const hasUnsaved = false; // TODO
  const card = data?.cardsByIds?.[0];
  const pdfLzString = card?.cvPdf?.base64;

  const onClose = () => {
    const confirmation =
      hasUnsaved &&
      // eslint-disable-next-line no-restricted-globals
      confirm('You have unsaved changes. Are you sure you want to close?');
    if (!hasUnsaved || confirmation) {
      handleClose();
      if (cardModalView !== 'view') {
        // delayed to stop flicker
        setTimeout(() => {
          navigate({
            search: {
              ...search,
              modalState: undefined,
              cardModalView: undefined,
            },
          });
        }, 400);
      }
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      handleClose={onClose}
      fullWidth={cardModalView !== 'update'}
      noScroll>
      <div className="fixed w-full top-0 z-10 bg-white">
        <ModalTabs
          tabs={[
            { id: 'view', name: 'View', default: !cardModalView },
            { id: 'cv', name: 'CV', hidden: !pdfLzString },
            { id: 'update', name: 'Edit' },
            { id: 'history', name: 'History' },
          ]}
          navName="cardModalView"
        />
        <div className="absolute top-3 right-3 w-5 h-5 cursor-pointer">
          <XIcon onClick={onClose} />
        </div>
      </div>
      <div className="h-full" style={{ paddingTop: '54px' }}>
        {error && (
          <div className="flex flex-col justify-center items-center h-full">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-gray-900">
                Error Loading Card
              </h1>
            </div>
            <div className="text-center">
              <p className="text-gray-700">{error.message}</p>
            </div>
          </div>
        )}
        {(!cardModalView || cardModalView === 'view') && <CardView />}
        {cardModalView === 'update' && <UpdateCardForm handleClose={onClose} />}
        {cardModalView === 'history' && <CardHistory />}
        {cardModalView === 'cv' && (
          <div className="block mx-auto max-w-xl h-full min-h-full ">
            <PdfViewer pdfString={pdfLzString} />
          </div>
        )}
      </div>
    </Modal>
  );
}
