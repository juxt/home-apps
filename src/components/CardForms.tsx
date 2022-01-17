import { Dispatch, SetStateAction, useEffect } from "react";
import {
  LocationGenerics,
  ModalStateProps,
  Option,
  TWorkflow,
  TCard,
} from "../types";
import { useForm } from "react-hook-form";
import { Modal, ModalForm } from "./Modal";
import {
  CardInput,
  CreateCardMutationVariables,
  UpdateCardMutationVariables,
  useAllProjectsQuery,
  useAllWorkflowStatesQuery,
  useCreateCardMutation,
  useKanbanDataQuery,
  useUpdateCardMutation,
} from "../generated/graphql";
import {
  base64FileToImage,
  defaultMutationProps,
  distinctBy,
  mapKeys,
  notEmpty,
  uncompressBase64,
} from "../kanbanHelpers";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useSearch } from "react-location";
import { Form } from "./Form";

type AddCardInput = CardInput & {
  project: Option;
};

type AddCardModalProps = ModalStateProps;

export function AddCardModal({ isOpen, setIsOpen }: AddCardModalProps) {
  const queryClient = useQueryClient();
  const addCardMutation = useCreateCardMutation({
    ...defaultMutationProps(queryClient),
  });
  const { modalState, filters } = useSearch<LocationGenerics>();
  const cols =
    useAllWorkflowStatesQuery().data?.allWorkflowStates?.filter(notEmpty) ?? [];
  const currentProject = filters?.projectId;

  const addCard = (card: AddCardInput) => {
    if (!cols.length) {
      toast.error("No workflowStates to add card to");
      return;
    }
    setIsOpen(false);
    const newId = `card-${Date.now()}`;
    const { project, ...cardInput } = card;
    toast.promise(
      addCardMutation.mutateAsync({
        cardId: newId,
        workflowStateId: cols[0].id,
        cardIds: [
          ...(cols[0].cards?.filter(notEmpty).map((c) => c.id) || []),
          newId,
        ],
        card: {
          ...cardInput,
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

  const formHooks = useForm<AddCardInput>();
  useEffect(() => {
    if (currentProject) {
      if (currentProject) {
        formHooks.setValue("project", {
          label:
            projectOptions.find((p) => p.value === currentProject)?.label ?? "",
          value: currentProject,
        });
      }
    }
  }, [currentProject]);
  const projectQuery = useAllProjectsQuery();
  const projectOptions =
    projectQuery?.data?.allProjects?.filter(notEmpty).map((p) => {
      return {
        label: p.name,
        value: p.id,
      };
    }) ?? [];
  return (
    <ModalForm<AddCardInput>
      title="Add Card"
      formHooks={formHooks}
      fields={[
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
          type: "text",
          rules: {
            required: true,
          },
          path: "title",
        },
        {
          id: "CardDescription",
          placeholder: "Card Description",
          type: "tiptap",
          path: "description",
        },
      ]}
      onSubmit={formHooks.handleSubmit(addCard, console.warn)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
}

type UpdateCardInput = UpdateCardMutationVariables & {
  project: Option;
};

type UpdateCardModalProps = ModalStateProps;

export function UpdateCardModal({ isOpen, setIsOpen }: UpdateCardModalProps) {
  const { modalState } = useSearch<LocationGenerics>();
  const workflowId = modalState?.workflowId;
  const workflowStateId = modalState?.workflowStateId;
  const cardId = modalState?.cardId;
  const queryClient = useQueryClient();
  const updateCardMutation = useUpdateCardMutation({
    ...defaultMutationProps(queryClient),
  });

  const updateCard = (input: UpdateCardInput) => {
    setIsOpen(false);
    const card = { ...input.card, projectId: input.project?.value || null };
    updateCardMutation.mutate({ card, cardId: input.cardId });
  };
  const { data: card } = useAllWorkflowStatesQuery(
    {},
    {
      select: (data) => {
        return data.allWorkflowStates
          ?.find((w) => w?.id === workflowStateId)
          ?.cards?.find((c) => c?.id === cardId);
      },
    }
  );

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
  const projectQuery = useAllProjectsQuery();
  const projectOptions =
    projectQuery?.data?.allProjects?.filter(notEmpty).map((p) => {
      return {
        label: p.name,
        value: p.id,
      };
    }) ?? [];
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div>
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
              label: "Description",
              id: "CardDescription",
              placeholder: "Card Description",
              type: "tiptap",
              path: "card.description",
            },
            {
              label: "Files",
              accept: "image/jpeg, image/png, image/gif, application/pdf",
              id: "CardFiles",
              type: "file",
              path: "card.files",
            },
          ]}
          onSubmit={formHooks.handleSubmit(updateCard, console.warn)}
        />
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          form={title}
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Submit
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
