import useGetAtomValue from '@/hooks/util/useGetAtomValue';
import { positionAtom } from '@/state/editor/board/position';
import { viewportAtom } from '@/state/editor/board/viewport';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { MouseEvent, useCallback, useLayoutEffect, useRef } from 'react';
import BoardBackground from './BoardBackground';
import BoardRecenterButton from './BoardRecenterButton';

export default function Board() {
  const rootRef = useRef<HTMLDivElement>(null);

  const [viewport, setViewport] = useAtom(viewportAtom);
  const setPosition = useSetAtom(positionAtom);
  const getViewport = useGetAtomValue(viewportAtom);
  const getPosition = useGetAtomValue(positionAtom);

  useLayoutEffect(() => {
    const onResize = () => {
      if (!rootRef.current) {
        return;
      }

      const bounds = rootRef.current.getBoundingClientRect();

      setViewport({
        width: bounds.width,
        height: bounds.height,
      });
    };

    window.addEventListener('resize', onResize);

    onResize();

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [setViewport]);

  const handleMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
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

      const handleMouseMove = (event: globalThis.MouseEvent) => {
        const position = getPosition();

        setPosition({
          x: position.x + event.movementX,
          y: position.y + event.movementY,
        });
      };

      const handleMouseUp = () => {
        root.removeEventListener('mousemove', handleMouseMove);
        document.body.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'initial';
      };

      rootRef.current.addEventListener('mousemove', handleMouseMove);

      document.body.addEventListener('mouseup', handleMouseUp);
    },
    [getPosition, setPosition],
  );

  const isSizeUpdated = viewport.width !== 0 && viewport.height !== 0;

  return (
    <div
      ref={rootRef}
      className="w-full h-full relative isolate"
      onMouseDown={handleMouseDown}
    >
      <BoardRecenterButton />
      {isSizeUpdated ? <BoardBackground /> : null}
    </div>
  );
}
