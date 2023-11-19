import { AstNode, NodeKind } from '@snowfallorg/sleet';
import { useRef, useState } from 'react';
import BoardBlockContent from './BoardBlockContent';
import { nodeNameToBlockName } from '@/lib/blocks';
import useGetAtomValue from '@/hooks/util/useGetAtomValue';
import { positionAtom } from '@/state/editor/board/position';
import { viewportAtom } from '@/state/editor/board/viewport';
import { useSetAtom } from 'jotai';
import {
  Block,
  addBlockAtom,
  moveBlockAtom,
  relativeMoveBlockAtom,
  removeBlockAtom,
  removeNodeAtom,
} from '@/state/editor/board/blocks';
import BoardSlot from './BoardSlot';
import { draggingAtom } from '@/state/editor/board/dragging';
import useLatest from '@/hooks/util/useLatest';

const DRAG_THRESHOLD = 10;

interface BoardEmbeddedBlockProps {
  block: Block;
  node?: AstNode;
  path: string[];
  name?: string;
  moveable?: boolean;
}

export default function BoardEmbeddedBlock(props: BoardEmbeddedBlockProps) {
  const { block, node, path, moveable = true } = props;

  const rootRef = useRef<HTMLDivElement>(null);
  const [isDetached, setIsDetached] = useState(false);
  const isDetachedRef = useLatest(isDetached);

  const getPosition = useGetAtomValue(positionAtom);
  const getViewport = useGetAtomValue(viewportAtom);
  const getDragging = useGetAtomValue(draggingAtom);

  const addBlock = useSetAtom(addBlockAtom);
  const removeNode = useSetAtom(removeNodeAtom);
  const relativeMoveBlock = useSetAtom(relativeMoveBlockAtom);
  const setDragging = useSetAtom(draggingAtom);

  const handleTitleBarMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button === 1) {
      console.log({ block, node, path });
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    if (event.button !== 0 || !moveable) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const origin = {
      x: event.clientX,
      y: event.clientY,
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!rootRef.current) {
        return;
      }

      const distance = Math.sqrt(
        Math.pow(event.clientX - origin.x, 2) +
          Math.pow(event.clientY - origin.y, 2),
      );

      const draggingBlock = getDragging();
      if (draggingBlock) {
        relativeMoveBlock(draggingBlock, {
          x: event.movementX,
          y: event.movementY,
        });

        return;
      }

      if (!isDetachedRef.current && distance > DRAG_THRESHOLD) {
        const bounds = rootRef.current.getBoundingClientRect();

        const position = getPosition();
        const viewport = getViewport();

        setDragging(
          addBlock({
            node,
            width: bounds.width,
            height: bounds.height,
            x:
              position.x +
              (bounds.left - viewport.left / viewport.zoom) -
              (origin.x - event.clientX),
            y:
              position.y +
              (bounds.top - viewport.top / viewport.zoom) -
              (origin.y - event.clientY),
            zIndex: 0,
          }),
        );

        setIsDetached(true);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'initial';

      if (getDragging()) {
        removeNode(block.id, path);
      }

      setDragging(null);
      setIsDetached(false);
    };

    document.body.style.cursor = 'grabbing';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    console.log(document.body.style.cursor);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {};

  if (!node) {
    return <BoardSlot path={path} block={block} />;
  }

  switch (node.kind) {
    case NodeKind.Expr:
      return (
        <BoardEmbeddedBlock
          block={block}
          node={node.value}
          path={[...path, 'value']}
        />
      );
    case NodeKind.SubExpr:
      return (
        <BoardEmbeddedBlock
          block={block}
          node={node.value}
          path={[...path, 'value']}
        />
      );
    default:
      return (
        <div
          ref={rootRef}
          className={`inline-flex flex-col rounded min-w-[200px] border border-foreground/20 ${
            node.kind === NodeKind.Root
              ? 'bg-secondary text-white'
              : 'bg-background-light'
          }${
            isDetached
              ? '!opacity-10 pointer-events-none !border-foreground/5'
              : ''
          }`}
        >
          <div
            className={`px-4 py-1 rounded-tl rounded-tr font-bold ${
              isDetached ? 'opacity-10' : ''
            }${moveable ? '' : 'cursor-not-allowed'}`}
            onMouseDown={handleTitleBarMouseDown}
          >
            {props.name ?? nodeNameToBlockName[node.kind]}
          </div>
          <hr
            className={`h-[1px] border-none ${
              node.kind === NodeKind.Root
                ? 'bg-background bg-opacity-25'
                : 'bg-foreground bg-opacity-10'
            }`}
          />
          <div
            className={`p-2 text-foreground ${isDetached ? 'opacity-10' : ''}`}
            onMouseDown={handleMouseDown}
          >
            <BoardBlockContent block={block} node={node} path={path} />
          </div>
        </div>
      );
  }
}
