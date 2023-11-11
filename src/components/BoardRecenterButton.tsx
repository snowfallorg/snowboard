import { useAtom } from 'jotai';
import Button from './Button';
import { Crosshair } from 'react-feather';
import { positionAtom } from '@/state/editor/board/position';

export default function BoardRecenterButton() {
  const [position, setPosition] = useAtom(positionAtom);

  const handleClick = () => {
    setPosition({
      x: 0,
      y: 0,
    });
  };

  return (
    <Button
      className={`rounded-full !p-2 absolute bottom-2 right-2 ${
        position.x === 0 && position.y === 0 ? '!text-primary' : ''
      }`}
      colorway="neutral"
      variant="text"
      onClick={handleClick}
    >
      <Crosshair />
    </Button>
  );
}
