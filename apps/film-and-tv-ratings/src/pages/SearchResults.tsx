import { Text } from '@mantine/core';
import { Link, Outlet, useMatch, useNavigate, useSearch } from 'react-location';
import { useQuery } from 'react-query';
import { api_key, client } from '../common';
import {
  NavStructure,
  AxiosTMDBError,
  TSearchResults,
  TSearchType,
} from '../types';

async function searchQuery(
  searchTerm: string,
  searchType: TSearchType,
  page = 1,
) {
  const response = await client.get<TSearchResults>(
    `https://api.themoviedb.org/3/search/${searchType}?api_key=${api_key}&language=en-US&query=${searchTerm}&page=${page}&include_adult=false`,
  );
  return response.data;
}

function useSearchResults(
  searchTerm = '',
  searchType: TSearchType = 'movie',
  page = 1,
) {
  return useQuery<TSearchResults, AxiosTMDBError>(
    [searchType, searchTerm, page],
    () => searchQuery(searchTerm, searchType, page),
    {
      enabled: searchTerm.length > 2,
    },
  );
}

export function SearchResults() {
  const navigate = useNavigate<NavStructure>();
  const {
    params: { searchType },
  } = useMatch<NavStructure>();
  const { query, page } = useSearch<NavStructure>();

  const response = useSearchResults(query, searchType, page);
  const handleChangePage = (page: number) => {
    navigate({
      search: (old) => ({
        ...old,
        page,
      }),
    });
  };

  return (
    <div>
      {query && (
        <>
          <h1>SearchResults page</h1>
          <p>current type is {searchType}</p>
          <p>current query is {query}</p>
          {response.isLoading && <p>loading...</p>}
          {response.isError && (
            <Text color="red">
              <p>{response.error.response?.data.status_message}</p>
              {response.error.response?.data?.errors?.map((error) => (
                <p>{error}</p>
              ))}
              <p>{response.error.message}</p>
            </Text>
          )}
          {response.isSuccess && (
            <>
              <p>current page {response.data.page}</p>
              <button onClick={() => handleChangePage(response.data.page - 1)}>
                prev page
              </button>
              <button onClick={() => handleChangePage(response.data.page + 1)}>
                next page
              </button>

              <ul>
                {response.data.results?.map((result) => (
                  <li key={result.id}>
                    <Link
                      to={`/search/${searchType}/${result.id}`}
                      search={(old) => ({ ...old, query: query })}>
                      {result?.title || result?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          {/* 'Outlet' renders the remaining route matches from the router.
       In this case it will be where the /:itemId route is rendered */}
          <Outlet />
        </>
      )}
    </div>
  );
}
