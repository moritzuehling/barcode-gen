import React from "react";
import "./App.css";
import { useUnitSize } from "./util/useUnitSize";
import { useStored } from "./util/useStored";
import { PageContent, type PageSetup } from "./PageContent";

function App() {
  const state = useStored<PageSetup>({
    width: 21,
    height: 29.7,
    unit: "cm",
    gridX: 4,
    gridY: 11,

    marginL: 0.8,
    marginR: 0.8,
    marginT: 0.88,
    marginB: 0.88,
    elPadding: 0.2,
    gapX: 0,
    gapY: 0,

    prefix: "ASN-",
    offset: 1,

    includeInfo: true,
    noBorderBrint: true,
  });

  type KeyOfType<T, V> = keyof {
    [P in keyof T as T[P] extends V ? P : never]: unknown;
  };

  function field<T extends KeyOfType<PageSetup, number | string>>(f: T) {
    return {
      value: state[f],
      name: f,
      onChange: (
        ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => {
        const v = ev.currentTarget.value;
        switch (typeof state[f]) {
          case "number":
            state[f] = Number(v) as PageSetup[T];
            break;
          case "string":
            state[f] = v as PageSetup[T];
            break;
          default:
            throw new Error("Wtf?");
        }
      },
    };
  }

  function checkbox<T extends KeyOfType<PageSetup, boolean>>(f: T) {
    return {
      checked: state[f],
      name: f,
      onChange: (ev: React.ChangeEvent<HTMLInputElement>) => {
        state[f] = ev.currentTarget.checked;
      },
    };
  }

  const maxTag =
    state.offset + state.gridX * state.gridY - 1 - (state.includeInfo ? 1 : 0);

  return (
    <>
      <div className="setup">
        <h1>Archive Setup</h1>
        <Group label="Prefix">
          <input type="text" {...field("prefix")} />
        </Group>
        <Group label="Offset">
          Labels <input type="number" {...field("offset")} step={1} /> to
          <button
            onClick={() => {
              state.offset = maxTag + 1;
            }}
          >
            {maxTag}
          </button>
          <button>{">>"}</button>
        </Group>
        <Group label="Archive Tag">
          <label>
            <input type="checkbox" {...checkbox("includeInfo")} />
            Include Archive Tag
          </label>
        </Group>
        <h1>Page Setup</h1>
        <Group label="Paper Size">
          <input type="number" {...field("width")} step={0.1} />
          {" x "}
          <input type="number" {...field("height")} step={0.1} />
          <select {...field("unit")}>
            <option value={"cm"}>cm</option>
            <option value={"in"}>in</option>
          </select>
        </Group>
        <Group label="Grid Size">
          <input type="number" {...field("gridX")} step={1} />
          {" x "}
          <input type="number" {...field("gridY")} step={1} />
          <label>
            <input type="checkbox" {...checkbox("noBorderBrint")} />
            Hide grid lines when printing
          </label>
        </Group>
        <Group label="Margins">
          T: <input type="number" {...field("marginT")} step={0.05} />
          R: <input type="number" {...field("marginR")} step={0.05} />
          B: <input type="number" {...field("marginB")} step={0.05} />
          L: <input type="number" {...field("marginL")} step={0.05} />
        </Group>
        <Group label="Element Padding">
          <input type="number" {...field("elPadding")} step={0.05} />
        </Group>
        <Group label="Gap Between Tags">
          Horizontal: <input type="number" {...field("gapX")} step={0.05} />{" "}
          {state.unit} - Vertical:{" "}
          <input type="number" {...field("gapY")} step={0.05} />
        </Group>
        <Group label="Calculated">
          Width:{" "}
          {(
            (state.width - state.marginL - state.marginR) /
            state.gridX
          ).toPrecision(4)}
          {state.unit} <br />
          Height:{" "}
          {(
            (state.height - state.marginT - state.marginT) /
            state.gridY
          ).toPrecision(4)}
          {state.unit} <br />
        </Group>
      </div>
      <Paper page={state}>
        <PageContent page={state} />
      </Paper>
    </>
  );
}

function Group(p: React.PropsWithChildren<{ label: string }>) {
  return (
    <div className="group">
      <div className="label">{p.label}</div>
      <div className="form-row">{p.children}</div>
    </div>
  );
}

function Paper(props: { page: PageSetup } & React.PropsWithChildren) {
  const p = props.page;
  const unitSize = useUnitSize(p.unit);
  const scale = window.innerHeight / (p.height * unitSize);

  return (
    <div
      className="screen-container"
      style={{
        height: window.innerHeight + "px",
        width: (window.innerHeight * p.width) / p.height + "px",
      }}
    >
      <style
        children={`@page { size: ${p.width}${p.unit} ${p.height}${p.unit}; }`}
      />
      <div
        className="screen"
        style={{
          width: `${p.width}${p.unit}`,
          height: `${p.height}${p.unit}`,
          paddingLeft: `${p.marginL}${p.unit}`,
          paddingRight: `${p.marginR}${p.unit}`,
          paddingTop: `${p.marginT}${p.unit}`,
          paddingBottom: `${p.marginB}${p.unit}`,
          transform: `scale(${scale})`,
        }}
      >
        {props.children}
      </div>
    </div>
  );
}

export default App;
