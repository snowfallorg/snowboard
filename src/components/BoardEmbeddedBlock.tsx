import { AstNode, NodeKind } from '@snowfallorg/sleet';
import { useRef } from 'react';

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

  const renderContent = () => {
    switch (node.kind) {
      case NodeKind.Root:
        // If there's not a sub expression here, we should keep the slot empty.
        if (node.value.value.kind !== NodeKind.SubExpr) {
          return (
            <div className="min-h-[50px] bg-background bg-opacity-30 rounded py-1 px-2 flex items-center justify-center"></div>
          );
        }

        return (
          <div className="min-h-[50px] rounded py-1 px-2 flex items-center justify-center">
            <BoardEmbeddedBlock
              node={node.value.value.value}
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
        {node.kind}
      </div>
      <hr
        className={`h-[1px] border-none ${
          node.kind === NodeKind.Root
            ? 'bg-background bg-opacity-25'
            : 'bg-foreground bg-opacity-10'
        }`}
      />
      <div className="p-2 text-foreground" onMouseDown={handleMouseDown}>
        {renderContent()}
      </div>
    </div>
  );
}
