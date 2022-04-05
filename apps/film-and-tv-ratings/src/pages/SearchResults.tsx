import {
  Link,
  Outlet,
  useMatches,
  useNavigate,
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
  Text,
  SimpleGrid,
  Pagination,
  Button,
  ScrollArea,
  Box,
} from '@mantine/core';
import { useMobileDetect } from '@juxt-home/utils';

async function searchQuery(
  searchTerm: string,
  searchType: TSearchType,
  page = 1,
) {
  const searchUrl = `/3/search/${searchType}?api_key=${api_key}&language=en-US&query=${searchTerm}&page=${page}&include_adult=false`;
  const popularUrl = `/3/${searchType}/popular?api_key=${api_key}&language=en-US&page=${page}`;
  const response = await client.get<TSearchResults>(
    searchTerm.length > 1 ? searchUrl : popularUrl,
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
      {showBackButton ? (
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
        <SimpleGrid
          cols={itemId ? 2 : 1}
          sx={(theme) => ({
            height: '100%',
          })}>
          <div>
            {search ? (
              <>
                <Text
                  color="gray"
                  sx={(theme) => ({
                    marginTop: 20,
                  })}>
                  You are searching in the {searchType} category
                </Text>
                <Text color="gray">Showing results for "{search}"</Text>
              </>
            ) : (
              <Text color="gray">Showing popular results</Text>
            )}
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
                <ScrollArea sx={{ height: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '5px',
                    }}>
                    {response.data.results?.map((result) => (
                      <div key={result.id}>
                        <Link to={`/search/${searchType}/${result.id}`}>
                          <Card
                            shadow="lg"
                            p="xl"
                            sx={(theme) => ({
                              height: '300px',
                              width: '150px',
                              border: '0.5px solid #e7e8e7',
                            })}>
                            <Card.Section>
                              <PosterImage
                                imageProps={{
                                  height: '250px',
                                }}
                                posterPath={result.poster_path}
                              />
                            </Card.Section>

                            <Text weight={500} size="sm">
                              {result?.title || result?.name}
                            </Text>
                          </Card>
                        </Link>
                      </div>
                    ))}
                  </Box>
                </ScrollArea>
              </>
            )}
          </div>
          <Outlet />
        </SimpleGrid>
      )}
    </div>
  );
}
