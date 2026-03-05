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

  const entries = p.prefix
    .split("\n")
    .map((a) => a.trim())
    .filter((a) => a);

  const rowsToSkip = Math.floor(p.offset / p.gridX);
  const columnsToSkip = p.offset % p.gridX;

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${p.gridX}, 1fr)`,
        gridTemplateRows: `repeat(${p.gridY}, 1fr)`,
        gap: `${p.gapY}${p.unit} ${p.gapX}${p.unit}`,
      }}
    >
      {rowsToSkip ? (
        <div
          className="skip"
          style={{
            gridRow: `span ${rowsToSkip}`,
            gridColumn: `span ${p.gridX}`,
          }}
        />
      ) : undefined}
      {columnsToSkip ? (
        <div
          className="skip"
          style={{
            gridRow: `span 1`,
            gridColumn: `span ${columnsToSkip}`,
          }}
        />
      ) : undefined}

      {entries.map((_, i) => (
        <div
          className={`barcode tag ${p.noBorderBrint ? "no-border-print" : ""}`}
        >
          {entries[i]}
        </div>
      ))}
    </div>
  );
}
