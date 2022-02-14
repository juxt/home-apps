// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination,
  Row,
} from 'react-table';
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/solid';
import { Button, PageButton } from './Buttons';
import { SortIcon, SortUpIcon, SortDownIcon } from './Icons';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearch } from 'react-location';

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: {
  preGlobalFilteredRows: any;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = (val: string) => setGlobalFilter(val || '');

  return (
    <label
      htmlFor="table-global-search"
      className="flex gap-x-2 items-baseline">
      <span className="text-gray-700">Search: </span>
      <input
        id="table-global-search"
        type="text"
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </label>
  );
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id, render },
}: {
  column: {
    filterValue: any;
    setFilter: (value: any) => void;
    preFilteredRows: Row<object>[];
    id: string;
    render: any;
  };
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = useMemo(() => {
    const optionsSet = new Set();
    preFilteredRows.forEach((row) => {
      optionsSet.add(row.values[id]);
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return [...optionsSet.values()];
  }, [id, preFilteredRows]);
  // Render a multi-select box

  const navigate = useNavigate();
  const search = useSearch();

  const { filters } = search;

  useEffect(() => {
    if (filters?.[id]) {
      setFilter(filters[id]);
    }
  }, [filters, id]);

  return (
    <label htmlFor={id} className="flex gap-x-2 items-baseline">
      <span className="text-gray-700">{render('Header')}: </span>
      <select
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        name={id}
        id={id}
        value={filterValue || ''}
        onChange={(e) => {
          navigate({
            search: {
              ...search,
              filters: {
                ...search.filters,
                [id]: e.target.value,
              },
            },
          });
          setFilter(e.target.value || undefined);
        }}>
        <option value="">All</option>
        {options.map((option: string) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function StatusPill({ value }: { value: string }) {
  const status = value ? value.toLowerCase() : 'unknown';

  return (
    <span
      className={classNames(
        'px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm',
        status.startsWith('active') ? 'bg-green-100 text-green-800' : null,
        status.startsWith('inactive') ? 'bg-yellow-100 text-yellow-800' : null,
        status.startsWith('offline') ? 'bg-red-100 text-red-800' : null,
      )}>
      {status}
    </span>
  );
}

export function AvatarCell({
  value,
  column,
  row,
}: {
  value: string;
  column: any;
  row: Row<any>;
}) {
  return (
    <div className="flex items-center">
      <div className="flex-shrink-0 h-10 w-10">
        <img
          className="h-10 w-10 rounded-full"
          src={row.original[column.imgAccessor]}
          alt=""
        />
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">
          {row.original[column.emailAccessor]}
        </div>
      </div>
    </div>
  );
}

export function Table({
  onRowClick,
  columns,
  data,
}: {
  onRowClick?: (row: any) => void;
  columns: any;
  data: any;
}) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    setAllFilters,
  } = useTable(
    {
      columns,
      data,
      autoResetFilters: false,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );
  const showPagination = canNextPage || canPreviousPage;
  const navigate = useNavigate();
  const search = useSearch();
  // Render the UI for your table
  return (
    <>
      <div className="sm:flex sm:gap-x-2 items-center  mt-4">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        {headerGroups.map((headerGroup) =>
          headerGroup.headers.map((column) =>
            column.Filter ? (
              <div key={column.id}>{column.render('Filter')}</div>
            ) : null,
          ),
        )}

        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => {
            navigate({
              search: {
                ...search,
                filters: undefined,
              },
            });
            return setAllFilters([]);
          }}>
          Reset
        </button>
      </div>
      {/* table */}
      <div
        className={classNames(
          'mt-4 flexw-full  flex-col md:w-full',
          !showPagination && 'pb-4',
        )}>
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block sm:px-6 lg:px-8 w-full">
            <div className="relative sm:shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table
                {...getTableProps()}
                className="divide-y divide-gray-200 w-full">
                <thead className="bg-gray-50 sm:visible invisible absolute sm:relative">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        <th
                          scope="col"
                          className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          {...column.getHeaderProps(
                            column.getSortByToggleProps(),
                          )}
                          style={{
                            width: column.width,
                            minWidth: column.minWidth,
                            maxWidth: column.maxWidth,
                          }}>
                          <div className="flex items-center justify-between">
                            {column.render('Header')}
                            {/* Add a sort direction indicator */}
                            <span>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <SortDownIcon className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <SortUpIcon className="w-4 h-4 text-gray-400" />
                                )
                              ) : (
                                <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                              )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="bg-white divide-y divide-gray-200">
                  {page.map((row) => {
                    // new
                    prepareRow(row);
                    return (
                      <tr
                        className={classNames(
                          'shadow-lg sm:shadow-none mb-6 sm:mb-0 flex flex-row flex-wrap sm:table-row sm:hover:bg-gray-100',
                          onRowClick && 'cursor-pointer',
                        )}
                        onClick={() => onRowClick && onRowClick(row)}
                        {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          const item = cell?.column?.Cell as { name?: string };
                          return (
                            <td
                              className="sm:flex-1 truncate w-1/2 sm:w-max pt-8 sm:pt-0 relative sm:flex-nowrap px-6 py-4 text-left"
                              {...cell.getCellProps()}
                              style={{
                                width: cell.column.width,
                                minWidth: cell.column.minWidth,
                                maxWidth: cell.column.maxWidth,
                              }}
                              role="cell">
                              <span className="group text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:hidden absolute top-0 inset-x-0 p-1 bg-gray-50 pl-2">
                                {cell.column.Header}
                              </span>
                              {item?.name === 'defaultRenderer' ? (
                                <div className="text-sm text-gray-500">
                                  {cell.render('Cell')}
                                </div>
                              ) : (
                                cell.render('Cell')
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
      {showPagination && (
        <div className="py-3 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
              Previous
            </Button>
            <Button onClick={() => nextPage()} disabled={!canNextPage}>
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex gap-x-2 items-baseline">
              <span className="text-sm text-gray-700">
                Page <span className="font-medium">{state.pageIndex + 1}</span>{' '}
                of <span className="font-medium">{pageOptions.length}</span>
              </span>
              <label htmlFor="itemsPerPage">
                <span className="sr-only">Items Per Page</span>
                <select
                  id="itemsPerPage"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={state.pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}>
                  {[5, 10, 20].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination">
                <PageButton
                  className="rounded-l-md"
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}>
                  <span className="sr-only">First</span>
                  <ChevronDoubleLeftIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </PageButton>
                <PageButton
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}>
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </PageButton>
                <PageButton onClick={() => nextPage()} disabled={!canNextPage}>
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </PageButton>
                <PageButton
                  className="rounded-r-md"
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}>
                  <span className="sr-only">Last</span>
                  <ChevronDoubleRightIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </PageButton>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
