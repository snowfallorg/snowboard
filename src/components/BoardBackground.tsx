import useGetAtomValue from '@/hooks/util/useGetAtomValue';
import useLatest from '@/hooks/util/useLatest';
import { positionAtom } from '@/state/editor/board/position';
import { viewportAtom } from '@/state/editor/board/viewport';
import { useLayoutEffect, useRef } from 'react';

export const BASE_BOARD_OFFSET = 16;

export interface BoardBackgroundProps {
  size?: number;
  gap?: number;
}

export default function BoardBackground(props: BoardBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const getViewport = useGetAtomValue(viewportAtom);
  const getPosition = useGetAtomValue(positionAtom);

  const sizeRef = useLatest(props.size ?? 4);
  const gapRef = useLatest(props.gap ?? 40);

  useLayoutEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    let isUnmounted = false;

    const render = () => {
      if (isUnmounted) {
        return;
      }

      const size = sizeRef.current;
      const gap = gapRef.current;

      const viewport = getViewport();
      const position = getPosition();

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const color =
        getComputedStyle(canvas).getPropertyValue('--color-foreground');

      const xOffset = position.x % gap;
      const yOffset = position.y % gap;

      // NOTE: We intentionally overscan to ensure that dots on the edges don't
      // cause flicker.
      const columns = Math.ceil(viewport.width / gap) + 3;
      const rows = Math.ceil(viewport.height / gap) + 3;

      ctx.clearRect(0, 0, viewport.width, viewport.height);
      ctx.fillStyle = `rgba(${color}, 0.5)`;

      // draw a dot for each cell
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          ctx.beginPath();

          ctx.ellipse(
            row * gap + xOffset - gap + BASE_BOARD_OFFSET,
            column * gap + yOffset - gap + BASE_BOARD_OFFSET,
            size / 2,
            size / 2,
            0,
            0,
            Math.PI * 2,
          );

          ctx.fill();

          ctx.closePath();
        }
      }

      requestAnimationFrame(render);
    };

    render();

    return () => {
      isUnmounted = true;
    };
  }, [getViewport, getPosition]);

  return (
    <div className="absolute inset-0 w-full h-full rounded overflow-hidden z-[-1]">
      <canvas ref={canvasRef} />
    </div>
  );
}
