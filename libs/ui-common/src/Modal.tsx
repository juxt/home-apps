/* eslint-disable react/destructuring-assignment */
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Form, ModalFormProps } from './Forms';
import classNames from 'classnames';
import { ModalStateProps } from './types';

export function ModalContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">{children}</div>
  );
}

export function ModalHeader({
  title,
  description,
}: {
  description?: string;
  title: string;
}) {
  return (
    <div className="sm:flex sm:items-start">
      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <Dialog.Title
          as="h3"
          className="text-lg leading-6 font-medium text-gray-900">
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
  isOpen,
  handleClose,
  fullWidth,
  noScroll,
  className,
  children,
}: ModalStateProps & {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  noScroll?: boolean;
}) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={classNames(
          'fixed z-10 inset-0',
          !noScroll && 'overflow-y-auto',
        )}
        onClose={handleClose}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:py-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Dialog.Overlay className="fixed isolate inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div
              className={classNames(
                'relative w-full inline-block align-bottom',
                'bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all',
                ' sm:align-middle sm:w-full h-screen-90 ',
                !noScroll && 'overflow-y-auto',
                !fullWidth && 'sm:max-w-4xl',
                className,
              )}>
              <div className="h-full z-50 flex flex-col justify-between">
                {children}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export function ModalForm<T>(props: ModalFormProps<T>) {
  return (
    <Modal {...props}>
      <Form {...props} onSubmit={props.onSubmit} />
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          form={props?.id || props.title}
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
          Submit
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={props.handleClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}
