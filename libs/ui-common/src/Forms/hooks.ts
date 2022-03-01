import { useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import { useAsyncDebounce } from 'react-table';

export const dirtyAtom = atom(false);

export function useDirty({
  isDirty,
  message = 'are you sure?',
}: {
  isDirty: boolean;
  message?: string;
}) {
  const [dirty, setDirty] = useAtom(dirtyAtom);

  useEffect(() => {
    setDirty(isDirty);
    if (isDirty) {
      console.log('setting');
      window.onbeforeunload = () => message;
    }
    return () => {
      window.onbeforeunload = null;
    };
  }, [isDirty, message, setDirty]);
  return [dirty, setDirty];
}

export const searchAtom = atom('');

export function useGlobalSearch(): [string, (value: string) => void] {
  const [searchValue, setSearchValue] = useAtom(searchAtom);

  const handleSetSearch = useAsyncDebounce((value) => {
    setSearchValue(value);
  }, 200);

  useEffect(() => {
    handleSetSearch(searchValue);
  }, [handleSetSearch, searchValue]);

  return [searchValue, setSearchValue];
}
