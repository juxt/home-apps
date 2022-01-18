import { Dialog } from "@headlessui/react";
import Dropzone, { FileRejection } from "react-dropzone";
import { MenuOption, OptionsMenu } from "./Menus";
import React, { useCallback, useMemo } from "react";
import { Controller, FieldValues } from "react-hook-form";
import { MultiSelect } from "react-multi-select-component";
import Select, { GroupBase, Props as SelectProps } from "react-select";
import { DownloadIcon, TrashIcon } from "@heroicons/react/solid";

import { FormInputField, FormProps, Option } from "../types";
import { Tiptap } from "./Tiptap";
import classNames from "classnames";
import {
  notEmpty,
  fileToString,
  base64FileToImage,
  downloadFile,
  uncompressBase64,
} from "../kanbanHelpers";
import { toast } from "react-toastify";
import { CardByIdsQuery, CardFieldsFragment } from "../generated/graphql";

const inputClass =
  "relative inline-flex w-full rounded leading-none transition-colors ease-in-out placeholder-gray-500 text-gray-700 bg-gray-50 border border-gray-300 hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-blue-400 focus:ring-4 focus:ring-opacity-30 p-3 text-base";

function CustomSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: SelectProps<Option, IsMulti, Group>) {
  return <Select {...props} />;
}

function ImagePreview({ image, title }: { image: string; title: string }) {
  return (
    <li className="block p-1 w-2/3 h-24 isolate">
      <article className="group hasImage w-full h-full rounded-md focus:outline-none focus:shadow-outline bg-gray-100 relative text-transparent hover:text-black shadow-sm">
        <img
          alt="upload preview"
          className="w-full h-full sticky object-cover rounded-md bg-fixed group-hover:opacity-30"
          src={image}
        />

        <section className="flex flex-col justify-between rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
          <h1 className="truncate hover:overflow-visible">{title}</h1>
        </section>
      </article>
    </li>
  );
}

type TFile = NonNullable<
  NonNullable<NonNullable<CardByIdsQuery["cardsByIds"]>[0]>["files"]
>[0] & {
  preview: string;
};

function FilePreview({
  file,
  handleDelete,
}: {
  file: NonNullable<TFile>;
  handleDelete: () => void;
}) {
  if (!file) return <div>No file</div>;

  const data = useMemo(() => uncompressBase64(file.lzbase64), [file.lzbase64]);
  const options = [
    {
      label: (
        <div className="flex items-center">
          <TrashIcon className="w-3 h-3 mr-2" /> Delete
        </div>
      ),
      id: "delete",
      props: {
        onClick: handleDelete,
      },
    },
    {
      label: (
        <div className="flex items-center">
          <DownloadIcon className="w-3 h-3 mr-2" /> Download
        </div>
      ),
      id: "download",
      props: {
        href: data,
        download: file.name,
      },
    },
  ];

  return (
    <div className="flex flex-row justify-between">
      {file.type.startsWith("image") ? (
        <ImagePreview title={file.name} image={data} />
      ) : (
        <div>
          <p>Type: {file.type}</p>
          <h1 className="truncate">{file.name}</h1>
        </div>
      )}
      <OptionsMenu options={options} />
    </div>
  );
}

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
    case "file":
      return (
        <Controller
          render={(controlProps) => {
            const { onChange, value } = controlProps.field;
            const files: TFile[] | undefined =
              Array.isArray(value) && value.filter(notEmpty).length > 0
                ? value.filter(notEmpty)
                : undefined;
            const handleDelete = (file: TFile) => {
              const newValue = files?.filter((f) => f !== file);
              file?.preview && URL.revokeObjectURL(file.preview);
              onChange(newValue);
            };

            const handleDrop = async (
              acceptedFiles: File[],
              fileRejections: FileRejection[]
            ) => {
              fileRejections.map((rejection) => {
                toast.error(
                  `Couldn't upload file ${
                    rejection.file.name
                  }. ${rejection.errors.map((e) => e.message).join(", ")}`
                );
              });
              acceptedFiles.filter(notEmpty).map(async (f) => {
                const lzbase64 = await fileToString(f);
                const isImage = f.type.startsWith("image");
                const newFile = {
                  name: f.name,
                  type: f.type,
                  preview: isImage && (await base64FileToImage(f)),
                  lzbase64,
                };

                const newValue = [...(files || []), newFile];
                onChange(newValue);
              });
            };

            return (
              <Dropzone
                onDrop={handleDrop}
                accept={field.accept}
                multiple
                maxSize={5000000}
              >
                {({
                  getRootProps,
                  getInputProps,
                  isDragAccept,
                  isDragActive,
                  isDragReject,
                }) => {
                  return (
                    <section>
                      <div {...getRootProps()}>
                        <div
                          className={classNames(
                            "max-w-lg flex justify-center cursor-pointer px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md",
                            isDragActive && "border-blue-500",
                            isDragAccept && "border-green-500 cursor-copy",
                            isDragReject && "border-red-500 cursor-no-drop"
                          )}
                        >
                          <div className="space-y-1 text-center">
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                              >
                                <input {...getInputProps()} />
                                <p>
                                  Drag 'n' drop some files here, or click to
                                  select files
                                </p>
                              </label>
                            </div>
                            <p className="text-xs text-gray-500">
                              PDF, PNG, JPG, GIF up to 5MB
                            </p>
                          </div>
                        </div>
                      </div>
                      {files && (
                        <div className="pt-2 text-gray-800 text-sm">
                          {files.length} files selected
                          {files.filter(notEmpty).map((file, i) => (
                            <div key={file.name + i} className="pt-2 mt-2">
                              <FilePreview
                                file={file}
                                handleDelete={() => handleDelete(file)}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  );
                }}
              </Dropzone>
            );
          }}
          name={field.path}
          control={control}
          rules={field.rules}
        />
      );
    case "select":
      return (
        <Controller
          name={field.path}
          control={control}
          render={(controlProps) => {
            let { value, onChange, name } = controlProps.field;

            return (
              <CustomSelect
                {...controlProps}
                options={field.options}
                onChange={(selected) => {
                  onChange(selected);
                }}
                value={value}
                name={name}
              />
            );
          }}
        />
      );
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
      return <textarea {...defaultProps} {...field} className={inputClass} />;
    case "tiptap":
      return (
        <Controller
          name={field.path}
          control={control}
          render={(controlProps) => {
            let { value, onChange, name } = controlProps.field;
            return (
              <Tiptap
                onChange={onChange}
                content={value as string}
                withTaskListExtension={true}
                withLinkExtension={true}
                withTypographyExtension={true}
                withPlaceholderExtension={true}
                withMentionSuggestion={true}
                {...field}
              />
            );
          }}
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
