import { ReviewFieldsFragment } from '@juxt-home/site';
import { MakeGenerics } from '@tanstack/react-location';

export type TSearchResult = {
  // TODO: make union of all possible search result types, e.g. people
  backdrop_path: string | null;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  genre_ids: number[];
  first_air_date?: string;
  poster_path: string | null;
  release_date: string;
  title?: string;
  name?: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type TMovie = {
  id: number;
  backdrop_path: string | null;
  budget: number;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: TCompany[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: {
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type TSeason = {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
};

export type TEpisode = {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  season_number: number;
  show_id: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
};

export type TCompany = {
  name: string;
  id: number;
  logo_path: string | null;
  origin_country: string;
};

export type TTVShow = {
  id: string;
  backdrop_path: string | null;
  created_by: {
    id: number;
    name: string;
    gender: string;
    profile_path: string | null;
  }[];
  episode_run_time: number[];
  first_air_date: string;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: TEpisode;
  name: string;
  networks: TCompany[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: TCompany[];
  seasons: TSeason[];
  status: string;
  type: string;
  vote_average: number;
  vote_count: number;
};

export type AxiosTMDBError = Error & {
  response?: {
    data: {
      errors?: string[];
      status_code?: number;
      status_message?: string;
    };
  };
};

export type TSearchResults<T = TSearchResult> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type TMDBItemResponse = {
  movie_results: TMovie[];
  tv_results: TTVShow[];
};

export type TSearchType = 'movie' | 'tv';

export type TReview = ReviewFieldsFragment;

export type NavStructure = MakeGenerics<{
  Search: {
    query?: string;
    page?: number;
  };
  Params: {
    searchType?: TSearchType;
    itemId?: string;
  };
}>;
