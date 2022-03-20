import { useDebounce, useSubmitOnEnter } from '@juxt-home/utils';
import {
  ActionIconProps,
  ActionIcon,
  useMantineTheme,
  Autocomplete,
  AutocompleteProps,
} from '@mantine/core';
import { useNavigate } from '@tanstack/react-location';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import { Search, ArrowRight, ArrowLeft } from 'tabler-icons-react';
import { NavStructure } from '../types';

const searchParams = new URLSearchParams(window.location.search);
const searchParam = searchParams.get('query') || '';

export const searchAtom = atom(searchParam);

export function useSearchQuery() {
  const res = useAtom(searchAtom);
  const query = useDebounce(res[0], 500);
  const navigate = useNavigate<NavStructure>();
  useEffect(() => {
    if (query.length > 2) {
      navigate({
        replace: true,
        search: (old) => ({
          ...old,
          query,
        }),
      });
    }
  }, [navigate, query]);
  return res;
}

export function SearchBar({
  textProps,
  buttonProps,
  handleSubmit,
}: {
  textProps: AutocompleteProps;
  buttonProps?: Omit<ActionIconProps<'button'>, 'children'>;
  handleSubmit: () => void;
}) {
  const theme = useMantineTheme();
  const ref = useSubmitOnEnter(handleSubmit);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}>
      <Autocomplete
        ref={ref}
        icon={<Search size={18} />}
        radius="xl"
        onItemSubmit={(data) => {
          textProps.onChange?.(data.value);
        }}
        size="md"
        rightSection={
          <ActionIcon
            size={32}
            radius="xl"
            type="submit"
            color={theme.primaryColor}
            variant="filled"
            {...buttonProps}>
            {theme.dir === 'ltr' ? (
              <ArrowRight size={18} />
            ) : (
              <ArrowLeft size={18} />
            )}
          </ActionIcon>
        }
        rightSectionWidth={42}
        {...textProps}
      />
    </form>
  );
}
