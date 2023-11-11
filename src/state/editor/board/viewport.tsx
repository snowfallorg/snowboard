import { atom } from 'jotai';

export interface Viewport {
  width: number;
  height: number;
  zoom: number;
}

export const viewportAtom = atom<Viewport>({
  width: 0,
  height: 0,
  zoom: 1,
});

export const resizeViewportAtom = atom(
  null,
  (get, set, size: { width: number; height: number }) => {
    const viewport = get(viewportAtom);

    set(viewportAtom, {
      ...viewport,
      ...size,
    });
  },
);

export const zoomViewportAtom = atom(null, (get, set, delta: number) => {
  const viewport = get(viewportAtom);

  set(viewportAtom, {
    ...viewport,
    zoom: Math.min(Math.max(viewport.zoom + delta, 0.5), 2),
  });
});
