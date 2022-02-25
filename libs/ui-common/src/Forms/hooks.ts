import { useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import { useAsyncDebounce } from 'react-table';

export const dirtyAtom = atom(false);

export function useDirty({ isDirty }: { isDirty: boolean }) {
  const [dirty, setDirty] = useAtom(dirtyAtom);
  useEffect(() => {
    setDirty(isDirty);
  }, [isDirty, setDirty]);
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
