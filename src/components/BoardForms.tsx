import { Dispatch, SetStateAction, useEffect } from "react";
import {
  BoardFormModalTypes,
  LocationGenerics,
  ModalStateProps,
  Option,
  TBoard,
} from "../types";
import { useForm } from "react-hook-form";
import { ModalForm } from "./Modal";
import {
  CreateBoardMutationVariables,
  UpdateBoardMutationVariables,
  useAllColumnsQuery,
  useCreateBoardMutation,
  useUpdateBoardMutation,
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
import { mapValues } from "lodash-es";

type AddBoardInput = Omit<CreateBoardMutationVariables, "columnIds"> & {
  columnIds: Option[] | undefined;
};

type AddBoardModalProps = ModalStateProps;

export function AddBoardModal({ isOpen, setIsOpen }: AddBoardModalProps) {
  const queryClient = useQueryClient();
  const addBoardMutation = useCreateBoardMutation({
    ...defaultMutationProps(queryClient),
  });

  const addBoard = (input: AddBoardInput) => {
    setIsOpen(false);
    const { columnIds, ...boardInput } = input;

    const newColumns =
      columnIds?.map((c) => {
        return {
          name: c.label,
          id: "col" + Math.random().toString(),
        };
      }) || [];
    const data = {
      ...boardInput,
      columns: newColumns,
      columnIds: newColumns?.map((c) => c.id),
    };
    toast.promise(addBoardMutation.mutateAsync(data), {
      pending: "Creating board...",
      success: "Board created!",
      error: "Error creating board",
    });
  };

  const formHooks = useForm<AddBoardInput>();
  const columnResult = useAllColumnsQuery();
  const cols =
    columnResult.data?.allColumns?.filter(notEmpty).map((c) => {
      return {
        value: c.id,
        label: c.name,
      };
    }) || [];
  const columns = distinctBy<typeof cols[0]>(cols, "label") || [];
  return (
    <ModalForm<AddBoardInput>
      title="Add Board"
      formHooks={formHooks}
      fields={[
        {
          id: "columns",
          type: "multiselect",
          options: columns,
          path: "columnIds",
          label: "Columns",
        },
        {
          id: "BoardName",
          placeholder: "Board Name",
          type: "text",
          rules: {
            required: true,
          },
          path: "name",
        },
        {
          id: "BoardDescription",
          placeholder: "Board Description",
          type: "text",
          path: "description",
        },
      ]}
      onSubmit={formHooks.handleSubmit(addBoard, console.warn)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
}

type UpdateBoardInput = Omit<UpdateBoardMutationVariables, "columnIds"> & {
  columnIds: Option[] | undefined;
};

type UpdateBoardModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function UpdateBoardModal({ isOpen, setIsOpen }: UpdateBoardModalProps) {
  const queryClient = useQueryClient();
  const updateBoardMutation = useUpdateBoardMutation({
    ...defaultMutationProps(queryClient),
  });

  const updateBoard = (input: UpdateBoardInput) => {
    setIsOpen(false);
    const { columnIds, ...boardInput } = input;
    const data = {
      ...boardInput,
    };
    updateBoardMutation.mutate(data);
  };
  const formHooks = useForm<UpdateBoardInput>();
  const { modalState } = useSearch<LocationGenerics>();
  const board = modalState?.board;
  const { columnIds, ...formVals } = formHooks.getValues();
  useEffect(() => {
    mapKeys(formVals, (key) => {
      board && formHooks.setValue(key, board[key]);
      return key;
    });
  }, [board]);
  return (
    <ModalForm<UpdateBoardInput>
      title="Update Board"
      formHooks={formHooks}
      fields={[
        {
          id: "BoardName",
          placeholder: "Board Name",
          type: "text",
          rules: {
            required: true,
          },
          path: "name",
        },
        {
          id: "BoardDescription",
          placeholder: "Board Description",
          type: "text",
          path: "description",
        },
      ]}
      onSubmit={formHooks.handleSubmit(updateBoard, console.warn)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
}
