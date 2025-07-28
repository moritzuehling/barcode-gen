import JsBarcode from "jsbarcode";
import React, { useLayoutEffect } from "react";

export interface PageSetup {
  width: number;
  height: number;
  unit: "cm" | "in";

  gridX: number;
  gridY: number;

  marginT: number;
  marginR: number;
  marginB: number;
  marginL: number;
  gapX: number;
  gapY: number;

  elPadding: number;

  prefix: string;
  offset: number;

  includeInfo: boolean;
  noBorderBrint: boolean;
}

export function PageContent(props: { page: PageSetup }) {
  const p = props.page;

  const entries = p.gridX * p.gridY + (p.includeInfo ? -1 : 0);

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${p.gridX}, 1fr)`,
        gridTemplateRows: `repeat(${p.gridY}, 1fr)`,
        gap: `${p.gapY}${p.unit} ${p.gapX}${p.unit}`,
      }}
    >
      {p.includeInfo && (
        <div
          className={`barcode contains-tag ${
            p.noBorderBrint ? "no-border-print" : ""
          }`}
        >
          <div>{p.prefix}</div>
          <div className="">
            <b>{p.offset}</b>
            {" to "}
            <b>{p.offset + entries - 1}</b>
          </div>
          <div className="tc">TC: {new Date().toISOString().split("T")[0]}</div>
        </div>
      )}
      {Array(entries)
        .fill(0)
        .map((_, i) => (
          <Barcode
            key={i}
            content={p.prefix + (p.offset + i).toString()}
            padding={p.elPadding + p.unit}
            className={p.noBorderBrint && "no-border-print"}
          />
        ))}
    </div>
  );
}

export function Barcode(props: {
  content: string;
  padding: string;
  className?: string | false;
}) {
  const svg = React.useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    if (!svg.current) {
      return;
    }

    JsBarcode(svg.current, props.content, {
      format: "code128",
    });
  }, [props.content, svg]);

  return (
    <div
      className={`barcode ${props.className ?? ""}`}
      style={{ padding: props.padding }}
    >
      <svg ref={svg} />
    </div>
  );
}
