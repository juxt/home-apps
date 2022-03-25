import {
  Link,
  Outlet,
  useMatch,
  useMatches,
  useNavigate,
  useRouter,
  useSearch,
} from '@tanstack/react-location';
import { useAtom } from 'jotai';
import { useQuery } from 'react-query';
import { api_key, client, PosterImage } from '../common';
import { TMDBError } from '../components/Errors';
import { searchAtom } from '../components/Search';
import {
  NavStructure,
  AxiosTMDBError,
  TSearchResults,
  TSearchType,
} from '../types';
import {
  Card,
  Image,
  Text,
  SimpleGrid,
  Pagination,
  Title,
  Button,
} from '@mantine/core';
import { useMobileDetect } from '@juxt-home/utils';

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
  const matches = useMatches<NavStructure>();
  const searchType = matches[0].params?.searchType;
  const itemId = matches[1]?.params?.itemId;
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

  const isMobile = useMobileDetect().isMobile();
  const showBackButton = isMobile && itemId;
  return (
    <div>
      {search && showBackButton ? (
        <>
          <Button
            onClick={() =>
              navigate({
                to: '.',
                search: (old) => ({ ...old, query: search }),
              })
            }>
            Back Button
          </Button>
          <Outlet />
        </>
      ) : (
        <SimpleGrid cols={2}>
          <div>
            {/* <Title
              order={1}
              sx={(theme) => ({
                margin: '20px 0 20px 0',
              })}>
              Search Results
            </Title> */}
            <Text
              color="gray"
              sx={(theme) => ({
                marginTop: 20,
              })}>
              You are searching in the {searchType} category
            </Text>
            <Text color="gray">Showing results for "{search}"</Text>
            {response.isLoading && <p>loading...</p>}
            {response.isError && <TMDBError error={response.error} />}
            {response.isSuccess && (
              <>
                <Pagination
                  total={10}
                  color="orange"
                  size="sm"
                  radius="xs"
                  page={page}
                  onChange={handleChangePage}
                  sx={(theme) => ({
                    margin: '20px 0 25px 0',
                  })}
                />
                <SimpleGrid cols={4}>
                  {response.data.results?.map((result) => (
                    <div key={result.id}>
                      <Link to={`/search/${searchType}/${result.id}`}>
                        <Card shadow="sm" p="xl">
                          <Card.Section>
                            <PosterImage posterPath={result.poster_path} />
                          </Card.Section>

                          <Text
                            weight={500}
                            size="sm"
                            // sx={(theme) => ({
                            //   padding: 10,
                            // })}
                          >
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
          <Outlet />
        </SimpleGrid>
      )}
    </div>
  );
}
