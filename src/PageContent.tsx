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

      <USBLabel f={["pd", "dp"]}>C-C</USBLabel>
      <USBLabel f={["pd", "dp"]}>C-C</USBLabel>
      <USBLabel f={["pd", "dp"]}>C-C</USBLabel>
      <USBLabel f={["pd"]}>C-C</USBLabel>
      <USBLabel f={["pd"]}>C-C</USBLabel>
      <USBLabel f={[]}>C/A-C</USBLabel>
      <USBLabel f={["3.0"]}>C-A</USBLabel>
      <USBLabel f={["3.0"]}>C-A</USBLabel>
      <USBLabel f={[]}>C-A</USBLabel>
      <USBLabel f={[]}>C-A</USBLabel>
      <USBLabel f={[]}>µB-A</USBLabel>
      <USBLabel f={[]}>µB-A</USBLabel>
      <USBLabel f={[]}>µB-A</USBLabel>
      <USBLabel f={[]}>µB-A</USBLabel>
    </div>
  );
}

function USBLabel(props: { children: string; f?: string[] }) {
  const [from, to] = props.children.split("-");
  return (
    <div className={`barcode tag no-border-print`}>
      <div className="rotated">
        {from}-{to}
        {(props.f?.length ?? 0) > 0 && (
          <div className="rtag">
            {props.f?.map((a) => (
              <span>{a}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
