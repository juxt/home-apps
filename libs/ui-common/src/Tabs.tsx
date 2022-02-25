import { SearchIcon } from '@heroicons/react/solid';
import { LocationGenerics } from '@juxt-home/site';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useNavigate, useSearch } from 'react-location';
import Select from 'react-select';
import { useAsyncDebounce } from 'react-table';
import { Option, useGlobalSearch } from './Forms';

type Tab = {
  id: string;
  name: string;
  count?: number;
  default?: boolean;
  hidden?: boolean;
};

type TabProps = {
  tabs: Tab[];
  navName: keyof LocationGenerics['Search'];
};

export function NavTabs({ tabs, navName }: TabProps) {
  const options = tabs.map((tab) => ({
    value: tab.id,
    label: tab.name,
  }));

  const navigate = useNavigate<LocationGenerics>();
  const search = useSearch<LocationGenerics>();
  const currentId = search[navName];
  const currentOption: Option | undefined = options.find(
    (option) => option.value === currentId,
  );
  const onTabClick = (id?: string) => {
    navigate({
      to: '.',
      search: {
        ...search,
        [navName]: id,
      },
    });
  };

  const [searchVal, setSearchVal] = useGlobalSearch();

  return (
    <div className="mb-2">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <Select
          className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          id="tabs"
          name="tabs"
          value={currentOption}
          onChange={(e) => e && onTabClick(e.value)}
          placeholder="Select a Project"
          options={options}
        />
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav
            className="-mb-px flex space-x-8 justify-between"
            aria-label="Tabs">
            <div className="flex items-center justify-center px-2  lg:justify-start">
              <div className="max-w-lg lg:max-w-xs">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search"
                    type="search"
                    onChange={(e) => setSearchVal(e.target.value)}
                    value={searchVal}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              {tabs.map((tab) => {
                const isCurrent = tab.id === currentId;
                return (
                  <button
                    type="button"
                    key={tab.id + tab.name}
                    onClick={() => onTabClick(tab.id)}
                    className={classNames(
                      isCurrent
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                      'whitespace-nowrap cursor-pointer flex py-4 px-1 border-b-2 font-medium text-sm',
                    )}
                    aria-current={isCurrent ? 'page' : undefined}>
                    {tab.name}
                    {typeof tab.count === 'number' ? (
                      <span
                        className={classNames(
                          isCurrent
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'bg-gray-100 text-gray-900',
                          'hidden ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block',
                        )}>
                        {tab.count}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:block lg:w-60" />
          </nav>
        </div>
      </div>
    </div>
  );
}

export function ModalTabs({ tabs, navName }: TabProps) {
  const navigate = useNavigate<LocationGenerics>();
  const search = useSearch<LocationGenerics>();
  const currentId = search[navName];

  const onTabClick = (id?: string) => {
    navigate({
      to: '.',
      search: {
        ...search,
        [navName]: id,
      },
    });
  };

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8 justify-center" aria-label="Tabs">
        {tabs
          .filter((t) => !t.hidden)
          .map((tab) => {
            const isCurrent = tab.id === currentId || tab.default;
            return (
              <button
                type="button"
                key={tab.id + tab.name}
                onClick={() => onTabClick(tab.id)}
                className={classNames(
                  isCurrent
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                  'whitespace-nowrap cursor-pointer flex py-4 px-1 border-b-2 font-medium text-sm',
                )}
                aria-current={isCurrent ? 'page' : undefined}>
                {tab.name}
              </button>
            );
          })}
      </nav>
    </div>
  );
}
