import { Image, ImageProps } from '@mantine/core';
import axios from 'axios';

export const api_key = '99fdc21a0b0ef55c0cbc002c0ae96fd6';

export function PosterImage({
  posterPath,
  imageProps,
}: {
  posterPath: string | null;
  imageProps?: ImageProps;
}) {
  return (
    <Image
      height={160}
      {...imageProps}
      src={`https://image.tmdb.org/t/p/original/${posterPath}`}
      alt="Movie poster"
    />
  );
}

export const client = axios.create({
  baseURL: 'https://api.themoviedb.org',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
