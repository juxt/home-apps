import {
  Control,
  DeepMap,
  FieldError,
  FieldErrors,
  FieldPath,
  FormState,
  Path,
  RegisterOptions,
  SubmitHandler,
  UseFormRegister,
  UseFormReturn,
} from "react-hook-form";
import { MakeGenerics } from "react-location";
import { ISelectProps } from "react-multi-select-component/dist/types/lib/interfaces";
import {
  KanbanDataQuery,
  CardFieldsFragment,
  ColumnFieldsFragment,
} from "./generated/graphql";
import { TiptapProps } from "./components/Tiptap";

declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export type TBoards = NonNullable<KanbanDataQuery["allBoards"]>;
export type TBoard = TBoards[0];
export type TCard = CardFieldsFragment;
export type TColumn = ColumnFieldsFragment;

type WithIdAndType<
  T extends
    | "text"
    | "number"
    | "checkbox"
    | "textarea"
    | "submit"
    | "multiselect"
    | "tiptap"
    | "hidden"
> = {
  id: string;
  type: T;
};

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type TextInputProps = InputProps & {
  type: "text";
  value?: string;
};
type HiddenInputProps = InputProps & {
  type: "hidden";
  value: string;
};
type NumberInputProps = InputProps & {
  type: "number";
  value?: number;
};
type CheckboxProps = InputProps & {
  type: "checkbox";
  value?: boolean;
};
type SubmitProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  type: "submit";
};
type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  value?: string;
};

export type TextInputDefinition = TextInputProps & WithIdAndType<"text">;

export type HiddenInputDefinition = HiddenInputProps & WithIdAndType<"hidden">;

export type NumberInputDefinition = NumberInputProps & WithIdAndType<"number">;

export type CheckboxInputDefinition = CheckboxProps & WithIdAndType<"checkbox">;

export type TextAreaInputDefinition = TextAreaProps & WithIdAndType<"textarea">;

export type TiptapDefinition = Omit<TiptapProps, "onChange"> &
  WithIdAndType<"tiptap">;

export type Option = {
  value: string;
  label: string;
  key?: string;
  disabled?: boolean;
};

export type MultiSelectDefinition = {
  options: Option[];
} & Omit<Omit<ISelectProps, "labelledBy">, "value"> &
  WithIdAndType<"multiselect">;

export type SubmitButtonProps = SubmitProps & WithIdAndType<"submit">;

export type FormInputField<T> = {
  path: FieldPath<T>;
  label?: string;
  required?: boolean;
  rules?: RegisterOptions;
} & (
  | TextInputDefinition
  | HiddenInputDefinition
  | NumberInputDefinition
  | CheckboxInputDefinition
  | TextAreaInputDefinition
  | MultiSelectDefinition
  | TiptapDefinition
);

export type FormProps<T> = {
  fields?: FormInputField<T>[];
  id?: string;
  formHooks: UseFormReturn<T, object>;
  title?: string;
  description?: string;
  onSubmit: () => void;
};

export type BoardFormModalTypes =
  | "addCard"
  | "addColumn"
  | "editBoard"
  | "addBoard"
  | "editColumn"
  | "editCard"
  | null
  | false
  | undefined;

export type LocationGenerics = MakeGenerics<{
  Search: {
    modalState: {
      formModalType: BoardFormModalTypes;
      boardId?: string;
      column?: ColumnFieldsFragment;
      card?: CardFieldsFragment;
    };
  };
}>;

export type ModalStateProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export type ModalFormProps<T> = FormProps<T> & ModalStateProps;
