import { AstNode } from '@snowfallorg/sleet';

export const nodeNameToBlockName: Record<AstNode['kind'], string> = {
  Root: 'Root',
  Attrs: 'Attributes',
  Attr: 'Attribute',
  Identifier: 'Identifier',
  String: 'String',
  Bool: 'Boolean',
  Fn: 'Function',
  FnParams: 'Parameters',
  LetIn: 'Variables',
} as const;
