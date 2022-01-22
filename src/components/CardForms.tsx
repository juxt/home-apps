import { Fragment, useEffect, useMemo, useState } from "react";
import { LocationGenerics, ModalStateProps, Option, TCard } from "../types";
import { useForm } from "react-hook-form";
import Table from "./Table";
import {
  CellProps,
  FilterProps,
  FilterValue,
  IdType,
  Row,
  TableInstance,
} from "react-table";

import { useThrottleFn } from "react-use";

import SplitPane from "react-split-pane";

import { Modal, ModalForm } from "./Modal";
import classNames from "classnames";
import { ScrollMode, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import {
  CardInput,
  CreateCardMutationVariables,
  UpdateCardMutationVariables,
  useCardByIdsQuery,
  CardByIdsQuery,
  useCreateCardMutation,
  useUpdateCardMutation,
  CardHistoryQuery,
  useRollbackCardMutation,
  useKanbanDataQuery,
  useCardHistoryQuery,
  useCreateCommentMutation,
  useCommentsForCardQuery,
  CreateCommentMutationVariables,
} from "../generated/graphql";
import {
  base64toBlob,
  defaultMutationProps,
  notEmpty,
  uncompressBase64,
} from "../kanbanHelpers";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useNavigate, useSearch } from "react-location";
import { FilePreview, Form, RenderField } from "./Form";
import {
  useCardById,
  useCardHistory,
  useCommentForCard,
  useDebounce,
  useMobileDetect,
  useProjectOptions,
  useWorkflowStates,
} from "../hooks";
import { OptionsMenu } from "./Menus";
import { ModalTabs, NavTabs } from "./Tabs";
import {
  ChatAltIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  TagIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/solid";
import DOMPurify from "dompurify";
import { Disclosure } from "@headlessui/react";
import { update } from "lodash-es";
import _ from "lodash";

type AddCardInput = CreateCardMutationVariables & {
  project: Option;
  workflowState: Option;
};

type AddCardModalProps = ModalStateProps;

export function AddCardModal({ isOpen, handleClose }: AddCardModalProps) {
  const queryClient = useQueryClient();
  const addCardMutation = useCreateCardMutation({
    ...defaultMutationProps(queryClient),
  });
  const { workflowProjectId } = useSearch<LocationGenerics>();
  const cols = useWorkflowStates().data || [];
  const stateOptions = cols.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const formHooks = useForm<AddCardInput>();
  const addCard = (card: AddCardInput) => {
    if (!cols.length) {
      toast.error("No workflowStates to add card to");
      return;
    }
    handleClose();
    console.log("render");

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
        pending: "Creating card...",
        success: "Card created!",
        error: "Error creating card",
      }
    );
  };

  const projectOptions = useProjectOptions();
  useEffect(() => {
    if (workflowProjectId) {
      if (workflowProjectId) {
        formHooks.setValue("project", {
          label:
            projectOptions.find((p) => p.value === workflowProjectId)?.label ??
            "",
          value: workflowProjectId,
        });
      }
    }
  }, [workflowProjectId]);
  return (
    <ModalForm<AddCardInput>
      title="Add Card"
      formHooks={formHooks}
      fields={[
        {
          id: "CardState",
          label: "Card State",
          rules: {
            required: true,
          },
          options: stateOptions,
          path: "workflowState",
          type: "select",
        },
        {
          id: "CardProject",
          type: "select",
          options: projectOptions,
          label: "Project",
          path: "project",
        },
        {
          id: "CardName",
          placeholder: "Card Name",
          label: "Name",
          type: "text",
          rules: {
            required: true,
          },
          path: "card.title",
        },
        {
          id: "CardDescription",
          label: "Description",
          placeholder: "Card Description",
          type: "tiptap",
          path: "card.description",
        },
        {
          label: "Files",
          accept: "image/jpeg, image/png, image/gif, application/pdf",
          id: "CardFiles",
          type: "multifile",
          path: "card.files",
        },
      ]}
      onSubmit={formHooks.handleSubmit(addCard, console.warn)}
      isOpen={isOpen}
      handleClose={handleClose}
    />
  );
}

type UpdateCardInput = UpdateCardMutationVariables & {
  project: Option;
};

export function UpdateCardForm({ handleClose }: { handleClose: () => void }) {
  const { modalState } = useSearch<LocationGenerics>();
  const workflowId = modalState?.workflowId;
  const cardId = modalState?.cardId;
  const queryClient = useQueryClient();
  const updateCardMutation = useUpdateCardMutation({
    ...defaultMutationProps(queryClient),
  });

  const updateCard = (input: UpdateCardInput) => {
    handleClose();
    const card = { ...input.card, projectId: input.project?.value || null };
    updateCardMutation.mutate({ card, cardId: input.cardId });
  };

  const { card } = useCardById(cardId);

  const formHooks = useForm<UpdateCardInput>({
    defaultValues: {
      card: { ...card, workflowId: workflowId },
      cardId: card?.id,
    },
  });

  const processCard = async () => {
    if (!card) return;
    const processFiles = card.files?.filter(notEmpty).map(async (f) => {
      const previewUrl =
        f.name.startsWith("image") && uncompressBase64(f.lzbase64);
      return {
        ...f,
        preview: previewUrl,
      };
    });
    const doneFiles = processFiles && (await Promise.all(processFiles));
    formHooks.setValue("card.files", doneFiles);
  };

  useEffect(() => {
    if (card) {
      const projectId = card?.project?.id;
      formHooks.setValue("card", { ...card, files: [] });
      card?.files && processCard();
      formHooks.setValue("card.workflowId", workflowId);
      formHooks.setValue("card.cvPdf", card?.cvPdf);

      if (card.project?.name && projectId) {
        formHooks.setValue("project", {
          label: card.project?.name,
          value: projectId,
        });
      } else {
        formHooks.setValue("project", { label: "", value: "" });
      }
    }
  }, [card]);

  const title = "Update Card";
  const projectOptions = useProjectOptions();
  return (
    <div className="relative">
      <Form
        title={title}
        formHooks={formHooks}
        fields={[
          {
            id: "CardName",
            placeholder: "Card Name",
            type: "text",
            rules: {
              required: true,
            },
            path: "card.title",
            label: "Name",
          },
          {
            id: "CardProject",
            type: "select",
            options: projectOptions,
            label: "Project",
            path: "project",
          },
          {
            label: "CV PDF",
            id: "CVPDF",
            type: "file",
            accept: "application/pdf",
            multiple: false,
            path: "card.cvPdf",
          },
          {
            label: "Description",
            id: "CardDescription",
            placeholder: "Card Description",
            type: "tiptap",
            path: "card.description",
          },
          {
            label: "Other Files (optional)",
            accept: "image/jpeg, image/png, image/gif, application/pdf",
            id: "CardFiles",
            type: "multifile",
            path: "card.files",
          },
        ]}
        onSubmit={formHooks.handleSubmit(updateCard, console.warn)}
      />
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          form={title}
          className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Submit
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={handleClose}
        >
          Cancel
        </button>
      </div>
      <div className="absolute top-7 sm:top-5 right-4">
        <OptionsMenu
          options={[
            {
              label: "Delete",
              id: "delete",
              props: {
                onClick: () => {
                  handleClose();
                  if (card?.id) {
                    toast.promise(
                      updateCardMutation.mutateAsync({
                        cardId: card.id,
                        card: {
                          projectId: null,
                        },
                      }),
                      {
                        pending: "Deleting card...",
                        success: "Card deleted!",
                        error: "Error deleting card",
                      }
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
  const addCommentMutation = useCreateCommentMutation({
    onSettled: () => {
      queryClient.refetchQueries(
        useCommentsForCardQuery.getKey({ id: cardId })
      );
    },
  });
  const addComment = (input: CreateCommentMutationVariables) => {
    toast.promise(
      addCommentMutation.mutateAsync({
        Comment: {
          ...input.Comment,
          cardId: cardId,
        },
      }),
      {
        pending: "Adding comment...",
        success: "Comment added!",
        error: "Error adding comment",
      }
    );
  };
  const formHooks = useForm<CreateCommentMutationVariables>();
  const commentFormProps = {
    formHooks,
    cardId,
    onSubmit: formHooks.handleSubmit(addComment, console.warn),
  };
  const gravatar = (email: string) =>
    "https://avatars.githubusercontent.com/u/9809256?v=4";

  return (
    <section aria-labelledby="activity-title" className="h-full">
      <div className="divide-y divide-gray-200 h-full">
        <div className="pb-4">
          <h2 id="activity-title" className="text-lg font-medium text-gray-900">
            Activity
          </h2>
        </div>
        <div className="pt-6">
          {/* Activity feed*/}
          <div className="flow-root h-full">
            <ul role="list" className="-mb-8">
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
                              src={gravatar("lda@juxt.pro")}
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
                              <div className="text-sm">
                                <a
                                  href=""
                                  className="font-medium text-gray-900"
                                >
                                  {item?._siteSubject || "alx"}
                                </a>
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
                  )
                )}
            </ul>
          </div>
          <div className="mt-10 mb-20">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
                    src={gravatar("alx@juxt.pro")}
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
                        id: "commentText",
                        rules: {
                          required: true,
                        },
                        path: "Comment.text",
                        type: "textarea",
                      }}
                      props={commentFormProps}
                    />
                  </div>
                  <div className="mt-6 flex items-center justify-end space-x-4">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    >
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

function CardInfo({
  card,
  resetSplit,
}: {
  card: NonNullable<NonNullable<CardByIdsQuery["cardsByIds"]>[0]>;
  resetSplit?: () => void;
}) {
  const CloseIcon = (open: boolean) => (
    <ChevronDownIcon
      className={classNames(
        "w-4 h-4",
        open ? "transform rotate-180 text-primary-500" : ""
      )}
    />
  );
  const accordionButtonClass = classNames(
    "flex items-center justify-between w-full px-4 py-2 rounded-base cursor-base focus:outline-none",
    "bg-primary-50 text-primary-800 dark:bg-primary-200 dark:bg-opacity-15 dark:text-primary-200"
  );
  return (
    <div className="h-full rounded">
      {resetSplit && (
        <button
          className="lg:hidden absolute top-0 left-0 mr-4 mt-4 cursor-pointer"
          onClick={resetSplit}
        >
          Reset Split
        </button>
      )}
      <div className="max-w-4xl overflow-y-auto lg:overflow-y-hidden h-full mx-auto text-center flex flex-wrap lg:flex-nowrap items-center lg:items-baseline">
        <div className="w-full lg:overflow-y-auto ">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {card.title}
          </h2>
          <p>{card.id}</p>
          {card?.project?.name && <p>Project: {card.project.name}</p>}
          <p className="text-gray-500">Last Updated {card._siteValidTime}</p>
          {card?._siteSubject && (
            <p className="text-gray-500">By: {card._siteSubject}</p>
          )}
          {card?.workflowState && (
            <p className="text-gray-500">Status: {card.workflowState.name}</p>
          )}
          {card?.description && (
            <Disclosure defaultOpen as="div" className="w-full ">
              {({ open }) => (
                <>
                  <Disclosure.Button className={accordionButtonClass}>
                    <span>Description</span>
                    {CloseIcon(open)}
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-muted flex justify-center">
                    <div
                      className="ProseMirror prose text-left w-full bg-white max-w-max shadow-lg no-scrollbar"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(card?.description || ""),
                      }}
                    />
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
                      <div className="mt-2">
                        {card.files.filter(notEmpty).map((file, i) => (
                          <div
                            key={file.name + i}
                            className="flex items-center"
                          >
                            <div className="flex-shrink-0">
                              <FilePreview
                                handleDelete={() => {}}
                                file={file}
                              />
                            </div>
                            <div className="ml-4"></div>
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
        <div className="w-full mx-4 lg:overflow-y-auto lg:h-full">
          <CommentSection cardId={card.id} />
        </div>
      </div>
    </div>
  );
}

function CardView({ handleClose }: { handleClose: () => void }) {
  const cardId = useSearch<LocationGenerics>().modalState?.cardId;
  const { data } = useCardById(cardId);
  const card = data?.cardsByIds?.[0];
  const pdfLzString = card?.cvPdf?.lzbase64;
  const pdfUrl = useMemo(() => {
    const pdfBase64 = pdfLzString && uncompressBase64(pdfLzString);
    const pdfBlob = pdfBase64 && base64toBlob(pdfBase64);
    if (pdfBlob) {
      return URL.createObjectURL(pdfBlob);
    }
  }, [pdfLzString]);
  // clean up object url on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);
  const isMobile = useMobileDetect().isMobile();

  const [splitSize, setSplitSize] = useState(
    parseInt(localStorage.getItem("splitPos") || "500", 10)
  );
  const [splitKey, setSplitKey] = useState(splitSize);
  const handleResize = (size?: number) => {
    if (size) {
      localStorage.setItem("splitPos", size.toString());
    }
  };
  useThrottleFn(handleResize, 500, [splitSize]);
  const resetSplit = () => {
    setSplitSize(400);
    setSplitKey(splitSize);
    localStorage.removeItem("splitPos");
  };

  return (
    <div className="relative h-full">
      <div className="flex h-full flex-col lg:flex-row justify-around items-center lg:items-start ">
        {isMobile ? (
          <div className="w-full h-full overflow-y-scroll pb-10">
            {card && <CardInfo card={card} />}
          </div>
        ) : (
          <SplitPane
            pane2Style={{
              overflowY: "auto",
            }}
            paneStyle={{
              height: "100%",
              paddingBottom: "4em",
            }}
            key={splitKey}
            split="vertical"
            defaultSize={splitSize}
            onChange={setSplitSize}
          >
            {card ? (
              <CardInfo
                resetSplit={splitSize > 400 ? resetSplit : undefined}
                card={card}
              />
            ) : (
              <div className="flex flex-col justify-center items-center h-full">
                <div className="text-center">
                  <h1 className="text-3xl font-extrabold text-gray-900">
                    Loading Card Details...
                  </h1>
                </div>
              </div>
            )}
            <div>
              {pdfUrl ? (
                <div className="max-w-xl block overflow-y-auto">
                  {/* passing splitSize as a key forces the viewer to rerender when split is changed */}
                  <Viewer key={splitSize} fileUrl={pdfUrl} />{" "}
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
  NonNullable<CardHistoryQuery["cardHistory"]>[0]
>;

function CardHistory() {
  const cardId = useSearch<LocationGenerics>().modalState?.cardId;
  const { history } = useCardHistory(cardId);
  const queryClient = useQueryClient();
  const rollbackMutation = useRollbackCardMutation({
    onSettled: (data) => {
      const id = data?.rollbackCard?.id || "";
      queryClient.refetchQueries(useCardByIdsQuery.getKey({ ids: [id] }));
      queryClient.refetchQueries(useKanbanDataQuery.getKey());
      queryClient.refetchQueries(useCardHistoryQuery.getKey({ id }));
    },
  });
  const handleRollback = async (card: TCardHistoryCard) => {
    toast.promise(
      rollbackMutation.mutateAsync({ id: card.id, asOf: card._siteValidTime }),
      {
        success: "Card rolled back successfully",
        error: "Card rollback failed",
        pending: "Rolling back card...",
      }
    );
  };
  const data = useMemo(
    () =>
      history?.filter(notEmpty).map((card, i) => {
        const hasDescriptionChanged =
          history[i + 1] && history[i + 1]?.description !== card?.description;
        const stateChanged =
          history[i + 1] &&
          history[i + 1]?.workflowState?.name !== card?.workflowState?.name;
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
          !stateChanged &&
          !projectChanged &&
          !cvChanged &&
          !filesChanged;

        return {
          ...card,
          nothingChanged,
          hasDescriptionChanged,
          stateChanged,
          projectChanged,
          cvChanged,
          filesChanged,
          titleChanged,
          diff: [
            titleChanged && "Title changed",
            hasDescriptionChanged && "description changed",
            stateChanged && "state changed",
            projectChanged && "project changed",
            cvChanged && "cv changed",
            filesChanged && "files changed",
          ]
            .filter((s) => s)
            .join(", "),
        };
      }),
    [history]
  );

  const cols = useMemo(
    () => [
      {
        Header: "Diff",
        accessor: "diff",
      },
      {
        Header: "Title",
        accessor: "title",
        Cell: (props: CellProps<TCardHistoryCard>) => (
          <div className="text-sm truncate">{props.value || "Untitled"}</div>
        ),
      },
      {
        Header: "State",
        accessor: "workflowState.name",
      },
      {
        Header: "Project",
        accessor: "project.name",
      },
      {
        Header: "Edited By",
        accessor: "_siteSubject",
      },
      {
        Header: "Updated at",
        accessor: "_siteValidTime",
      },
      {
        Header: "Actions",
        Cell: (props: CellProps<TCardHistoryCard>) => (
          <button
            className="inline-flex justify-center items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => handleRollback(props.row.original)}
          >
            Rollback
          </button>
        ),
      },
    ],
    []
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
          <div className="flex flex-col h-full px-4 relative overflow-x-auto">
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
  const { cardModalView } = useSearch<LocationGenerics>();
  const cardId = useSearch<LocationGenerics>().modalState?.cardId;
  const { data, error } = useCardById(cardId);
  const card = data?.cardsByIds?.[0];
  const pdfLzString = card?.cvPdf?.lzbase64;
  const pdfUrl = useMemo(() => {
    const pdfBase64 = pdfLzString && uncompressBase64(pdfLzString);
    const pdfBlob = pdfBase64 && base64toBlob(pdfBase64);
    if (pdfBlob) {
      return URL.createObjectURL(pdfBlob);
    }
  }, [pdfLzString]);
  // clean up object url on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);
  const navigate = useNavigate<LocationGenerics>();
  const hasUnsaved = false; // TODO
  const onClose = () => {
    const confirmation =
      hasUnsaved &&
      confirm("You have unsaved changes. Are you sure you want to close?");
    if (!hasUnsaved || confirmation) {
      handleClose();
      if (cardModalView !== "view") {
        // delayed to stop flicker
        setTimeout(() => {
          navigate({
            search: {
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
      fullWidth={cardModalView !== "update"}
      noScroll={cardModalView === "view"}
    >
      <div className="sticky top-0 z-10 bg-white">
        <ModalTabs
          tabs={[
            { id: "view", name: "View", default: !cardModalView },
            { id: "cv", name: "CV", hidden: !pdfUrl },
            { id: "update", name: "Edit" },
            { id: "history", name: "History" },
          ]}
          navName="cardModalView"
        />
        <div className="absolute top-3 right-3 w-5 h-5 cursor-pointer">
          <XIcon onClick={onClose} />
        </div>
      </div>
      <div className="h-full">
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
        {(!cardModalView || cardModalView === "view") && (
          <CardView handleClose={onClose} />
        )}
        {cardModalView === "update" && <UpdateCardForm handleClose={onClose} />}
        {cardModalView === "history" && <CardHistory />}
        {cardModalView === "cv" && pdfUrl && (
          <div className="block mx-auto max-w-xl h-full min-h-full pb-10">
            {/* passing splitSize as a key forces the viewer to rerender when split is changed */}
            <Viewer fileUrl={pdfUrl} />{" "}
          </div>
        )}
      </div>
    </Modal>
  );
}
