import { AstNode } from '@snowfallorg/sleet';

export const nodeNameToBlockName: Record<AstNode['kind'], string> = {
  Root: 'Root',
  Attrs: 'Attributes',
  Attr: 'Attribute',
  Identifier: 'Identifier',
  String: 'String',
  Bool: 'Boolean',
} as const;
