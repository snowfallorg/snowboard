import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

export function useRerenderEffect(
  effect: EffectCallback,
  deps?: DependencyList,
) {
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
