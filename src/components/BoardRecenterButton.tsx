import { useAtom } from 'jotai';
import Button from './Button';
import { Crosshair } from 'react-feather';
import { positionAtom } from '@/state/editor/board/position';
import Tooltip from './Tooltip';

export default function BoardRecenterButton() {
  const [position, setPosition] = useAtom(positionAtom);

  const handleClick = () => {
    setPosition({
      x: 0,
      y: 0,
    });
  };

  return (
    <Tooltip tooltip="Recenter">
      <Button
        className={`rounded-full !p-2 ${
          position.x === 0 && position.y === 0 ? 'text-white' : ''
        }`}
        colorway={position.x === 0 && position.y === 0 ? 'primary' : 'neutral'}
        variant="solid"
        onClick={handleClick}
      >
        <Crosshair size={20} />
      </Button>
    </Tooltip>
  );
}
