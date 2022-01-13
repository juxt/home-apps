import { Dispatch, SetStateAction, useEffect } from "react";
import {
  LocationGenerics,
  ModalStateProps,
  Option,
  TBoard,
  TCard,
} from "../types";
import { useForm } from "react-hook-form";
import { ModalForm } from "./Modal";
import {
  CardInput,
  CreateCardMutationVariables,
  UpdateCardMutationVariables,
  useAllColumnsQuery,
  useCreateCardMutation,
  useKanbanDataQuery,
  useUpdateCardMutation,
} from "../generated/graphql";
import { defaultMutationProps, distinctBy, notEmpty } from "../kanbanHelpers";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useSearch } from "react-location";

type AddCardInput = CardInput;

type AddCardModalProps = ModalStateProps & {
  cols: Array<{ cards: TCard[]; id: string }>;
};

export function AddCardModal({ isOpen, setIsOpen, cols }: AddCardModalProps) {
  const queryClient = useQueryClient();
  const addCardMutation = useCreateCardMutation({
    ...defaultMutationProps(queryClient),
  });
  const { modalState } = useSearch<LocationGenerics>();
  const boardId = modalState?.boardId;

  const addCard = (card: AddCardInput) => {
    if (!cols.length) {
      toast.error("No columns to add card to");
      return;
    }
    setIsOpen(false);
    const newId = `card-${Date.now()}`;
    const newCard = {
      cardId: newId,
      columnId: cols[0].id,
      cardIds: [...cols[0].cards.map((c) => c.id), newId],
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
      boardId: boardId,
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
          type: "text",
          path: "description",
        },
      ]}
      onSubmit={formHooks.handleSubmit(addCard, console.warn)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
}

type UpdateCardInput = UpdateCardMutationVariables;

type UpdateCardModalProps = ModalStateProps;

export function UpdateCardModal({ isOpen, setIsOpen }: UpdateCardModalProps) {
  const { modalState } = useSearch<LocationGenerics>();
  const boardId = modalState?.boardId;
  const queryClient = useQueryClient();
  const updateCardMutation = useUpdateCardMutation({
    ...defaultMutationProps(queryClient),
  });

  const updateCard = (input: UpdateCardInput) => {
    setIsOpen(false);
    updateCardMutation.mutate(input);
  };
  const card = modalState?.card;

  const formHooks = useForm<UpdateCardInput>({
    defaultValues: { card: { ...card, boardId: boardId }, cardId: card?.id },
  });

  useEffect(() => {
    if (card) {
      formHooks.setValue("card", { ...card, boardId: boardId });
    }
  }, [card]);

  return (
    <ModalForm<UpdateCardInput>
      title="Update Card"
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
          label: "Description",
          id: "CardDescription",
          placeholder: "Card Description",
          type: "tiptap",
          path: "card.description",
        },
      ]}
      onSubmit={formHooks.handleSubmit(updateCard, console.warn)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
}
