/* This example requires Tailwind CSS v2.0+ */
import { Dispatch, Fragment, SetStateAction, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import { Form } from "./Form";
import { ModalFormProps } from "../types";
import { useForm } from "react-hook-form";

export function ModalContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">{children}</div>
  );
}

export function ModalHeader({
  title,
  description,
  onClose,
}: {
  onClose: Dispatch<SetStateAction<boolean>>;
  description?: string;
  title: string;
}) {
  return (
    <div className="sm:flex sm:items-start">
      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
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
  );
}

export function ModalBody({ children }: { children: React.ReactNode }) {
  return <div className="m-2 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">{children}</div>;
}

export function Modal({
  open,
  setOpen,
  children,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export function ModalForm<T>(props: ModalFormProps<T>) {
  const { setIsOpen } = props;

  return (
    <Modal open={props.isOpen} setOpen={setIsOpen}>
      <Form {...props} onSubmit={props.onSubmit} />
    </Modal>
  );
}
