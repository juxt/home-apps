import { notEmpty } from '@juxt-home/utils';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-location';
import { SearchBar, useSearchQuery } from '../components/Search';
import { NavStructure, TSearchResults, TSearchType } from '../types';
import { api_key, client } from '../common';
import { useQuery } from 'react-query';

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
    <>
      <h1>Welcome to the film app</h1>
      <button onClick={() => handleChangeType('tv')}>tv</button>
      <button onClick={() => handleChangeType('movie')}>movie</button>
      <SearchBar
        textProps={{
          value: search,
          data: [],
          onChange: setSearch,
          placeholder: `Searching for type: ${searchType}`,
        }}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default Home;
