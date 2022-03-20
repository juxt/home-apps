import {
  Link,
  Outlet,
  useMatch,
  useNavigate,
  useSearch,
} from '@tanstack/react-location';
import { useAtom } from 'jotai';
import { useQuery } from 'react-query';
import { api_key, client } from '../common';
import { TMDBError } from '../components/Errors';
import { searchAtom } from '../components/Search';
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
    `/3/search/${searchType}?api_key=${api_key}&language=en-US&query=${searchTerm}&page=${page}&include_adult=false`,
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
  const { page } = useSearch<NavStructure>();
  const [search] = useAtom(searchAtom);

  const response = useSearchResults(search, searchType, page);
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
      {search && (
        <>
          <h1>SearchResults page</h1>
          <p>current type is {searchType}</p>
          <p>current search is {search}</p>
          {response.isLoading && <p>loading...</p>}
          {response.isError && <TMDBError error={response.error} />}
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
                    <Link to={`/search/${searchType}/${result.id}`}>
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
