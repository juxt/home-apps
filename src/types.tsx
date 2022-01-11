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
import { ISelectProps } from "react-multi-select-component/dist/types/lib/interfaces";
import { KanbanDataQuery, Column as TColumn } from "./generated/graphql";

declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export type TBoards = NonNullable<KanbanDataQuery["allBoards"]>;
export type TBoard = TBoards[0];
export type TCard = NonNullable<TColumn["cards"][0]>;

type WithIdAndType<
  T extends
    | "text"
    | "number"
    | "checkbox"
    | "textarea"
    | "submit"
    | "multiselect"
> = {
  id: string;
  type: T;
};

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type TextInputProps = InputProps & {
  type: "text";
  value?: string;
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

export type NumberInputDefinition = NumberInputProps & WithIdAndType<"number">;

export type CheckboxInputDefinition = CheckboxProps & WithIdAndType<"checkbox">;

export type TextAreaInputDefinition = TextAreaProps & WithIdAndType<"textarea">;

export type MultiSelectDefinition = {
  options: {
    value: string;
    label: string;
  }[];
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
  | NumberInputDefinition
  | CheckboxInputDefinition
  | TextAreaInputDefinition
  | MultiSelectDefinition
);

export type FormProps<T> = {
  fields?: FormInputField<T>[];
  formHooks: UseFormReturn<T, object>;
  onSubmit: () => void;
};

export type ModalProps<T> = FormProps<T> & {
  title?: string;
  description?: string;
  isOpen: boolean;
};

export type ModalFormProps<T> = ModalProps<T> & {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
