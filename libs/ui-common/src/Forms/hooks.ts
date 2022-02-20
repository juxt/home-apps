import { useEffect } from 'react';
import { atom, useAtom } from 'jotai';

export const dirtyAtom = atom(false);

export function useDirty({ isDirty }: { isDirty: boolean }) {
  const [dirty, setDirty] = useAtom(dirtyAtom);
  useEffect(() => {
    setDirty(isDirty);
  }, [isDirty, setDirty]);
  return [dirty, setDirty];
}
