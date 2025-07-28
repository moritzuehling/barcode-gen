import { useState } from "react";

export function useStored<T extends object>(defaults: T) {
  const [state, setState] = useState(defaults);

  return new Proxy<T>(state, {
    set(_, p, newValue) {
      setState((old) => ({
        ...old,
        [p]: newValue,
      }));
      return true;
    },
  });
}
