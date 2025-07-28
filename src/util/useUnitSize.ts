import React from "react";

export function useUnitSize(unit: string) {
  return React.useMemo(() => {
    const el = document.createElement("div");
    el.style.width = "100" + unit;
    document.body.appendChild(el);
    const w = el.clientWidth / 100;
    el.remove();
    return w;
  }, [unit]);
}
