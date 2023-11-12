import { atom } from 'jotai';

export interface Viewport {
  width: number;
  height: number;
  top: number;
  left: number;
  zoom: number;
}

export const viewportAtom = atom<Viewport>({
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  zoom: 1,
});

export const resizeViewportAtom = atom(
  null,
  (
    get,
    set,
    size: { width: number; height: number; top: number; left: number },
  ) => {
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
    zoom: Math.min(Math.max(viewport.zoom + delta, 0.2), 2),
  });
});
