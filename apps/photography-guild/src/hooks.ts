import { useQuery, UseQueryOptions } from 'react-query';

const POSITIONSTACK_API_KEY = '20cf0a250943e36a5e260d16e62637c9';

type PositionstackResult = {
  latitude: string;
  longitude: string;
  country: string;
  country_code: string;
  neighborhood: string;
  region: string;
  region_code: string;
  postal_code: string;
  locality: string;
  label: string;
  name: string;
  type: string;
  distance: string;
  confidence: string;
  administrative_area: string;
  map_url: string;
};

type JSONResponse = {
  data: PositionstackResult[];
};

async function fetchLocation(
  lat: string,
  long: string,
): Promise<PositionstackResult> {
  const response = await fetch(
    `http://api.positionstack.com/v1/reverse?access_key=${POSITIONSTACK_API_KEY}&query=${lat},${long}&limit=1`,
  );
  const { data }: JSONResponse = await response.json();
  return data[0];
}

export const useLocationQuery = <TData = PositionstackResult, TError = Error>(
  lat?: number | string,
  long?: number | string,
  options?: UseQueryOptions<PositionstackResult, TError, TData>,
) =>
  useQuery<PositionstackResult, TError, TData>(
    ['Location', `${lat},${long}`],
    () => fetchLocation(lat?.toString() || '', long?.toString() || ''),
    { ...options, enabled: !!lat && !!long, staleTime: Infinity },
  );
