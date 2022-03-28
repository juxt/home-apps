import { Card, Image, ImageProps, Text, Paper, Button } from '@mantine/core';
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
      width={100}
      {...imageProps}
      src={`https://image.tmdb.org/t/p/original/${posterPath}`}
      alt="Movie poster"
    />
  );
}

export function ReviewCard({
  siteSubject,
  reviewHTML,
  devMode,
  score,
  username,
  id,
  handleDeleteFunction,
}: {
  siteSubject?: string | null;
  reviewHTML?: string | null;
  devMode?: boolean | null;
  score: number | null;
  username?: string | null;
  id: string | null;
  // CHANGE THIS
  handleDeleteFunction?: any;
}) {
  return (
    <Card
      shadow="sm"
      p="xl"
      sx={(theme) => ({
        backgroundColor: 'lightgray',
      })}>
      <Text
        weight={700}
        sx={(theme) => ({
          margin: '15px 0 10px 0',
        })}>
        Review by {siteSubject || 'admin'}:
      </Text>
      {reviewHTML && (
        <Paper
          shadow="xs"
          p="md"
          sx={(theme) => ({
            marginBottom: 10,
          })}>
          <Text>{reviewHTML}</Text>
        </Paper>
      )}
      <Text>Score: {score}</Text>
      {(devMode || siteSubject === username) && (
        <Button
          color="orange"
          variant="light"
          onClick={() => handleDeleteFunction(id)}
          sx={(theme) => ({
            marginTop: 10,
          })}>
          Delete
        </Button>
      )}
    </Card>
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
