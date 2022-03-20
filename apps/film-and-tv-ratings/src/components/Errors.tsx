import { AxiosTMDBError } from '../types';
import { Text } from '@mantine/core';

export function TMDBError({ error }: { error: AxiosTMDBError }) {
  return (
    <Text color="red">
      <p>{error.response?.data.status_message}</p>
      {error.response?.data?.errors?.map((error) => (
        <p>{error}</p>
      ))}
      <p>{error.message}</p>
    </Text>
  );
}
