import { Dispatch, SetStateAction } from "react";
import { ModalStateProps, Option, TBoard, TCard } from "../types";
import { useForm } from "react-hook-form";
import { ModalForm } from "./Modal";
import {
  CardInput,
  CreateCardMutationVariables,
  UpdateCardMutationVariables,
  useAllColumnsQuery,
  useCreateCardMutation,
  useUpdateCardMutation,
} from "../generated/graphql";
import { defaultMutationProps, distinctBy, notEmpty } from "../kanbanHelpers";
import { useQueryClient } from "react-query";

type AddCardInput = CardInput;

type AddCardModalProps = ModalStateProps & {
  board: TBoard;
  cols: Array<{ cards: TCard[]; id: string }>;
};

export function AddCardModal({
  isOpen,
  setIsOpen,
  board,
  cols,
}: AddCardModalProps) {
  const queryClient = useQueryClient();
  const addCardMutation = useCreateCardMutation({
    ...defaultMutationProps(queryClient),
  });
  console.log(cols, board);
  if (!board?.id) return null;
  const addCard = (card: AddCardInput) => {
    if (!cols.length) return;
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
    addCardMutation.mutate({
      ...newCard,
    });
  };

  const formHooks = useForm<AddCardInput>({
    defaultValues: {
      description: "",
      boardId: board.id,
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

type UpdateCardModalProps = ModalStateProps & {
  board: TBoard;
};

export function UpdateCardModal({
  isOpen,
  setIsOpen,
  board,
}: UpdateCardModalProps) {
  if (!board) return null;
  const queryClient = useQueryClient();
  const updateCardMutation = useUpdateCardMutation({
    ...defaultMutationProps(queryClient),
  });

  const updateCard = (input: UpdateCardInput) => {
    setIsOpen(false);
    updateCardMutation.mutate(input);
  };
  const formHooks = useForm<UpdateCardInput>({
    defaultValues: { card: { boardId: board.id } },
  });

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
        },
        {
          id: "CardDescription",
          placeholder: "Card Description",
          type: "text",
          path: "card.description",
        },
      ]}
      onSubmit={formHooks.handleSubmit(updateCard, console.warn)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
}
