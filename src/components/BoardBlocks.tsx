import { blocksAtom } from '@/state/editor/board/blocks';
import { useAtomValue } from 'jotai';
import BoardBlock from './BoardBlock';
import { viewportAtom } from '@/state/editor/board/viewport';

export default function BoardBlocks() {
  const blocks = useAtomValue(blocksAtom);

  const viewport = useAtomValue(viewportAtom);

  return (
    <div
      className="absolute z-0 w-full h-full inset-0 overflow-hidden"
      style={{
        zoom: viewport.zoom,
      }}
    >
      {blocks.map((block, i) => (
        <BoardBlock key={i} block={block} />
      ))}
    </div>
  );
}
