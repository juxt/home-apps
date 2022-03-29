import { Card, Button, Text } from '@mantine/core';
import RichTextEditor from '@mantine/rte';

// export function TvFilmCard() {}

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
  devMode?: boolean;
  score: number;
  username?: string | null;
  id: string;
  handleDeleteFunction?: (id: string) => Promise<void>;
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
        <RichTextEditor
          readOnly
          value={reviewHTML}
          id="review"
          onChange={() => null}
        />
      )}
      <Text>Score: {score}</Text>
      {(devMode || siteSubject === username) && handleDeleteFunction && (
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
