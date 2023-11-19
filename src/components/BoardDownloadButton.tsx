import Button from './Button';
import { Download } from 'react-feather';
import Tooltip from './Tooltip';

export default function BoardDownloadButton() {
  const handleClick = () => {
    // TODO: Download the edited nix file.
  };

  return (
    <Tooltip tooltip="Download">
      <Button
        className="rounded-full !p-2"
        colorway="neutral"
        variant="solid"
        onClick={handleClick}
      >
        <Download size={20} />
      </Button>
    </Tooltip>
  );
}
