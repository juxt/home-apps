import { Dispatch, SetStateAction } from "react";
import { BoardFormModalTypes, ModalStateProps, Option, TBoard } from "../types";
import { useForm } from "react-hook-form";
import { ModalForm } from "./Modal";
import {
  CreateBoardMutationVariables,
  UpdateBoardMutationVariables,
  useAllColumnsQuery,
  useCreateBoardMutation,
  useUpdateBoardMutation,
} from "../generated/graphql";
import { defaultMutationProps, distinctBy, notEmpty } from "../kanbanHelpers";
import { useQueryClient } from "react-query";

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
    addBoardMutation.mutate(data);
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
  setIsOpen: Dispatch<SetStateAction<BoardFormModalTypes>>;
  board: TBoard;
};

export function UpdateBoardModal({
  isOpen,
  setIsOpen,
  board,
}: UpdateBoardModalProps) {
  const queryClient = useQueryClient();
  const updateBoardMutation = useUpdateBoardMutation({
    ...defaultMutationProps(queryClient),
  });

  const updateBoard = (input: UpdateBoardInput) => {
    setIsOpen(null);
    const { columnIds, ...boardInput } = input;
    const data = {
      ...boardInput,
    };
    updateBoardMutation.mutate(data);
  };
  const formHooks = useForm<UpdateBoardInput>({
    defaultValues: { ...board },
  });

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
