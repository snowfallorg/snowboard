import { atom } from 'jotai';
import { AstNode } from '@snowfallorg/sleet';
import { createId } from '@paralleldrive/cuid2';
import { viewportAtom } from './viewport';
import { produce } from 'immer';

export interface Block {
  id: string;
  node: AstNode;
  width: number;
  height: number;
  x: number;
  y: number;
}

export const blocksAtom = atom<Block[]>([]);

export const resizeBlockAtom = atom(
  null,
  (get, set, id: string, size: { width?: number; height?: number }) => {
    const blocks = get(blocksAtom);

    set(
      blocksAtom,
      blocks.map((b) => {
        if (b.id !== id) return b;

        return {
          ...b,
          width: size.width ?? b.width,
          height: size.height ?? b.height,
        };
      }),
    );
  },
);

export const moveBlockAtom = atom(
  null,
  (get, set, id: string, position: { x?: number; y?: number }) => {
    const blocks = get(blocksAtom);
    set(
      blocksAtom,
      blocks.map((b) => {
        if (b.id !== id) return b;
        return {
          ...b,
          x: position.x ?? b.x,
          y: position.y ?? b.y,
        };
      }),
    );
  },
);

export const relativeMoveBlockAtom = atom(
  null,
  (get, set, id: string, offset: { x?: number; y?: number }) => {
    const blocks = get(blocksAtom);
    const viewport = get(viewportAtom);

    set(
      blocksAtom,
      blocks.map((b) => {
        if (b.id !== id) return b;
        return {
          ...b,
          x: offset.x ? b.x + offset.x / viewport.zoom : b.x,
          y: offset.y ? b.y + offset.y / viewport.zoom : b.y,
        };
      }),
    );
  },
);

export const addBlockAtom = atom(
  null,
  (get, set, block: Omit<Block, 'id'>): string => {
    const id = createId();

    const blocks = get(blocksAtom);
    set(blocksAtom, [...blocks, { ...block, id }]);

    return id;
  },
);

export const removeBlockAtom = atom(null, (get, set, id: string) => {
  const blocks = get(blocksAtom);
  set(
    blocksAtom,
    blocks.filter((b) => b.id !== id),
  );
});

export const removeNodeAtom = atom(
  null,
  (get, set, id: string, path: string[]) => {
    const blocks = get(blocksAtom);

    set(
      blocksAtom,
      produce(blocks, (draft) => {
        const block = draft.find((b) => b.id === id);

        if (!block) {
          return;
        }

        let node = block.node;
        const last = path[path.length - 1];
        for (const p of path.slice(0, -1)) {
          // @ts-expect-error This is nigh impossible to type.
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          node = node[p];
        }

        if (Array.isArray(node)) {
          node.splice(Number(last), 1);
        } else {
          // @ts-expect-error Delete is okay inside of immer.
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete node[last];
        }
      }),
    );
  },
);
