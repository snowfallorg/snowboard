import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { Parser } from '@snowfallorg/sleet';
import Board from './Board';
import { addBlockAtom, blocksAtom } from '@/state/editor/board/blocks';
import * as Tooltip from '@radix-ui/react-tooltip';
import { EditorError } from '@/state/editor/errors';

export interface EditorProps {
  code: string;
  onChange?: (code: string) => void;
  onError?: (error: EditorError) => void;
}

export default function Editor(props: EditorProps) {
  const { code, onError } = props;

  const setBlocks = useSetAtom(blocksAtom);
  const addBlock = useSetAtom(addBlockAtom);

  useEffect(() => {
    try {
      const parser = new Parser();
      const ast = parser.parse(code);

      setBlocks([]);
      addBlock({
        node: ast,
        width: 0,
        height: 0,
        x: 8,
        y: 8,
      });
    } catch (error) {
      onError?.(EditorError.PARSE_ERROR);
    }

    return () => {
      setBlocks([]);
    };
  }, [code]);

  return (
    <Tooltip.Provider>
      <div className="flex flex-col grow gap-1 laptop:flex-row">
        <div className="grow bg-background rounded">
          <Board />
        </div>
      </div>
    </Tooltip.Provider>
  );
}
