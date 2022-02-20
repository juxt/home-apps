import { ChatAltIcon } from '@heroicons/react/solid';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useCommentForEntity,
  useUserId,
  useCommentsForCardQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  CreateCommentMutationVariables,
  CommentInputSchema,
} from '@juxt-home/site';
import * as _ from 'lodash';
import { useCallback, BaseSyntheticEvent, useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { DeleteInactiveIcon, DeleteActiveIcon } from '../Icons';
import { OptionsMenu } from '../Menus';
import { juxters } from '../Tiptap';
import { RenderField, ErrorMessage } from './Components';
import { useDirty } from './hooks';
import { TipTapContent } from '../Tiptap/Tiptap';
import { Button } from '../Buttons';

export function CommentSection({ eId }: { eId: string }) {
  const { data, isLoading } = useCommentForEntity(eId, {
    refetchInterval: 5000,
  });
  const [commentLimit, setCommentLimit] = useState(5);
  const allComments =
    _.sortBy(data?.commentsForCard, (c) => c._siteValidTime) || [];
  const comments = _.takeRight(allComments, commentLimit);
  const userId = useUserId();
  const queryClient = useQueryClient();
  const commentMutationProps = {
    onSettled: () => {
      queryClient.refetchQueries(useCommentsForCardQuery.getKey({ id: eId }));
    },
  };
  const addCommentMutation = useCreateCommentMutation(commentMutationProps);
  const deleteCommentMutation = useDeleteCommentMutation(commentMutationProps);
  const addComment = useCallback(
    (input: CreateCommentMutationVariables) => {
      if (input.Comment.text !== '' && input.Comment.text !== '<p></p>') {
        toast.promise(
          addCommentMutation.mutateAsync({
            Comment: {
              ...input.Comment,
              cardId: eId,
            },
          }),
          {
            pending: 'Adding comment...',
            error: 'Error adding comment',
          },
          {
            autoClose: 500,
          },
        );
      }
    },
    [addCommentMutation, eId],
  );
  const schema = yup.object({ Comment: CommentInputSchema() });
  const formHooks = useForm<CreateCommentMutationVariables>({
    resolver: yupResolver(schema),
    defaultValues: {
      Comment: {
        cardId: eId,
        text: '<p></p>',
      },
    },
  });
  const { handleSubmit, reset, control } = formHooks;
  const { isDirty } = useFormState({ control });

  useDirty({ isDirty });

  const submitComment = useCallback(
    (e?: BaseSyntheticEvent) => {
      if (!isDirty) {
        e?.preventDefault();
        return;
      }
      handleSubmit(addComment, console.warn)(e);
      reset();
    },
    [isDirty, handleSubmit, addComment, reset],
  );

  const commentFormProps = {
    formHooks,
    cardId: eId,
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
  }, [submitComment]);
  const gravatar = (user: string) =>
    juxters.find((juxter) => juxter.staffRecord.juxtcode === user)?.avatar ||
    '';

  return (
    <section aria-labelledby="activity-title" className="sm:h-full">
      <div className="divide-y divide-gray-200 pr-2">
        <div className="pb-4">
          <h2 className="text-lg font-medium text-gray-900">Comments</h2>
        </div>
        <div className="pt-6">
          {/* Activity feed */}
          {comments && (
            <div className="flow-root h-full">
              <ul className="-mb-8">
                {comments.length !== allComments.length && (
                  <Button onClick={() => setCommentLimit(allComments.length)}>
                    Load more
                  </Button>
                )}
                {comments &&
                  comments.map((item, itemIdx) => (
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
                              src={gravatar(item?._siteSubject || '')}
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
                                      hidden:
                                        !userId ||
                                        userId !== item?._siteSubject,
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
                                Commented{' '}
                                {new Date(item._siteValidTime).toLocaleString()}
                              </p>
                            </div>
                            <TipTapContent
                              className="mt-2 max-h-max prose text-sm text-gray-700"
                              htmlString={item.text}
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {isLoading && <div className="flex justify-center">Loading...</div>}
          <div className="mt-10">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
                    src={gravatar(userId || '')}
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
              <div className="min-w-0 flex-1 text-left">
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
                        type: 'tiptap',
                      }}
                      props={commentFormProps}
                    />
                    <ErrorMessage error={error} />
                  </div>
                  <div className="my-6 flex items-center justify-end space-x-4">
                    <button
                      type="submit"
                      disabled={!isDirty}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-20">
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
