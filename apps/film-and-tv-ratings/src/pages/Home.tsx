import { notEmpty } from '@juxt-home/utils';
import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-location';
import { SearchBar, useSearchQuery } from '../components/Search';
import { NavStructure, TSearchResults, TSearchType } from '../types';
import { api_key, client } from '../common';
import { useQuery } from 'react-query';
import { Title, Button } from '@mantine/core';

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

export function Home() {
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
      <Link to={'/'}>
        <Title
          order={1}
          sx={(theme) => ({
            // backgroundColor: 'black',
            color: 'orange',
            marginBottom: 30,
          })}>
          JUXT FILM APP
        </Title>
      </Link>
      <Button
        color="orange"
        variant="light"
        onClick={() => handleChangeType('tv')}
        sx={(theme) => ({
          margin: '0 10px 10px 0',
        })}>
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
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default Home;
