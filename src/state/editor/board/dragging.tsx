import { atom } from 'jotai';
import { Block, blocksAtom } from './blocks';
import { produce } from 'immer';

export const draggingAtom = atom<string | null>(null);

export const draggingBlockAtom = atom<Block | null>((get) => {
  const id = get(draggingAtom);
  const blocks = get(blocksAtom);

  return blocks.find((block) => block.id === id) ?? null;
});

export const raiseAtom = atom(null, (get, set, id: string) => {
  const blocks = get(blocksAtom);

  set(
    blocksAtom,
    produce(blocks, (draft) => {
      let zIndex = 0;

      for (const block of draft) {
        if (block.zIndex > zIndex && block.id !== id) {
          zIndex = block.zIndex;
        }
      }

      const block = draft.find((block) => block.id === id);

      if (block) {
        block.zIndex = zIndex + 1;
      }
    }),
  );
});

export const startDraggingAtom = atom(null, (get, set, id: string) => {
  set(draggingAtom, id);
  set(raiseAtom, id);
});
