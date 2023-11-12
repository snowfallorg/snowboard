import useGetAtomValue from '@/hooks/util/useGetAtomValue';
import { positionAtom } from '@/state/editor/board/position';
import {
  resizeViewportAtom,
  viewportAtom,
  zoomViewportAtom,
} from '@/state/editor/board/viewport';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useLayoutEffect, useRef } from 'react';
import BoardBackground from './BoardBackground';
import BoardRecenterButton from './BoardRecenterButton';
import BoardBlocks from './BoardBlocks';
import BoardButtons from './BoardButtons';
import BoardDownloadButton from './BoardDownloadButton';
import BoardResetZoomButton from './BoardResetZoomButton';

export default function Board() {
  const rootRef = useRef<HTMLDivElement>(null);

  const viewport = useAtomValue(viewportAtom);
  const setPosition = useSetAtom(positionAtom);
  const getViewport = useGetAtomValue(viewportAtom);
  const getPosition = useGetAtomValue(positionAtom);

  const resizeViewport = useSetAtom(resizeViewportAtom);
  const zoomViewport = useSetAtom(zoomViewportAtom);

  useLayoutEffect(() => {
    const onResize = () => {
      if (!rootRef.current) {
        return;
      }

      const bounds = rootRef.current.getBoundingClientRect();

      resizeViewport({
        width: bounds.width,
        height: bounds.height,
        top: bounds.top,
        left: bounds.left,
      });
    };

    window.addEventListener('resize', onResize);

    onResize();

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [resizeViewport]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.button === 2) {
        event.preventDefault();
      }

      const root = rootRef.current;

      if (!root) {
        return;
      }

      if (event.currentTarget !== root) {
        return;
      }

      document.body.style.cursor = 'grabbing';

      event.preventDefault();
      event.stopPropagation();

      const handleMouseMove = (event: MouseEvent) => {
        const position = getPosition();

        const viewport = getViewport();

        setPosition({
          x: position.x + -event.movementX / viewport.zoom,
          y: position.y + -event.movementY / viewport.zoom,
        });
      };

      const handleMouseUp = (event: MouseEvent) => {
        if (event.button === 2) {
          event.preventDefault();
        }

        root.removeEventListener('mousemove', handleMouseMove);
        document.body.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'initial';
      };

      rootRef.current.addEventListener('mousemove', handleMouseMove);

      document.body.addEventListener('mouseup', handleMouseUp);
    },
    [getPosition, getViewport, setPosition],
  );

  const handleScroll = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      zoomViewport(event.deltaY / 100);
    },
    [zoomViewport],
  );

  const isSizeUpdated = viewport.width !== 0 && viewport.height !== 0;

  return (
    <div
      ref={rootRef}
      className="w-full h-full relative isolate"
      onMouseDown={handleMouseDown}
      onWheel={handleScroll}
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    >
      <BoardBlocks />
      <BoardButtons>
        <BoardRecenterButton />
        <BoardResetZoomButton />
        <BoardDownloadButton />
      </BoardButtons>
      {isSizeUpdated ? <BoardBackground /> : null}
    </div>
  );
}
