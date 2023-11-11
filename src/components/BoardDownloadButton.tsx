import Button from './Button';
import { Download } from 'react-feather';

export default function BoardRecenterButton() {
  const handleClick = () => {
    // TODO: Download the edited nix file.
  };

  return (
    <Button
      className="rounded-full !p-2"
      colorway="neutral"
      variant="solid"
      onClick={handleClick}
    >
      <Download size={20} />
    </Button>
  );
}
