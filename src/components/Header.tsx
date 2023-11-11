import { File, Star } from 'react-feather';
import Button from './Button';
import ThemeSelector from './ThemeSelector';
import { fileAtom } from '@/state/app/file';
import { useSetAtom } from 'jotai';

export default function Header() {
  const setFile = useSetAtom(fileAtom);

  const handleNew = () => {};

  const handleOpen = () => {
    const input = document.createElement('input');
    // Only accept a single .nix file
    input.type = 'file';
    input.accept = '.nix';
    input.multiple = false;

    input.style.display = 'none';
    document.body.appendChild(input);

    input.addEventListener('change', (event) => {
      const element = event.target as HTMLInputElement;
      const files = element.files;

      if (!files || files.length === 0) {
        return;
      }

      const file = files[0];

      const reader = new FileReader();
      reader.onload = (event) => {
        const contents = event.target?.result;

        if (typeof contents === 'string') {
          setFile({
            path: file.name,
            text: contents,
          });
        }
      };

      reader.readAsText(file);
    });

    input.click();

    document.body.removeChild(input);
  };

  return (
    <header className="flex justify-between items-center bg-background-dark text-foreground font-sans px-2 py-1">
      <div className="flex items-center gap-2">
        <span className="text-md font-bold">Snowboard</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="text" colorway="neutral" onClick={handleNew}>
          <Star size={18} />
          New
        </Button>
        <Button variant="text" colorway="neutral" onClick={handleOpen}>
          <File size={18} />
          Open
        </Button>
        <ThemeSelector />
      </div>
    </header>
  );
}
