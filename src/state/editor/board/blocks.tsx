import { atom } from 'jotai';
import { AstNode } from '@snowfallorg/sleet';

export interface Block {
  node: AstNode;
  width: number;
  height: number;
  x: number;
  y: number;
}

export const blocksAtom = atom<Block[]>([]);

export const resizeBlockAtom = atom(
  null,
  (get, set, block: Block, size: { width?: number; height?: number }) => {
    const blocks = get(blocksAtom);

    set(
      blocksAtom,
      blocks.map((b) => {
        if (b !== block) return b;

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
  (get, set, block: Block, position: { x?: number; y?: number }) => {
    const blocks = get(blocksAtom);
    set(
      blocksAtom,
      blocks.map((b) => {
        if (b !== block) return b;
        return {
          ...b,
          x: position.x ?? b.x,
          y: position.y ?? b.y,
        };
      }),
    );
  },
);
