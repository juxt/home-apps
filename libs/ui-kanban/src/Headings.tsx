import { Fragment } from 'react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  EyeIcon,
  EyeOffIcon,
  FolderAddIcon,
  PencilIcon,
  PlusIcon,
  TableIcon,
  ViewBoardsIcon,
} from '@heroicons/react/solid';
import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { useNavigate, useSearch } from 'react-location';
import {
  TWorkflow,
  LocationGenerics,
  useCurrentProject,
  useModalForm,
} from '@juxt-home/site';
import { useMobileDetect } from '@juxt-home/utils';

export function Heading({
  workflow,
  handleAddCard,
}: {
  workflow: TWorkflow;
  handleAddCard: () => void;
}) {
  const currentProject = useCurrentProject().data;
  const isMobile = useMobileDetect().isMobile();
  const navigate = useNavigate<LocationGenerics>();
  const search = useSearch<LocationGenerics>();

  const { showDetails } = search;
  const showDetailsText = showDetails ? 'Hide details' : 'Show details';
  const ShowDetailsIcon = showDetails ? (
    <EyeOffIcon
      className="-ml-1 mr-2 h-5 w-5 text-gray-500"
      aria-hidden="true"
    />
  ) : (
    <EyeIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
  );
  const handleToggleDetails = () => {
    navigate({
      search: {
        ...search,
        showDetails: !showDetails,
      },
    });
  };

  const isCardView = !search?.view || search.view === 'card';
  const ChangeViewIcon = isCardView ? (
    <ViewBoardsIcon
      className="-ml-1 mr-2 h-5 w-5 text-gray-500"
      aria-hidden="true"
    />
  ) : (
    <TableIcon
      className="-ml-1 mr-2 h-5 w-5 text-gray-500"
      aria-hidden="true"
    />
  );
  const changeViewText = isCardView ? 'Table View' : 'Card View';
  const handleChangeView = () => {
    navigate({
      search: { ...search, view: isCardView ? 'table' : 'card' },
    });
  };

  const hasProject = currentProject?.name;
  const editProjectText = `Edit "${currentProject?.name}"`;
  const addProjectText = 'Add Project';
  const [, setProjectFormOpen] = useModalForm({
    formModalType: 'editProject',
    projectId: currentProject?.id,
  });
  const [, setAddProject] = useModalForm({
    formModalType: 'addProject',
  });

  return (
    <div className="lg:flex lg:items-center lg:justify-between z-20">
      <div className="flex-1 min-w-0">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  Projects
                </span>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon
                  className="flex-shrink-0 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  {currentProject?.name || 'All projects'}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <h2 className="capitalize mt-2 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          {workflow?.name}
        </h2>
        {workflow?.description && (
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              {workflow.description}
            </div>
          </div>
        )}
      </div>
      <div className="mt-5 flex lg:mt-0 lg:ml-4">
        <span className="hidden sm:block">
          <button
            type="button"
            onClick={() => setAddProject(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <FolderAddIcon
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
            {addProjectText}
          </button>
        </span>

        {hasProject && (
          <span className="hidden sm:block ml-3">
            <button
              type="button"
              onClick={() => setProjectFormOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <PencilIcon
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                aria-hidden="true"
              />
              {editProjectText}
            </button>
          </span>
        )}
        {isCardView && (
          <span className="hidden sm:block ml-3">
            <button
              type="button"
              onClick={handleToggleDetails}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {ShowDetailsIcon}
              {showDetailsText}
            </button>
          </span>
        )}
        <span className="hidden sm:block ml-3">
          <button
            type="button"
            onClick={handleChangeView}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {ChangeViewIcon}
            {changeViewText}
          </button>
        </span>

        <span className="sm:ml-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleAddCard}>
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Card
            {!isMobile && ' (c)'}
          </button>
        </span>

        {/* Dropdown */}
        <Menu as="span" className="ml-3 relative sm:hidden">
          <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            More
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95">
            <Menu.Items className="origin-top-right z-20 absolute cursor-pointer right-0 mt-2 -mr-1 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => setAddProject(true)}
                    className={classNames(
                      active ? 'bg-gray-100' : '',
                      'flex px-4 py-2 text-sm text-gray-700',
                    )}>
                    <FolderAddIcon
                      className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                      aria-hidden="true"
                    />
                    {addProjectText}
                  </button>
                )}
              </Menu.Item>

              {hasProject && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={() => setProjectFormOpen(true)}
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'flex px-4 py-2 text-sm text-gray-700',
                      )}>
                      <PencilIcon
                        className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                        aria-hidden="true"
                      />
                      {editProjectText}
                    </button>
                  )}
                </Menu.Item>
              )}
              {isCardView && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={handleToggleDetails}
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'flex px-4 py-2 text-sm text-gray-700',
                      )}>
                      {ShowDetailsIcon}
                      {showDetailsText}
                    </button>
                  )}
                </Menu.Item>
              )}

              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={handleChangeView}
                    className={classNames(
                      active ? 'bg-gray-100' : '',
                      'flex px-4 py-2 text-sm text-gray-700',
                    )}>
                    {ChangeViewIcon}
                    {changeViewText}
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}
