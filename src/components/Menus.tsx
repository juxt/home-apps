import { Fragment, ReactElement } from "react";
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { DotsVerticalIcon } from "@heroicons/react/solid";

export type MenuOption = {
  label: string | ReactElement;
  props: React.HTMLProps<HTMLAnchorElement>;
  id: string;
};

type OptionsProps = {
  options: MenuOption[];
};

export function OptionsMenu({ options }: OptionsProps) {
  return (
    <Menu as="div" className="relative flex-shrink-0 pr-2">
      <Menu.Button className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <span className="sr-only">Open options</span>
        <DotsVerticalIcon className="w-5 h-5" aria-hidden="true" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="z-10 mx-3 origin-top-right absolute right-10 top-3 w-48 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none">
          {options.map(({ label, props, id }) => (
            <div key={id} className="py-1 cursor-pointer">
              <Menu.Item>
                {({ active }) => (
                  <a
                    {...props}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm",
                      props?.className && props.className
                    )}
                  >
                    {label}
                  </a>
                )}
              </Menu.Item>
            </div>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
