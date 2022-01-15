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
  defaultMutationProps,
  distinctBy,
  mapKeys,
  notEmpty,
} from "../kanbanHelpers";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useSearch } from "react-location";
import { Form } from "./Form";

type AddCardInput = CardInput;

type AddCardModalProps = ModalStateProps;

export function AddCardModal({ isOpen, setIsOpen }: AddCardModalProps) {
  const queryClient = useQueryClient();
  const addCardMutation = useCreateCardMutation({
    ...defaultMutationProps(queryClient),
  });
  const { modalState } = useSearch<LocationGenerics>();
  const workflow = modalState?.workflow;
  const workflowId = workflow?.id;
  const cols = workflow?.workflowStates.filter(notEmpty) ?? [];

  const addCard = (card: AddCardInput) => {
    if (!cols.length) {
      toast.error("No workflowStates to add card to");
      return;
    }
    setIsOpen(false);
    const newId = `card-${Date.now()}`;
    const newCard = {
      cardId: newId,
      workflowStateId: cols[0].id,
      cardIds: [
        ...(cols[0].cards?.filter(notEmpty).map((c) => c.id) || []),
        newId,
      ],
      card: {
        ...card,
        id: newId,
      },
    };
    toast.promise(
      addCardMutation.mutateAsync({
        ...newCard,
      }),
      {
        pending: "Creating card...",
        success: "Card created!",
        error: "Error creating card",
      }
    );
  };

  const formHooks = useForm<AddCardInput>({
    defaultValues: {
      description: "",
      workflowId: workflowId,
    },
  });
  return (
    <ModalForm<AddCardInput>
      title="Add Card"
      formHooks={formHooks}
      fields={[
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
  const workflow = modalState?.workflow;
  const workflowId = workflow?.id;
  const queryClient = useQueryClient();
  const updateCardMutation = useUpdateCardMutation({
    ...defaultMutationProps(queryClient),
  });

  const updateCard = (input: UpdateCardInput) => {
    setIsOpen(false);
    console.log(input);

    const card = { ...input.card, projectId: input.project?.value || null };
    updateCardMutation.mutate({ card, cardId: input.cardId });
  };
  const card = modalState?.card;

  const formHooks = useForm<UpdateCardInput>({
    defaultValues: {
      card: { ...card, workflowId: workflowId },
      cardId: card?.id,
    },
  });

  useEffect(() => {
    if (card) {
      const projectId = card.project?.id;
      const cardInput = {
        ...card,
      };
      formHooks.setValue("card", { ...card, workflowId: workflowId });
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
              path: "card.title",
              label: "Name",
            },
            {
              label: "Description",
              id: "CardDescription",
              placeholder: "Card Description",
              type: "tiptap",
              path: "card.description",
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
