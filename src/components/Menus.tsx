//@ts-nocheck
import { Fragment, ReactElement } from "react";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";

export type MenuOption = {
  label: string | ReactElement;
  props: React.HTMLProps<HTMLButtonElement>;
  ActiveIcon: (props: React.HTMLAttributes<HTMLOrSVGElement>) => ReactElement;
  Icon: (props: React.HTMLAttributes<HTMLOrSVGElement>) => ReactElement;
  id: string;
};

type OptionsProps = {
  options: MenuOption[];
};

export function OptionsMenu({ options }: OptionsProps) {
  return (
    <Menu as="div" className="relative flex-shrink-0 pr-2">
      <Menu.Button className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
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
          {options.map(({ label, props, id, Icon, ActiveIcon }) => (
            <div key={id} className="py-1 cursor-pointer">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-violet-500 text-white" : "text-gray-900"
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    {...props}
                    type="button"
                  >
                    {active && (
                      <ActiveIcon
                        className="w-5 h-5 text-violet-300 mr-2"
                        aria-hidden
                      />
                    )}
                    {!active && (
                      <Icon
                        className="w-5 h-5 text-violet-500 mr-2"
                        aria-hidden
                      />
                    )}
                    {label}
                  </button>
                )}
              </Menu.Item>
            </div>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
