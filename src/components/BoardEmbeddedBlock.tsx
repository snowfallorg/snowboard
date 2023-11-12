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

const DRAG_THRESHOLD = 10;

interface BoardEmbeddedBlockProps {
  block: Block;
  node?: AstNode;
  path: string[];
  name?: string;
}

export default function BoardEmbeddedBlock(props: BoardEmbeddedBlockProps) {
  const { block, node, path } = props;

  const rootRef = useRef<HTMLDivElement>(null);
  const detachedIdRef = useRef<string | null>(null);
  const [isDetached, setIsDetached] = useState(false);

  const getPosition = useGetAtomValue(positionAtom);
  const getViewport = useGetAtomValue(viewportAtom);

  const addBlock = useSetAtom(addBlockAtom);
  const removeNode = useSetAtom(removeNodeAtom);
  const relativeMoveBlock = useSetAtom(relativeMoveBlockAtom);

  const handleTitleBarMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
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

      if (detachedIdRef.current) {
        relativeMoveBlock(detachedIdRef.current, {
          x: event.movementX,
          y: event.movementY,
        });

        return;
      }

      if (distance > DRAG_THRESHOLD) {
        const bounds = rootRef.current.getBoundingClientRect();

        const position = getPosition();
        const viewport = getViewport();

        detachedIdRef.current = addBlock({
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
        });

        setIsDetached(true);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'initial';

      if (detachedIdRef.current) {
        console.log(block, path);
        removeNode(block.id, path);
      }

      detachedIdRef.current = null;
      setIsDetached(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'grabbing';
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {};

  if (!node) {
    return (
      <div className="min-h-[50px] bg-background bg-opacity-30 rounded py-1 px-2 flex items-center justify-center">
        Block Node Deleted: node.{path.join('.')}
      </div>
    );
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
            }`}
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
