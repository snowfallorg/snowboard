import { atom } from 'jotai';

export interface Position {
  x: number;
  y: number;
}

export const positionAtom = atom<Position>({
  x: 0,
  y: 0,
});
