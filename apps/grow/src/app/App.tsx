import './App.css';
import {
  useUser,
  juxters,
  UpsertGrowResourceMutationVariables,
  useDeleteGrowResourceMutation,
  useUpsertGrowResourceMutation,
} from '@juxt-home/site';
import { notEmpty } from '@juxt-home/utils';
import { useEffect, useState } from 'react';
import splitbee from '@splitbee/web';
import {
  Button,
  DeleteActiveIcon,
  ModalForm,
  Option,
  ModalStateProps,
  TipTapContent,
} from '@juxt-home/ui-common';
import { useQueryClient, UseQueryResult } from 'react-query';
import { useForm } from 'react-hook-form';
import { Fragment } from 'react';
import { Menu, Popover, Transition } from '@headlessui/react';
import {
  ChatAltIcon,
  CodeIcon,
  DotsVerticalIcon,
  EyeIcon,
  FlagIcon,
  PlusSmIcon,
  SearchIcon,
  TrashIcon,
  ShareIcon,
  StarIcon,
  ThumbUpIcon,
} from '@heroicons/react/solid';
import {
  BellIcon,
  FireIcon,
  HomeIcon,
  MenuIcon,
  TrendingUpIcon,
  UserGroupIcon,
  XIcon,
} from '@heroicons/react/outline';
import classNames from 'classnames';
import {
  AllGrowResourcesQuery,
  AllGrowTagsQuery,
  useAllGrowResourcesQuery,
  useAllGrowTagsQuery,
} from '@juxt-home/site-public';
import { useGrowTags } from '../hooks';

type AddGrowResourceInput =
  UpsertGrowResourceMutationVariables['growResource'] & {
    categoryOption?: Option;
    tagOptions?: Option[];
  };

const categories = [
  {
    label: 'Book',
    value: 'BOOK',
  },
  {
    label: 'Video',
    value: 'VIDEO',
  },
  {
    label: 'Article',
    value: 'ARTICLE',
  },
  {
    label: 'Game',
    value: 'GAME',
  },
  {
    label: 'Other',
    value: 'OTHER',
  },
];

export function AddGrowResourcesModal({
  isOpen,
  handleClose,
}: ModalStateProps) {
  const queryClient = useQueryClient();
  const addResourceMutation = useUpsertGrowResourceMutation({
    onSuccess: (data) => {
      splitbee.track('Add Grow Resource', {
        data: JSON.stringify(data),
      });
      queryClient.refetchQueries('allGrowResources');
    },
  });
  const user = useUser();

  const addResource = (resource: AddGrowResourceInput) => {
    const { categoryOption, tagOptions, ...rest } = resource;
    if (resource?.name) {
      handleClose();
      const id = `growResource-${user.id}-${rest.name}-${categoryOption?.value}`;
      addResourceMutation.mutate({
        growResource: {
          id,
          ...rest,
          tagIds: tagOptions?.map((tag) => tag.value),
          category: categoryOption?.value || 'OTHER',
        },
      });
    }
  };

  const [tagOptions, addTag] = useGrowTags();

  const formHooks = useForm<AddGrowResourceInput>();
  return (
    <ModalForm<AddGrowResourceInput>
      title="Add new Resource"
      formHooks={formHooks}
      onSubmit={formHooks.handleSubmit(addResource, console.warn)}
      isOpen={isOpen}
      handleClose={handleClose}
      fields={[
        {
          id: 'name',
          path: 'name',
          rules: {
            required: true,
          },
          label: 'Title',
          type: 'text',
        },
        {
          id: 'description',
          path: 'description',
          label: 'Subtitle',
          type: 'text',
        },
        {
          id: 'descRich',
          path: 'descriptionHTML',
          placeholder: 'Write a description, images and markdown supported',
          label: 'Description',
          type: 'tiptap',
        },
        {
          id: 'url',
          path: 'url',
          label: 'URL',
          type: 'text',
        },
        {
          id: 'foo',
          path: 'foo',
          label: 'Foo',
          type: 'text',
        },
        {
          id: 'category',
          path: 'categoryOption',
          label: 'Category',
          type: 'select',
          options: categories,
        },
        {
          id: 'tags',
          path: 'tagOptions',
          label: 'Tags',
          type: 'multiselect',
          options: tagOptions,
          isCreatable: true,
          onCreateOption: (option) => {
            return addTag(option);
          },
        },
      ]}
    />
  );
}

function GrowResources({
  resources,
}: {
  resources: AllGrowResourcesQuery['allGrowResources'];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useUser();
  const userId = 'alx';

  const tabs = [
    { name: 'Recent', href: '#', current: true },
    { name: 'Most Liked', href: '#', current: false },
    { name: 'Most Answers', href: '#', current: false },
  ];
  const user = juxters.find((j) => j.staffRecord.juxtcode === 'alx');
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteGrowResourceMutation({
    onSuccess: (data) => {
      splitbee.track('Delete Grow Resource', {
        data: JSON.stringify(data),
      });
      queryClient.refetchQueries('allGrowResources');
    },
  });

  const deleteResource = (resourceId: string) => {
    deleteMutation.mutate({
      id: resourceId,
    });
  };
  const whoToFollow = [
    {
      name: 'Leonard Krasner',
      handle: 'leonardkrasner',
      href: '#',
      imageUrl:
        'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    // More people...
  ];
  const trendingPosts = [
    {
      id: 1,
      user: {
        name: 'Floyd Miles',
        imageUrl:
          'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      body: 'What books do you have on your bookshelf just to look smarter than you actually are?',
      comments: 291,
    },
    // More posts...
  ];
  const mockNav = [{ name: 'foo', href: '#', icon: HomeIcon }];
  const communities = [
    { name: 'Movies', href: '#' },
    { name: 'Food', href: '#' },
    { name: 'Sports', href: '#' },
    { name: 'Animals', href: '#' },
    { name: 'Science', href: '#' },
    { name: 'Dinosaurs', href: '#' },
    { name: 'Talents', href: '#' },
    { name: 'Gaming', href: '#' },
  ];
  return (
    <>
      <AddGrowResourcesModal
        isOpen={!!isModalOpen}
        handleClose={() => setIsModalOpen(false)}
      />
      {user?.name && (
        <div className="min-h-full">
          {/* When the mobile menu is open, add `overflow-hidden` to the `body` element to prevent double scrollbars */}
          <Popover
            as="header"
            className={({ open }) =>
              classNames(
                open ? 'fixed inset-0 z-40 overflow-y-auto' : '',
                'bg-white shadow-sm lg:static lg:overflow-y-visible',
              )
            }>
            {({ open }) => (
              <>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">
                    <div className="flex md:absolute md:left-0 md:inset-y-0 lg:static xl:col-span-2">
                      <div className="flex-shrink-0 flex items-center">
                        <a href="#">
                          <img
                            className="block h-8 w-auto"
                            src="https://tailwindui.com/img/logos/workflow-mark.svg?color=rose&shade=500"
                            alt="Workflow"
                          />
                        </a>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
                      <div className="flex items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
                        <div className="w-full">
                          <label htmlFor="search" className="sr-only">
                            Search
                          </label>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                              <SearchIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </div>
                            <input
                              id="search"
                              name="search"
                              className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                              placeholder="Search"
                              type="search"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center md:absolute md:right-0 md:inset-y-0 lg:hidden">
                      {/* Mobile menu button */}
                      <Popover.Button className="-mx-2 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500">
                        <span className="sr-only">Open menu</span>
                        {open ? (
                          <XIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                          <MenuIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Popover.Button>
                    </div>
                    <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
                      <button
                        type="button"
                        className="ml-5 flex-shrink-0 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="flex-shrink-0 relative ml-5">
                        <div>
                          <Menu.Button className="bg-white rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src={user.avatar}
                              alt=""
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95">
                          <Menu.Items className="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none"></Menu.Items>
                        </Transition>
                      </Menu>

                      <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
                        New Post
                      </button>
                    </div>
                  </div>
                </div>

                <Popover.Panel
                  as="nav"
                  className="lg:hidden"
                  aria-label="Global">
                  <div className="max-w-3xl mx-auto px-2 pt-2 pb-3 space-y-1 sm:px-4">
                    {mockNav.map((item) => {
                      const current = item.name === 'foo';
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          aria-current={current ? 'page' : undefined}
                          className={classNames(
                            current
                              ? 'bg-gray-100 text-gray-900'
                              : 'hover:bg-gray-50',
                            'block rounded-md py-2 px-3 text-base font-medium',
                          )}>
                          {item.name}
                        </a>
                      );
                    })}
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="max-w-3xl mx-auto px-4 flex items-center sm:px-6">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.avatar}
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">
                          {user.name}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                          {user.id}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="ml-auto flex-shrink-0 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-3 max-w-3xl mx-auto px-2 space-y-1 sm:px-4">
                      {mockNav.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 max-w-3xl mx-auto px-4 sm:px-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700">
                      New Post
                    </button>

                    <div className="mt-6 flex justify-center">
                      <a
                        href="#"
                        className="text-base font-medium text-gray-900 hover:underline">
                        Go Premium
                      </a>
                    </div>
                  </div>
                </Popover.Panel>
              </>
            )}
          </Popover>

          <div className="py-10">
            <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
                <nav
                  aria-label="Sidebar"
                  className="sticky top-4 divide-y divide-gray-300">
                  <div className="pb-8 space-y-1">
                    {mockNav.map((item) => {
                      const current = item.name === 'foo';
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            current
                              ? 'bg-gray-200 text-gray-900'
                              : 'text-gray-600 hover:bg-gray-50',
                            'group flex items-center px-3 py-2 text-sm font-medium rounded-md',
                          )}
                          aria-current={current ? 'page' : undefined}>
                          <item.icon
                            className={classNames(
                              current
                                ? 'text-gray-500'
                                : 'text-gray-400 group-hover:text-gray-500',
                              'flex-shrink-0 -ml-1 mr-3 h-6 w-6',
                            )}
                            aria-hidden="true"
                          />
                          <span className="truncate">{item.name}</span>
                        </a>
                      );
                    })}
                  </div>
                  <div className="pt-10">
                    <p
                      className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      id="communities-headline">
                      My communities
                    </p>
                    <div
                      className="mt-3 space-y-2"
                      aria-labelledby="communities-headline">
                      {communities.map((community) => (
                        <a
                          key={community.name}
                          href={community.href}
                          className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
                          <span className="truncate">{community.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </nav>
              </div>
              <main className="lg:col-span-9 xl:col-span-6">
                <div className="px-4 sm:px-0">
                  <div className="sm:hidden">
                    <label htmlFor="question-tabs" className="sr-only">
                      Select a tab
                    </label>
                    <select
                      id="question-tabs"
                      className="block w-full rounded-md border-gray-300 text-base font-medium text-gray-900 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                      defaultValue={tabs.find((tab) => tab.current)?.name}>
                      {tabs.map((tab) => (
                        <option key={tab.name}>{tab.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="hidden sm:block">
                    <nav
                      className="relative z-0 rounded-lg shadow flex divide-x divide-gray-200"
                      aria-label="Tabs">
                      {tabs.map((tab, tabIdx) => (
                        <a
                          key={tab.name}
                          href={tab.href}
                          aria-current={tab.current ? 'page' : undefined}
                          className={classNames(
                            tab.current
                              ? 'text-gray-900'
                              : 'text-gray-500 hover:text-gray-700',
                            tabIdx === 0 ? 'rounded-l-lg' : '',
                            tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
                            'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-6 text-sm font-medium text-center hover:bg-gray-50 focus:z-10',
                          )}>
                          <span>{tab.name}</span>
                          <span
                            aria-hidden="true"
                            className={classNames(
                              tab.current ? 'bg-rose-500' : 'bg-transparent',
                              'absolute inset-x-0 bottom-0 h-0.5',
                            )}
                          />
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
                <div className="mt-4">
                  <h1 className="sr-only">Recent questions</h1>
                  <ul role="list" className="space-y-4">
                    {resources
                      ?.filter(notEmpty)
                      .map(
                        ({
                          id,
                          name,
                          _siteSubject,
                          url,
                          _siteValidTime,
                          descriptionHTML,
                          category,
                          ...rest
                        }) => {
                          const subject = juxters.find(
                            ({ staffRecord }) =>
                              staffRecord.juxtcode === _siteSubject,
                          );
                          const tags = rest?.tags?.filter((t) => t?.name);
                          return (
                            <li
                              key={id}
                              className="bg-white px-4 py-6 shadow sm:p-6 sm:rounded-lg">
                              <article aria-labelledby={'question-title-' + id}>
                                <div>
                                  <div className="flex my-2 text-gray-500 text-sm">
                                    {category}
                                  </div>
                                  <div className="flex space-x-3">
                                    <div className="flex-shrink-0">
                                      <img
                                        className="h-10 w-10 rounded-full"
                                        src={subject?.avatar}
                                        alt=""
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-medium text-gray-900">
                                        <a href="#" className="hover:underline">
                                          {subject?.name}
                                        </a>
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        <a
                                          href={url || '#'}
                                          className="hover:underline">
                                          <time dateTime={_siteValidTime}>
                                            {new Date(
                                              _siteValidTime,
                                            ).toDateString()}
                                          </time>
                                        </a>
                                      </p>
                                    </div>
                                    <div className="flex-shrink-0 self-center flex">
                                      <Menu
                                        as="div"
                                        className="relative inline-block text-left">
                                        <div>
                                          <Menu.Button className="-m-2 p-2 rounded-full flex items-center text-gray-400 hover:text-gray-600">
                                            <span className="sr-only">
                                              Open options
                                            </span>
                                            <DotsVerticalIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </Menu.Button>
                                        </div>

                                        <Transition
                                          as={Fragment}
                                          enter="transition ease-out duration-100"
                                          enterFrom="transform opacity-0 scale-95"
                                          enterTo="transform opacity-100 scale-100"
                                          leave="transition ease-in duration-75"
                                          leaveFrom="transform opacity-100 scale-100"
                                          leaveTo="transform opacity-0 scale-95">
                                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className="py-1">
                                              {(userId === 'alx' ||
                                                userId === _siteSubject) && (
                                                <Menu.Item>
                                                  {({ active }) => (
                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        deleteResource(id)
                                                      }
                                                      className={classNames(
                                                        active
                                                          ? 'bg-gray-100 text-gray-900'
                                                          : 'text-gray-700',
                                                        'flex px-4 py-2 text-sm w-full',
                                                      )}>
                                                      <TrashIcon
                                                        className="mr-3 h-5 w-5 text-gray-400"
                                                        aria-hidden="true"
                                                      />
                                                      <span>Delete</span>
                                                    </button>
                                                  )}
                                                </Menu.Item>
                                              )}
                                              <Menu.Item>
                                                {({ active }) => (
                                                  <a
                                                    href="#"
                                                    className={classNames(
                                                      active
                                                        ? 'bg-gray-100 text-gray-900'
                                                        : 'text-gray-700',
                                                      'flex px-4 py-2 text-sm',
                                                    )}>
                                                    <StarIcon
                                                      className="mr-3 h-5 w-5 text-gray-400"
                                                      aria-hidden="true"
                                                    />
                                                    <span>
                                                      Add to favorites
                                                    </span>
                                                  </a>
                                                )}
                                              </Menu.Item>
                                              <Menu.Item>
                                                {({ active }) => (
                                                  <a
                                                    href="#"
                                                    className={classNames(
                                                      active
                                                        ? 'bg-gray-100 text-gray-900'
                                                        : 'text-gray-700',
                                                      'flex px-4 py-2 text-sm',
                                                    )}>
                                                    <CodeIcon
                                                      className="mr-3 h-5 w-5 text-gray-400"
                                                      aria-hidden="true"
                                                    />
                                                    <span>Copy URL</span>
                                                  </a>
                                                )}
                                              </Menu.Item>
                                              <Menu.Item>
                                                {({ active }) => (
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      alert('go report urself')
                                                    }
                                                    className={classNames(
                                                      active
                                                        ? 'bg-gray-100 text-gray-900'
                                                        : 'text-gray-700',
                                                      'flex px-4 py-2 text-sm w-full',
                                                    )}>
                                                    <FlagIcon
                                                      className="mr-3 h-5 w-5 text-gray-400"
                                                      aria-hidden="true"
                                                    />
                                                    <span>Report content</span>
                                                  </button>
                                                )}
                                              </Menu.Item>
                                            </div>
                                          </Menu.Items>
                                        </Transition>
                                      </Menu>
                                    </div>
                                  </div>
                                  <h2
                                    id={'question-title-' + id}
                                    className="mt-4 text-base font-medium text-gray-900">
                                    {name}
                                    {url && ' -- '}
                                    {url && (
                                      <a className="underline" href={url}>
                                        {url}
                                      </a>
                                    )}
                                  </h2>
                                </div>
                                {descriptionHTML && (
                                  <TipTapContent
                                    className="prose-sm"
                                    htmlString={descriptionHTML}
                                  />
                                )}
                                {tags && tags.length > 0 && (
                                  <div className="mt-4">
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium text-gray-600">
                                        Tags
                                      </span>
                                      <div className="flex-1 ml-2">
                                        {tags.map((tag, index) => (
                                          <span
                                            key={index}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium leading-4 bg-gray-100 text-gray-800">
                                            {tag?.name}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="mt-6 flex justify-between space-x-8">
                                  <div className="flex space-x-6">
                                    <span className="inline-flex items-center text-sm">
                                      <button
                                        type="button"
                                        className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                                        <ThumbUpIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                        <span className="font-medium text-gray-900">
                                          {4}
                                        </span>
                                        <span className="sr-only">likes</span>
                                      </button>
                                    </span>
                                    <span className="inline-flex items-center text-sm">
                                      <button
                                        type="button"
                                        className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                                        <ChatAltIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                        <span className="font-medium text-gray-900">
                                          {9}
                                        </span>
                                        <span className="sr-only">replies</span>
                                      </button>
                                    </span>
                                    <span className="inline-flex items-center text-sm">
                                      <button
                                        type="button"
                                        className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                                        <EyeIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                        <span className="font-medium text-gray-900">
                                          {9}
                                        </span>
                                        <span className="sr-only">views</span>
                                      </button>
                                    </span>
                                  </div>
                                  <div className="flex text-sm">
                                    <span className="inline-flex items-center text-sm">
                                      <button
                                        type="button"
                                        className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                                        <ShareIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                        <span className="font-medium text-gray-900">
                                          Share
                                        </span>
                                      </button>
                                    </span>
                                  </div>
                                </div>
                              </article>
                            </li>
                          );
                        },
                      )}
                  </ul>
                </div>
              </main>
              <aside className="hidden xl:block xl:col-span-4">
                <div className="sticky top-4 space-y-4">
                  <section aria-labelledby="who-to-follow-heading">
                    <div className="bg-white rounded-lg shadow">
                      <div className="p-6">
                        <h2
                          id="who-to-follow-heading"
                          className="text-base font-medium text-gray-900">
                          Who to follow
                        </h2>
                        <div className="mt-6 flow-root">
                          <ul
                            role="list"
                            className="-my-4 divide-y divide-gray-200">
                            {whoToFollow.map((user) => (
                              <li
                                key={user.handle}
                                className="flex items-center py-4 space-x-3">
                                <div className="flex-shrink-0">
                                  <img
                                    className="h-8 w-8 rounded-full"
                                    src={user.imageUrl}
                                    alt=""
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    <a href={user.href}>{user.name}</a>
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    <a href={user.href}>{'@' + user.handle}</a>
                                  </p>
                                </div>
                                <div className="flex-shrink-0">
                                  <button
                                    type="button"
                                    className="inline-flex items-center px-3 py-0.5 rounded-full bg-rose-50 text-sm font-medium text-rose-700 hover:bg-rose-100">
                                    <PlusSmIcon
                                      className="-ml-1 mr-0.5 h-5 w-5 text-rose-400"
                                      aria-hidden="true"
                                    />
                                    <span>Follow</span>
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-6">
                          <a
                            href="#"
                            className="w-full block text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            View all
                          </a>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section aria-labelledby="trending-heading">
                    <div className="bg-white rounded-lg shadow">
                      <div className="p-6">
                        <h2
                          id="trending-heading"
                          className="text-base font-medium text-gray-900">
                          Trending
                        </h2>
                        <div className="mt-6 flow-root">
                          <ul
                            role="list"
                            className="-my-4 divide-y divide-gray-200">
                            {trendingPosts.map((post) => (
                              <li key={post.id} className="flex py-4 space-x-3">
                                <div className="flex-shrink-0">
                                  <img
                                    className="h-8 w-8 rounded-full"
                                    src={post.user.imageUrl}
                                    alt={post.user.name}
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm text-gray-800">
                                    {post.body}
                                  </p>
                                  <div className="mt-2 flex">
                                    <span className="inline-flex items-center text-sm">
                                      <button
                                        type="button"
                                        className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                                        <ChatAltIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                        <span className="font-medium text-gray-900">
                                          {post.comments}
                                        </span>
                                      </button>
                                    </span>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-6">
                          <a
                            href="#"
                            className="w-full block text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            View all
                          </a>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function App() {
  const { data: resources, isLoading } = useAllGrowResourcesQuery();
  const { id: username } = useUser();
  useEffect(() => {
    if (username) {
      splitbee.user.set({ userId: username });
    }
  }, [username]);
  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : resources?.allGrowResources ? (
        <GrowResources resources={resources.allGrowResources} />
      ) : (
        <div>No resources found</div>
      )}
    </div>
  );
}
