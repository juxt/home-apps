import {FieldPath, RegisterOptions, UseFormReturn} from 'react-hook-form';
import {MakeGenerics} from 'react-location';
import {
  KanbanDataQuery,
  CardFieldsFragment,
  WorkflowStateFieldsFragment,
} from './generated/graphql';
import {TiptapProps} from './components/Tiptap';
import {DropzoneProps} from 'react-dropzone';
import {BaseSyntheticEvent, ReactNode} from 'react';

export type TWorkflows = NonNullable<KanbanDataQuery['allWorkflows']>;
export type TWorkflow = TWorkflows[0];
export type TCard = CardFieldsFragment;
export type TWorkflowState = WorkflowStateFieldsFragment;

export type Option = {
  value: string;
  label: string;
  key?: string;
  disabled?: boolean;
};
export type ISelectProps = {
  options: Option[];
  value: Option[];
  onChange?: (value: Option[]) => void;
  valueRenderer?: (selected: Option[], options: Option[]) => ReactNode;
  ItemRenderer?: (option: Option) => ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  disableSearch?: boolean;
  shouldToggleOnHover?: boolean;
  hasSelectAll?: boolean;
  filterOptions?: (
    options: Option[],
    filter: string
  ) => Promise<Option[]> | Option[];
  overrideStrings?: {[key: string]: string};
  labelledBy: string;
  className?: string;
  onMenuToggle?: () => void;
  ClearIcon?: ReactNode;
  debounceDuration?: number;
  ClearSelectedIcon?: ReactNode;
  defaultIsOpen?: boolean;
  isOpen?: boolean;
  isCreatable?: boolean;
  onCreateOption?: (option: Option) => void;
};

type WithIdAndType<
  T extends
    | 'text'
    | 'number'
    | 'checkbox'
    | 'textarea'
    | 'submit'
    | 'file'
    | 'multifile'
    | 'select'
    | 'multiselect'
    | 'tiptap'
    | 'hidden'
> = {
  id: string;
  type: T;
};

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type TextInputProps = InputProps & {
  type: 'text';
  value?: string;
};
type HiddenInputProps = InputProps & {
  type: 'hidden';
  value: string;
};
type FileInputProps = InputProps &
  DropzoneProps & {
    type: 'file';
  };
type MultiFileInputProps = InputProps &
  DropzoneProps & {
    type: 'multifile';
  };
type NumberInputProps = InputProps & {
  type: 'number';
  value?: number;
};
type CheckboxProps = InputProps & {
  type: 'checkbox';
  value?: boolean;
};
type SubmitProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  type: 'submit';
};
type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  type: 'textarea';
  value?: string;
};
type SelectProps = {
  type: 'select';
  options: Option[];
  default?: string;
};

export type TextInputDefinition = TextInputProps & WithIdAndType<'text'>;

export type HiddenInputDefinition = HiddenInputProps & WithIdAndType<'hidden'>;

export type FileInputDefinition = FileInputProps & WithIdAndType<'file'>;

export type MultiFileInputDefinition = MultiFileInputProps &
  WithIdAndType<'multifile'>;

export type NumberInputDefinition = NumberInputProps & WithIdAndType<'number'>;

export type CheckboxInputDefinition = CheckboxProps & WithIdAndType<'checkbox'>;

export type TextAreaInputDefinition = TextAreaProps & WithIdAndType<'textarea'>;

export type TiptapDefinition = Omit<TiptapProps, 'onChange'> &
  WithIdAndType<'tiptap'>;

export type SelectInputDefinition = SelectProps & WithIdAndType<'select'>;

export type MultiSelectDefinition = {
  options: Option[];
} & Omit<ISelectProps, 'labelledBy' | 'value'> &
  WithIdAndType<'multiselect'>;

export type SubmitButtonProps = SubmitProps & WithIdAndType<'submit'>;

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
  | FileInputDefinition
  | MultiFileInputDefinition
  | TextAreaInputDefinition
  | SelectInputDefinition
  | MultiSelectDefinition
  | TiptapDefinition
);

export type FormProps<T> = {
  fields?: FormInputField<T>[];
  id?: string;
  handleDelete?: () => void;
  formHooks: UseFormReturn<T, object>;
  title?: string;
  description?: string;
  onSubmit: (e: BaseSyntheticEvent) => void;
};

export type WorkflowFormModalTypes =
  | 'addCard'
  | 'addProject'
  | 'addWorkflowState'
  | 'addWorkflow'
  | 'editProject'
  | 'editWorkflowState'
  | 'editCard'
  | null
  | false
  | undefined;

export type LocationGenerics = MakeGenerics<{
  Search: {
    modalState: {
      formModalType: WorkflowFormModalTypes;
      projectId?: string;
      workflowId?: string;
      workflowStateId?: string;
      cardId?: string;
    };
    workflowProjectId?: string;
    cardModalView?: string;
    view?: 'card' | 'table';
    filters?: {
      [key: string]: string;
    };
    showDetails?: boolean;
    devMode?: boolean;
  };
}>;

export type ModalStateProps = {
  isOpen: boolean;
  handleClose: () => void;
};

export type ModalFormProps<T> = FormProps<T> & ModalStateProps;
