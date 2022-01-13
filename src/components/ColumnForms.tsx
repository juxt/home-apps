import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import {
  CreateColumnMutationVariables,
  useCreateColumnMutation,
} from "../generated/graphql";
import { defaultMutationProps } from "../kanbanHelpers";
import { ModalStateProps, TBoard } from "../types";
import { ModalForm } from "./Modal";

type AddColumnInput = Omit<
  Omit<Omit<CreateColumnMutationVariables, "colId">, "columnIds">,
  "boardId"
>;

type AddColumnModalProps = ModalStateProps & {
  board: TBoard;
  cols: Array<{ id: string }>;
};

export function AddColumnModal({
  isOpen,
  setIsOpen,
  board,
  cols,
}: AddColumnModalProps) {
  const queryClient = useQueryClient();
  const addColMutation = useCreateColumnMutation({
    ...defaultMutationProps(queryClient),
  });
  const addColumn = (col: AddColumnInput) => {
    if (board) {
      setIsOpen(false);
      const colId = `col-${Date.now()}`;
      addColMutation.mutate({
        ...col,
        columnIds: [...cols.map((c) => c.id), colId],
        boardId: board.id,
        colId,
      });
    }
  };
  const formHooks = useForm<AddColumnInput>();
  return (
    <ModalForm<AddColumnInput>
      title="Add Column"
      formHooks={formHooks}
      onSubmit={formHooks.handleSubmit(addColumn, console.warn)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      fields={[
        {
          id: "name",
          path: "columnName",
          rules: {
            required: true,
          },
          label: "Column Name",
          type: "text",
        },
      ]}
    />
  );
}
