import { useAtomValue, useSetAtom } from 'jotai';
import Button from './Button';
import { Search } from 'react-feather';
import { viewportAtom, zoomViewportAtom } from '@/state/editor/board/viewport';
import Tooltip from './Tooltip';

export default function BoardResetZoomButton() {
  const viewport = useAtomValue(viewportAtom);
  const zoomViewport = useSetAtom(zoomViewportAtom);

  const handleClick = () => {
    zoomViewport(1 - viewport.zoom);
  };

  return (
    <Tooltip tooltip="Zoom">
      <Button
        className={`rounded-full !p-2 ${
          viewport.zoom === 1 ? 'text-white' : ''
        }`}
        colorway={viewport.zoom === 1 ? 'primary' : 'neutral'}
        variant="solid"
        onClick={handleClick}
      >
        <Search size={20} />
      </Button>
    </Tooltip>
  );
}
