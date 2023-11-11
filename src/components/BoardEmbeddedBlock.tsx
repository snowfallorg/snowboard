import { AstNode, NodeKind } from '@snowfallorg/sleet';
import { useRef } from 'react';
import BoardBlockContent from './BoardBlockContent';
import { nodeNameToBlockName } from '@/lib/blocks';

interface BoardEmbeddedBlockProps {
  node: AstNode;
  path: string[];
}

export default function BoardEmbeddedBlock(props: BoardEmbeddedBlockProps) {
  const { node, path } = props;

  const rootRef = useRef<HTMLDivElement>(null);

  const handleTitleBarMouseDown = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {};

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {};

  switch (node.kind) {
    case NodeKind.Expr:
      return <BoardEmbeddedBlock node={node.value} path={[...path, 'value']} />;
    case NodeKind.SubExpr:
      return <BoardEmbeddedBlock node={node.value} path={[...path, 'value']} />;
    default:
      return (
        <div
          ref={rootRef}
          className={`inline-flex flex-col rounded min-w-[200px] border border-foreground/20 ${
            node.kind === NodeKind.Root
              ? 'bg-secondary text-white'
              : 'bg-background-light'
          }`}
        >
          <div
            className="px-4 py-1 rounded-tl rounded-tr font-bold"
            onMouseDown={handleTitleBarMouseDown}
          >
            {nodeNameToBlockName[node.kind]}
          </div>
          <hr
            className={`h-[1px] border-none ${
              node.kind === NodeKind.Root
                ? 'bg-background bg-opacity-25'
                : 'bg-foreground bg-opacity-10'
            }`}
          />
          <div className="p-2 text-foreground" onMouseDown={handleMouseDown}>
            <BoardBlockContent node={node} path={path} />
          </div>
        </div>
      );
  }
}
