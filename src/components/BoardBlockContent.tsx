import {
  AstNode,
  NodeKind,
  isAttrBinding,
  isInheritBinding,
} from '@snowfallorg/sleet';
import BoardEmbeddedBlock from './BoardEmbeddedBlock';
import Input from './Input';
import Checkbox from './Checkbox';

export interface BoardBlockContentProps {
  node: AstNode;
  path: string[];
}

export default function BoardBlockContent(props: BoardBlockContentProps) {
  const { node, path } = props;

  switch (node.kind) {
    case NodeKind.Root:
      // If there's not a sub expression here, we should keep the slot empty.
      if (node.value.value.kind !== NodeKind.SubExpr) {
        return (
          <div className="min-h-[50px] bg-background bg-opacity-30 rounded py-1 px-2 flex items-center justify-center"></div>
        );
      }

      return (
        <div className="min-h-[50px] rounded py-1 px-2 flex items-start justify-center">
          <BoardEmbeddedBlock
            node={node.value.value.value}
            path={[...path, 'value', 'value', 'value']}
          />
        </div>
      );
    case NodeKind.Attrs:
      return (
        <div className="min-h-[50px] rounded py-1 px-2 flex flex-col items-start justify-center gap-2">
          {node.value.map((attr, i) => (
            <BoardEmbeddedBlock key={i} node={attr} path={[...path, 'value']} />
          ))}
        </div>
      );
    case NodeKind.Attr:
      return (
        <div className="rounded py-1 px-2 flex items-start justify-center gap-2">
          {isAttrBinding(node) ? (
            <>
              <BoardEmbeddedBlock node={node.name} path={[...path, 'name']} />
              <BoardEmbeddedBlock node={node.value} path={[...path, 'value']} />
            </>
          ) : null}
          {isInheritBinding(node) ? 'inherit bindings are unsupported' : null}
        </div>
      );
    case NodeKind.String:
      return (
        <div className="rounded py-1 flex items-start gap-2">
          {node.value.map((part, i) =>
            typeof part === 'string' ? (
              <Input
                key={i}
                value={part}
                size={part.split('\n')[0].length + 1}
                className="grow"
              />
            ) : (
              'interp node not supported'
            ),
          )}
        </div>
      );
    case NodeKind.Identifier:
      return (
        <div className="rounded py-1 flex items-start gap-2">
          {node.value.map((part, i) =>
            typeof part === 'string' ? (
              <Input
                key={i}
                value={part}
                size={part.split('\n')[0].length + 1}
                className="grow"
              />
            ) : (
              `unsupported ${part.kind} node`
            ),
          )}
        </div>
      );
    case NodeKind.Bool:
      return (
        <div className="rounded py-1 flex items-center gap-2">
          <Checkbox checked={node.value} />
          {node.value ? 'True' : 'False'}
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
    case NodeKind.Null:
    case NodeKind.Int:
    case NodeKind.Float:
    case NodeKind.Path:
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
      console.log('unsupported', node);
      return (
        <div className="min-h-[50px] bg-background bg-opacity-30 rounded py-1 px-2 flex items-center justify-center">
          Unsupported: {node.kind}
        </div>
      );
  }
}
