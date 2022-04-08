import {
  TvFilmReviewInput,
  UpsertReviewMutationVariables,
} from '@juxt-home/site';
import { Card, Button, Text, Title, Group, Badge } from '@mantine/core';
import { RichTextEditor } from '@mantine/rte';
import { Id } from 'react-toastify';
import { PosterImage } from '../common';

export function TvFilmCard({
  title,
  posterPath,
  overview,
  badge1,
  badge2,
  badge3,
}: {
  title: string | null;
  posterPath: string | null;
  overview: string | null;
  badge1?: string | number | null;
  badge2?: string | number | null;
  badge3?: string | number | null;
}) {
  return (
    <Card
      shadow="lg"
      p="xl"
      my="md"
      sx={(theme) => ({
        border: '0.5px solid #e7e8e7',
      })}>
      <Title order={2}>{title}</Title>

      <Card.Section
        sx={(theme) => ({
          margin: '10px 0 20px 0',
        })}>
        <PosterImage posterPath={posterPath} imageProps={{ height: 650 }} />
      </Card.Section>

      <Text size="sm">{overview}</Text>

      <Group
        style={{
          marginTop: 15,
          borderTop: '0.5px solid lightgray',
          paddingTop: 20,
        }}>
        <Badge color="orange" variant="light">
          {badge1}
        </Badge>
        <Badge color="orange" variant="light">
          {badge2}
        </Badge>
        <Badge color="orange" variant="light">
          {badge3}
        </Badge>
      </Group>
    </Card>
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
  handleEditFunction,
}: {
  siteSubject?: string | null;
  reviewHTML?: string | null;
  devMode?: boolean;
  score?: number;
  username?: string | null;
  id: string;
  handleDeleteFunction?: (id: string) => Promise<void>;
  handleEditFunction?: ({
    reviewHTML,
    score,
  }: Partial<TvFilmReviewInput>) => Promise<void>;
}) {
  return (
    <Card
      shadow="lg"
      p="xl"
      sx={(theme) => ({
        border: '0.5px solid #e7e8e7',
      })}>
      <Text weight={700} my="md">
        Review by {siteSubject || 'admin'}:
      </Text>
      {reviewHTML && (
        <RichTextEditor
          readOnly
          my="md"
          value={reviewHTML}
          id="review"
          onChange={() => null}
        />
      )}
      <Text>Score: {score}</Text>
      {(devMode || siteSubject === username) && handleDeleteFunction && (
        <Group position="right">
          {handleEditFunction && (
            <Button
              onClick={() => handleEditFunction({ reviewHTML, score })}
              color="orange"
              variant="light"
              mt="sm">
              Edit
            </Button>
          )}
          <Button
            onClick={() => handleDeleteFunction(id)}
            color="orange"
            variant="light"
            mt="sm">
            Delete
          </Button>
        </Group>
      )}
    </Card>
  );
}
