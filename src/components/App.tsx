import { useFile } from '@/state/app/file';
import Editor from './Editor';
import Header from './Header';
import AppEmpty from './AppEmpty';

export default function App() {
  const file = useFile();

  console.log({ file });

  return (
    <div className="flex flex-col grow bg-background-dark text-foreground font-sans relative overflow-x-hidden overflow-y-auto">
      <Header />
      <div className="grow flex px-2 pb-2">
        {file ? <Editor /> : <AppEmpty />}
      </div>
    </div>
  );
}
