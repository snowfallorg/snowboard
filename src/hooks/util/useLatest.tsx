import { useRef } from 'react';

// NOTE: This return type differs from React's `Ref` type. The upstream `Ref` type
// can potentially be `null` whereas this hook ensures that the value is always set
// on the returned ref.
export default function useLatest<T>(value: T): { current: T } {
  const ref = useRef(value);

  ref.current = value;

  return ref;
}
