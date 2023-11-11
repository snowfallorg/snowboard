import {
  Block,
  moveBlockAtom,
  resizeBlockAtom,
} from '@/state/editor/board/blocks';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { viewportAtom } from '@/state/editor/board/viewport';
import { useAtomValue, useSetAtom } from 'jotai';
import { positionAtom } from '@/state/editor/board/position';
import useLatest from '@/hooks/util/useLatest';
import { NodeKind } from '@snowfallorg/sleet';
import useGetAtomValue from '@/hooks/util/useGetAtomValue';
import BoardEmbeddedBlock from './BoardEmbeddedBlock';

export const VISIBLE_AREA_PADDING = 20;

export interface BoardBlockProps {
  block: Block;
}

export default function BoardBlock(props: BoardBlockProps) {
  const { block } = props;

  const rootRef = useRef<HTMLDivElement>(null);
  const viewport = useAtomValue(viewportAtom);
  const position = useAtomValue(positionAtom);
  const getViewport = useGetAtomValue(viewportAtom);
  const resizeBlock = useSetAtom(resizeBlockAtom);
  const moveBlock = useSetAtom(moveBlockAtom);

  const blockRef = useLatest(block);

  const [isVisible, setIsVisible] = useState(true);

  useLayoutEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const root = rootRef.current;

    const onResize = () => {
      const bounds = root.getBoundingClientRect();
      resizeBlock(blockRef.current, {
        width: bounds.width,
        height: bounds.height,
      });
    };

    onResize();

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [resizeBlock, blockRef]);

  useEffect(() => {
    // check if the block is within the visible area using block.width, block.height, block.x, block.y
    // and viewport and position.
    if (block.width === 0 || block.height === 0) {
      return;
    }

    const visibleArea = {
      x: position.x - VISIBLE_AREA_PADDING,
      y: position.y - VISIBLE_AREA_PADDING,
      width: (viewport.width + VISIBLE_AREA_PADDING * 2) / viewport.zoom,
      height: (viewport.height + VISIBLE_AREA_PADDING * 2) / viewport.zoom,
    };

    if (block.x + block.width < visibleArea.x) {
      setIsVisible(false);
      return;
    }

    if (block.y + block.height < visibleArea.y) {
      setIsVisible(false);
      return;
    }

    if (block.x > visibleArea.x + visibleArea.width) {
      setIsVisible(false);
      return;
    }

    if (block.y > visibleArea.y + visibleArea.height) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
  }, [block, position, viewport]);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    // translate the block relative to the current position
    rootRef.current.style.transform = `translate(${block.x - position.x}px, ${
      block.y - position.y
    }px)`;
  }, [blockRef, block, position, viewport]);

  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.button !== 2) {
      event.stopPropagation();
    }
  };

  const handleTitleBarMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (event.button === 2) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      document.body.style.cursor = 'grabbing';

      const handleMove = (event: MouseEvent) => {
        const viewport = getViewport();

        moveBlock(blockRef.current, {
          x: blockRef.current.x + event.movementX / viewport.zoom,
          y: blockRef.current.y + event.movementY / viewport.zoom,
        });
      };

      const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'initial';
      };

      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [blockRef, getViewport, moveBlock],
  );

  const renderContent = () => {
    switch (block.node.kind) {
      case NodeKind.Root:
        // If there's not a sub expression here, we should keep the slot empty.
        if (block.node.value.value.kind !== NodeKind.SubExpr) {
          return (
            <div className="min-h-[50px] bg-background bg-opacity-30 rounded py-1 px-2 flex items-center justify-center"></div>
          );
        }

        return (
          <div className="min-h-[50px] rounded py-1 px-2 flex items-center justify-center">
            <BoardEmbeddedBlock
              node={block.node.value.value.value}
              path={['value', 'value', 'value']}
            />
          </div>
        );
      case NodeKind.Comment:
      case NodeKind.Expr:
      case NodeKind.UnaryExpr:
      case NodeKind.BinaryExpr:
      case NodeKind.SubExpr:
      case NodeKind.Conditional:
      case NodeKind.Modifier:
      case NodeKind.LetIn:
      case NodeKind.Import:
      case NodeKind.Fallback:
      case NodeKind.Identifier:
      case NodeKind.Null:
      case NodeKind.Int:
      case NodeKind.Float:
      case NodeKind.Bool:
      case NodeKind.String:
      case NodeKind.Path:
      case NodeKind.Attrs:
      case NodeKind.Attr:
      case NodeKind.List:
      case NodeKind.Fn:
      case NodeKind.FnParams:
      case NodeKind.FnParam:
      case NodeKind.FnCall:
      case NodeKind.Has:
      case NodeKind.Eq:
      case NodeKind.EqEq:
      case NodeKind.NotEq:
      case NodeKind.Not:
      case NodeKind.Lt:
      case NodeKind.Lte:
      case NodeKind.Gt:
      case NodeKind.Gte:
      case NodeKind.Add:
      case NodeKind.Sub:
      case NodeKind.Mul:
      case NodeKind.Div:
      case NodeKind.Imp:
      case NodeKind.Update:
      case NodeKind.Concat:
      case NodeKind.Or:
      case NodeKind.And:
      case NodeKind.Period:
      case NodeKind.Interp:
      default:
        return (
          <div className="min-h-[50px] bg-background bg-opacity-30 rounded py-1 px-2 flex items-center justify-center">
            Unsupported
          </div>
        );
    }
  };

  return (
    <div
      ref={rootRef}
      className={`inline-flex flex-col rounded-md min-w-[200px] bg-background-light border border-foreground/20 overflow-hidden ${
        isVisible ? '' : 'hidden'
      }`}
    >
      <div
        className={`px-4 py-1 font-bold ${
          block.node.kind === NodeKind.Root ? 'bg-secondary text-white' : ''
        }`}
        onMouseDown={handleTitleBarMouseDown}
      >
        {props.block.node.kind}
      </div>
      <hr className="h-[1px] border-none bg-foreground bg-opacity-10" />
      <div className="p-2 text-foreground" onMouseDown={handleMouseDown}>
        {renderContent()}
      </div>
    </div>
  );
}
