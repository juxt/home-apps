import { notEmpty } from '@juxt-home/utils';
import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-location';
import { SearchBar, useSearchQuery } from '../components/Search';
import { NavStructure, TSearchResults, TSearchType } from '../types';
import { api_key, client } from '../common';
import { useQuery } from 'react-query';
import {
  Title,
  Button,
  createStyles,
  Header,
  Group,
  Image,
} from '@mantine/core';

async function fetchSuggestions(query: string) {
  const response = await client.get<TSearchResults>(
    `/3/search/trending?query=${query}&api_key=${api_key}`,
  );
  return response.data;
}

function useSuggestions(query = '') {
  return (
    useQuery(['suggestions', query], () => fetchSuggestions(query), {
      staleTime: 1000 * 60 * 60,
    })
      ?.data?.results.map((result) => result?.name || result?.title)
      .filter(notEmpty) ?? []
  );
}

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    position: 'fixed',
  },

  inner: {
    height: 120,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export function Home() {
  const { classes } = useStyles();

  const navigate = useNavigate<NavStructure>();
  const [searchType, setSearchType] = useState('movie');

  const handleChangeType = (type: TSearchType) => {
    setSearchType(type);
    navigate({ to: `/search/${type}` });
  };
  const handleSubmit = () => {
    navigate({
      to: `/search/${searchType}`,
    });
  };
  const [search, setSearch] = useSearchQuery();

  return (
    <div>
      <Header height={120} className={classes.header} mb={120}>
        <div className={classes.inner}>
          <Link to={'/'}>
            <Image height={100} src={'../assets/images/film-app-logo.png'} />
          </Link>
          <Group>
            <Button
              color="orange"
              variant="light"
              onClick={() => handleChangeType('tv')}>
              TV
            </Button>
            <Button
              color="orange"
              variant="light"
              onClick={() => handleChangeType('movie')}>
              Movie
            </Button>
            <SearchBar
              textProps={{
                value: search,
                data: [],
                onChange: setSearch,
                placeholder: `Searching for type: ${searchType}`,
              }}
              buttonProps={{ color: 'orange' }}
              handleSubmit={handleSubmit}
            />
          </Group>
        </div>
      </Header>
    </div>
  );
}

export default Home;
