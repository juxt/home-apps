import { useEffect } from "react";
import { LocationGenerics, ModalStateProps, Option } from "../types";
import { useForm } from "react-hook-form";
import { Modal, ModalForm } from "./Modal";
import {
  CardInput,
  CreateCardMutationVariables,
  UpdateCardMutationVariables,
  useCardByIdsQuery,
  useCreateCardMutation,
  useUpdateCardMutation,
} from "../generated/graphql";
import {
  defaultMutationProps,
  notEmpty,
  uncompressBase64,
} from "../kanbanHelpers";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useSearch } from "react-location";
import { Form } from "./Form";
import { useCardById, useProjectOptions, useWorkflowStates } from "../hooks";
import { OptionsMenu } from "./Menus";
import { ModalTabs, NavTabs } from "./Tabs";
import { PencilIcon } from "@heroicons/react/solid";

type AddCardInput = CreateCardMutationVariables & {
  project: Option;
  workflowState: Option;
};

type AddCardModalProps = ModalStateProps;

export function AddCardModal({ isOpen, setIsOpen }: AddCardModalProps) {
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
    setIsOpen(false);
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
          type: "file",
          path: "card.files",
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

type CardModalProps = ModalStateProps;

export function CardModal({ isOpen, setIsOpen }: CardModalProps) {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalTabs
        tabs={[{ id: "add", name: "Add Card", current: true }]}
        navName="cardModalView"
      />
      <UpdateCardForm handleClose={() => setIsOpen(false)} />
    </Modal>
  );
}
