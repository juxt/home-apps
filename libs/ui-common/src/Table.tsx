/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  usePagination,
  Row,
  useFlexLayout,
  useResizeColumns,
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
import { useEffect, useMemo, useState, Fragment } from 'react';
import { useNavigate, useSearch } from 'react-location';
import { LocationGenerics } from '@juxt-home/site';
import { notEmpty, useMobileDetect } from '@juxt-home/utils';
import { isArray } from 'lodash';

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  value,
  setValue,
  setGlobalFilter,
}: {
  preGlobalFilteredRows: any;
  value: string;
  setValue: (value: string) => void;
  setGlobalFilter: (value: string) => void;
}) {
  const count = preGlobalFilteredRows.length;
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <>
      <FilterLabel label={'Search'} />
      <input
        type="text"
        className="w-full md:w-10/12 mr-2 box-border text-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </>
  );
}

function FilterLabel({ label }: { label: string }) {
  return (
    <span className="text-gray-700 text-xs w-28 flex-nowrap truncate">
      {label}:{' '}
    </span>
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
    const options = new Set();
    preFilteredRows.forEach((row) => {
      if (isArray(row.values[id])) {
        if (row.values[id].length > 0) {
          row.values[id].forEach((value) => {
            options.add(value);
          });
        }
      } else if (row.values[id] !== undefined) {
        options.add(row.values[id]);
      }
    });
    return [...options.values()] as string[];
  }, [id, preFilteredRows]);
  // Render a multi-select box

  const navigate = useNavigate<LocationGenerics>();

  <>
    <FilterLabel label={render('Header')} />
    <select
      className="w-full md:w-10/12 box-border mr-2 rounded-md text-xs border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      name={id}
      id={id}
      value={filterValue || ''}
      onChange={(e) => {
        navigate({
          search: (search) => ({
            ...search,
            filters: {
              ...search.filters,
              [id]: e.target.value,
            },
          }),
        });
        setFilter(e.target.value || undefined);
      }}>
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  </>;
}
export function DateFilter({
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
  const getDateString = (daysAgo: number) => {
    const date = new Date();
    return new Date(date.setDate(date.getDate() - daysAgo))
      .toISOString()
      .split('T')[0];
  };
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = useMemo(() => {
    return [
      {
        label: 'Today',
        value: getDateString(0),
      },
      {
        label: 'Yesterday',
        value: getDateString(1),
      },
      {
        label: 'Last 7 days',
        value: getDateString(7),
      },
      {
        label: 'Last 30 days',
        value: getDateString(30),
      },
    ];
  }, []);
  // Render a multi-select box

  const navigate = useNavigate<LocationGenerics>();
  const search = useSearch<LocationGenerics>();

  const filters = search.filters;
  const filter = filters?.[id];
  useEffect(() => {
    if (filter) {
      setFilter(filter);
    }
  }, [filter, setFilter]);

  return (
    <>
      <FilterLabel label={render('Header')} />
      <select
        className="w-full md:w-10/12 box-border mr-2 rounded-md text-xs border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        name={id}
        id={id}
        value={filterValue || ''}
        onChange={(e) => {
          navigate({
            search: (search) => ({
              ...search,
              filters: {
                ...search.filters,
                [id]: e.target.value,
              },
            }),
          });
        }}>
        <option value="">All</option>
        {options.map(({ label, value }, i) => (
          <option key={i} value={value}>
            {label}
          </option>
        ))}
      </select>
    </>
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

export function DateFilterFn(
  rows: Array<Row>,
  ids: Array<string>,
  filterValue: string,
) {
  const filteredRows = rows.filter((row) => {
    const rowValue = row.values[ids[0]];
    const rowDate = new Date(rowValue);
    const filterDate = new Date(filterValue);

    if (rowValue) {
      return rowDate.getTime() >= filterDate.getTime();
    }
    return false;
  });
  return filteredRows;
}

export const FilterLabelContainer: FC = ({ children }) => (
  <div className="flex w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/6 gap-x-2 items-baseline first:mt-0 mt-2 md:mt-0">
    {children}
  </div>
);

export function Table({
  onRowClick,
  columns,
  data,
  hiddenColumns,
}: {
  onRowClick?: (row: any) => void;
  columns: any;
  data: any;
  hiddenColumns?: string[];
}) {
  const defaultColumn = useMemo(() => {
    return {
      minWidth: 50,
      width: 150,
      maxWidth: 320,
    };
  }, []);

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
      initialState: {
        hiddenColumns: hiddenColumns || [],
      },
      columns,
      data,
      defaultColumn,
      autoResetFilters: false,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useFlexLayout,
    useResizeColumns,
  );
  const showPagination = canNextPage || canPreviousPage;
  const navigate = useNavigate<LocationGenerics>();
  const isMobile = useMobileDetect().isMobile();
  const [value, setValue] = useState(state.globalFilter);
  // Render the UI for your table
  return (
    <>
      <div className="flex justify-between flex-wrap sm:flex-nowrap w-full my-1 p-3 items-center bg-slate-300 border-b border-gray-200 sm:rounded-lg">
        <div className="flex flex-col flex-wrap md:flex-row w-full">
          <FilterLabelContainer>
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              value={value}
              setValue={setValue}
              setGlobalFilter={setGlobalFilter}
            />
          </FilterLabelContainer>
          {headerGroups.map((headerGroup) =>
            headerGroup.headers.map((column) =>
              column.Filter ? (
                <FilterLabelContainer key={column.id}>
                  {column.render('Filter')}
                </FilterLabelContainer>
              ) : null,
            ),
          )}
        </div>
        <button
          type="button"
          className="inline-flex items-center align-center mt-2 sm:mt-0 mx-auto sm:mx-0 px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => {
            navigate({
              search: (search) => ({
                ...search,
                filters: undefined,
              }),
            });
            setGlobalFilter('');
            setValue('');
            setAllFilters([]);
          }}>
          Reset
        </button>
      </div>
      {/* table */}
      <div
        className={classNames(
          'mt-4 flex w-full flex-col',
          !showPagination && 'pb-4',
        )}>
        <div className="py-2 align-middle inline-block w-full">
          <div className="relative sm:shadow sm:overflow-x-auto border-b border-gray-200 sm:rounded-lg">
            <table
              {...getTableProps()}
              className="divide-y divide-gray-200 w-full">
              <thead className="bg-gray-50 sm:visible invisible absolute sm:relative">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => {
                      return (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        <th
                          scope="col"
                          key={column.id}
                          {...(isMobile ? null : column.getHeaderProps())}
                          className="border-r-2 w-1 sm:w-auto border-gray-200 group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div
                            className="flex items-center justify-between"
                            {...column.getSortByToggleProps()}>
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
                          <div
                            {...column.getResizerProps()}
                            className="inline-block border-gray-500 w-1 h-full absolute right-0 top-0 translate-x-2/4 z-1 "
                          />
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody
                {...getTableBodyProps()}
                className="bg-white divide-y divide-gray-200">
                {page.map((row) => {
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
                        return (
                          <td
                            className="border-r-2 last:border-r-0 overflow-hidden w-1/2 sm:w-full pt-8 sm:pt-0 relative sm:flex-nowrap px-6 py-4 text-left"
                            {...cell.getCellProps()}
                            role="cell">
                            <div className="flex items-center justify-between">
                              <span className="group text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:hidden absolute top-0 inset-x-0 p-1 bg-gray-50 pl-2">
                                {cell.column.Header}
                              </span>
                              <div className="inline-block border-gray-500 w-1 h-full absolute right-0 top-0 translate-x-2/4 z-1 " />
                            </div>

                            {
                              //@ts-ignore
                              cell?.column?.Cell?.name === 'defaultRenderer' ? (
                                <div className="text-sm truncate text-gray-500">
                                  {cell.render('Cell')}
                                </div>
                              ) : (
                                cell.render('Cell')
                              )
                            }
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
              <label>
                <span className="sr-only">Items Per Page</span>
                <select
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
