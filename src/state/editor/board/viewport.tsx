import { atom } from 'jotai';

export interface Viewport {
  width: number;
  height: number;
}

export const viewportAtom = atom<Viewport>({
  width: 0,
  height: 0,
});
