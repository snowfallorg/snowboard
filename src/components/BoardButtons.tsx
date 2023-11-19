import BoardDownloadButton from './BoardDownloadButton';
import BoardRecenterButton from './BoardRecenterButton';
import BoardResetZoomButton from './BoardResetZoomButton';

export default function BoardButtons() {
  return (
    <div className="absolute bottom-2 right-2 z-10 flex flex-col-reverse gap-2">
      <BoardRecenterButton />
      <BoardResetZoomButton />
      <BoardDownloadButton />
    </div>
  );
}
