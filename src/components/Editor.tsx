import Board from './Board';

export default function Editor() {
  return (
    <div className="flex flex-col grow gap-1 laptop:flex-row">
      <div className="grow bg-background rounded">
        <Board />
      </div>
      <div className="grow max-h-64 bg-background rounded laptop:max-h-full laptop:max-w-sm"></div>
    </div>
  );
}
