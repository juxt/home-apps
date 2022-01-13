import { Dialog } from "@headlessui/react";
import React from "react";
import { Controller, FieldValues } from "react-hook-form";
import { MultiSelect } from "react-multi-select-component";

import { Option } from "react-multi-select-component/dist/types/lib/interfaces";
import { FormInputField, FormProps, ModalFormProps } from "../types";

const inputClass =
  "relative inline-flex w-full rounded leading-none transition-colors ease-in-out placeholder-gray-500 text-gray-700 bg-gray-50 border border-gray-300 hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-blue-400 focus:ring-4 focus:ring-opacity-30 p-3 text-base";

export function RenderField<T>({
  field,
  props,
}: {
  field: FormInputField<T>;
  props: FormProps<T>;
}) {
  const { control, register } = props.formHooks;
  const registerProps = register(field.path, field.rules);
  const defaultProps = {
    ...registerProps,
    className: inputClass,
    type: field.type,
  };
  switch (field.type) {
    case "text":
      return <input {...defaultProps} />;
    case "number":
      return <input {...defaultProps} />;
    case "checkbox":
      return <input {...defaultProps} checked={!!field.value} />;
    case "multiselect":
      return (
        <Controller
          name={field.path}
          control={control}
          render={(controlProps) => {
            let { value, onChange, name } = controlProps.field;
            return (
              <MultiSelect
                onChange={onChange}
                value={(value as Option[]) || []}
                valueRenderer={(selected) => {
                  return selected.map((option) => option.label).join(", ");
                }}
                options={field.options}
                labelledBy={name}
              />
            );
          }}
        />
      );
    case "textarea":
      return (
        <textarea
          {...defaultProps}
          rows={3}
          className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
        />
      );
    case "hidden":
      return <input {...defaultProps} type="hidden" />;
    default:
      return null;
  }
}

export function Label(text: string) {
  return (
    <label
      htmlFor="about"
      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
    >
      {text}
    </label>
  );
}

export function Error(props: { text: string }) {
  return (
    <div className="mt-2 sm:mt-0 sm:col-span-2">
      <p className="text-red-600 text-sm sm:text-xs">{props.text}</p>
    </div>
  );
}

export function Form<T extends FieldValues = FieldValues>(props: FormProps<T>) {
  const { fields, formHooks, title, id, description, onSubmit } = props;
  const {
    formState: { errors },
  } = formHooks;
  return (
    <form id={id || title} onSubmit={onSubmit}>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mt-3 text-center sm:mt-0 sm:text-left">
            <Dialog.Title
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900"
            >
              {title}
            </Dialog.Title>
            {description && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div>
            <div>
              {description && (
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {description}
                </p>
              )}
            </div>

            <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
              {fields
                ?.filter((field) => field.type === "hidden")
                .map((field) => (
                  <RenderField key={field.path} field={field} props={props} />
                ))}
              {fields
                ?.filter((field) => field.type !== "hidden")
                .map((field) => {
                  const label = field?.label || field.path;
                  return (
                    <div
                      key={field.id}
                      className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                    >
                      <label
                        htmlFor={label}
                        className="block capitalize text-sm font-medium text-gray-700 sm:mt-px"
                      >
                        {label}
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <RenderField field={field} props={props} />
                      </div>
                      {errors && (
                        <p className="text-red-500">
                          {errors[field.path]?.type}
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
