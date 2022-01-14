import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearch } from "react-location";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
  CreateColumnMutationVariables,
  UpdateColumnMutationVariables,
  useCreateColumnMutation,
  useUpdateColumnMutation,
} from "../generated/graphql";
import { defaultMutationProps, mapKeys, notEmpty } from "../kanbanHelpers";
import { LocationGenerics, ModalStateProps, TBoard } from "../types";
import { ModalForm } from "./Modal";

type AddColumnInput = Omit<
  Omit<Omit<CreateColumnMutationVariables, "colId">, "columnIds">,
  "boardId"
>;

type AddColumnModalProps = ModalStateProps;

export function AddColumnModal({ isOpen, setIsOpen }: AddColumnModalProps) {
  const queryClient = useQueryClient();
  const addColMutation = useCreateColumnMutation({
    ...defaultMutationProps(queryClient),
  });
  const { modalState } = useSearch<LocationGenerics>();
  const board = modalState?.board;
  const cols = board?.columns.filter(notEmpty) ?? [];
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

type UpdateColumnInput = Omit<
  Omit<Omit<UpdateColumnMutationVariables, "colId">, "columnIds">,
  "boardId"
>;

type UpdateColumnModalProps = ModalStateProps;

export function UpdateColumnModal({
  isOpen,
  setIsOpen,
}: UpdateColumnModalProps) {
  const queryClient = useQueryClient();
  const updateColMutation = useUpdateColumnMutation({
    ...defaultMutationProps(queryClient),
  });
  const { modalState } = useSearch<LocationGenerics>();
  const column = modalState?.column;
  const colId = column?.id;

  const updateColumn = (col: UpdateColumnInput) => {
    if (colId) {
      setIsOpen(false);
      updateColMutation.mutate({
        ...col,
        colId,
      });
    }
  };
  const formHooks = useForm<UpdateColumnInput>();
  const formVals = formHooks.getValues();
  useEffect(() => {
    mapKeys(formVals, (key) => {
      column && formHooks.setValue(key, column[key]);
      return key;
    });
  }, [column]);
  return (
    <ModalForm<UpdateColumnInput>
      title="Update Column"
      formHooks={formHooks}
      onSubmit={formHooks.handleSubmit(updateColumn, console.warn)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      fields={[
        {
          id: "name",
          path: "name",
          rules: {
            required: true,
          },
          label: "Column Name",
          type: "text",
        },
        {
          id: "description",
          path: "description",
          label: "Description",
          type: "text",
        },
      ]}
    />
  );
}
