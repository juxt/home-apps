import { useEffect, useState } from 'react';
import { useMatch, useNavigate, useSearch } from 'react-location';
import { SearchBar } from '../components/Search';
import { NavStructure, TSearchType } from '../types';

export function Home() {
  const navigate = useNavigate<NavStructure>();
  const { query } = useSearch<NavStructure>();
  const [searchType, setSearchType] = useState('movie');
  const handleChangeType = (type: TSearchType) => {
    setSearchType(type);
    navigate({ to: `/search/${type}`, search: (old) => ({ ...old }) });
  };
  const [search, setSearch] = useState('');
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log('submit', search, searchType);
    navigate({
      to: `/search/${searchType}`,
      search: { query: search },
    });
  };

  // ensure search bar is filled with query from url incase of page refresh
  useEffect(() => {
    if (query) {
      setSearch(query);
    }
  }, [query]);

  return (
    <>
      <h1>Welcome to the film app</h1>
      <button onClick={() => handleChangeType('tv')}>tv</button>
      <button onClick={() => handleChangeType('movie')}>movie</button>
      <SearchBar
        textProps={{
          value: search,
          onChange: (e) => setSearch(e.target.value),
          placeholder: `Searching for type: ${searchType}`,
        }}
        formProps={{
          onSubmit: handleSubmit,
        }}
      />
    </>
  );
}

export default Home;
