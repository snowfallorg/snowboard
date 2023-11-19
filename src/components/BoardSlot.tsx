import useGetAtomValue from '@/hooks/util/useGetAtomValue';
import useLatest from '@/hooks/util/useLatest';
import {
  Block,
  blocksAtom,
  insertNodeAtom,
  removeBlockAtom,
} from '@/state/editor/board/blocks';
import { draggingAtom, draggingBlockAtom } from '@/state/editor/board/dragging';
import { NodeKind } from '@snowfallorg/sleet';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';

export interface BoardSlotProps {
  path: string[];
  block: Block;
  allow?: NodeKind[];
}

export default function BoardSlot(props: BoardSlotProps) {
  const { path, block, allow = [] } = props;

  const rootRef = useRef<HTMLDivElement>(null);

  const dragging = useAtomValue(draggingAtom);
  const [isDroppable, setIsDroppable] = useState(false);

  const insertNode = useSetAtom(insertNodeAtom);
  const removeBlock = useSetAtom(removeBlockAtom);

  const draggingBlock = useAtomValue(draggingBlockAtom);

  const isAllowed =
    allow.length === 0 ||
    (draggingBlock && allow.includes(draggingBlock.node.kind));

  useEffect(() => {
    if (!dragging) {
      return;
    }

    if (!draggingBlock || !isAllowed) {
      return;
    }

    const handleMouseUp = (event: MouseEvent) => {
      if (!rootRef.current) {
        return;
      }

      const bounds = rootRef.current.getBoundingClientRect();

      if (
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom
      ) {
        insertNode(block.id, path, draggingBlock.node);
        removeBlock(dragging);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!rootRef.current) {
        return;
      }

      const bounds = rootRef.current.getBoundingClientRect();

      if (
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom
      ) {
        setIsDroppable(true);
      } else {
        setIsDroppable(false);
      }
    };

    document.body.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseup', handleMouseUp);

    return () => {
      setIsDroppable(false);
      document.body.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      ref={rootRef}
      className={`grow min-h-[92px] min-w-[150px] bg-background bg-opacity-30 rounded py-1 px-2 flex items-center justify-center border border-transparent transition-colors text-foreground-light ${
        isAllowed && dragging ? '!border-primary' : ''
      } ${isDroppable ? '!bg-primary !text-white' : ''}`}
      onClick={() => {
        console.log(`Block Node Deleted: node.${path.join('.')}`);
      }}
    >
      {isDroppable ? 'Drop To Place' : 'Empty Slot'}
    </div>
  );
}
