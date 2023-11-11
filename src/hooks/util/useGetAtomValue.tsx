import { Atom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';

export default function useGetAtomValue<T>(atom: Atom<T>) {
  return useAtomCallback(useCallback((get) => get(atom), [atom]));
}
