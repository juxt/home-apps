import {
  Link,
  Outlet,
  useMatch,
  useNavigate,
  useSearch,
} from '@tanstack/react-location';
import { useAtom } from 'jotai';
import { useQuery } from 'react-query';
import { api_key, client, poster_img } from '../common';
import { TMDBError } from '../components/Errors';
import { searchAtom } from '../components/Search';
import {
  NavStructure,
  AxiosTMDBError,
  TSearchResults,
  TSearchType,
} from '../types';
import { Card, Image, Text, SimpleGrid, Pagination, Title } from '@mantine/core';

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

  console.log(response.data?.results);
  
  return (
    <div>
      {search && (
        <SimpleGrid cols={2}>
          <div>
          <Title order={1}>Search Results</Title>
          <Text color="gray">You are searching in {searchType}</Text>
          <Text color="gray">Showing results for "{search}"</Text>
          {response.isLoading && <p>loading...</p>}
          {response.isError && <TMDBError error={response.error} />}
          {response.isSuccess && (
            <>
              <Pagination total={10} color="orange" size="sm" radius="xs" onChange={handleChangePage}/>
              <SimpleGrid cols={4}>
                {response.data.results?.map((result) => (
                  <div key={result.id}>
                    <Link to={`/search/${searchType}/${result.id}`}>
                      <Card
                      shadow="sm"
                      p="xl"
                      // component="a"
                      // href={`/search/${searchType}/${result.id}`}
                      // target="_blank"
                      >
                      <Card.Section>
                        <Image src={`https://image.tmdb.org/t/p/original/${result.backdrop_path}`} height={160} alt="Movie poster" />
                      </Card.Section>

                      <Text weight={500} size="lg">
                      {result?.title || result?.name}
                      </Text>

                      {/* <Text size="sm">
                        Please click anywhere on this card to claim your reward,
                        this is not a fraud, trust us
                      </Text> */}
                    </Card>
                    </Link>
                  </div>
                ))}
              </SimpleGrid>
            </>
          )}
          </div>
          {/* 'Outlet' renders the remaining route matches from the router.
       In this case it will be where the /:itemId route is rendered */}
          <Outlet />
        </SimpleGrid>
      )}
    </div>
  );
}
