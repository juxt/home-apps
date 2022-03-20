import { useQuery } from 'react-query';
import { api_key, client } from '../common';
import { AxiosTMDBError, TTVShow } from '../types';

async function fetchTvShowById(id: string) {
  const response = await client.get<TTVShow>(
    `/3/tv/${id}?api_key=${api_key}&language=en-US`,
  );
  return response.data;
}

function useTvById(id = '') {
  return useQuery<TTVShow, AxiosTMDBError>(
    ['movie', id],
    () => fetchTvShowById(id),
    {
      enabled: !!id,
    },
  );
}

export function TvShow() {
  return <h1>TvShow page</h1>;
}
