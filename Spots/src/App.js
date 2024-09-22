import React from "react";
import "./App.css";

const result = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, null],
];

const copy = (table) => {
  const newtable = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) row.push(table[i][j]);
    newtable.push(row);
  }
  return newtable;
};

class Table {
  constructor(table, h = 0, name = "", i = 0, parent = null) {
    this.table = copy(table);
    this.h = h;
    this.i = i;
    this.parent = parent;
    this.name = name;
    this.g = this.getG();
    this.childs = [];
  }

  getG() {
    let g = 8;
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (result[i][j] === this.table[i][j] && result[i][j] !== null) g--;
    return g;
  }

  getNullIndex() {
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++) if (this.table[i][j] === null) return [i, j];
    console.error("getNullIndex");
    return [0, 0];
  }

  getSwap(i1, j1, i2, j2) {
    const newtable = copy(this.table);
    const f = newtable[i1][j1];
    newtable[i1][j1] = newtable[i2][j2];
    newtable[i2][j2] = f;
    return newtable;
  }

  getNext(iter) {
    const tables = [];
    const [i, j] = this.getNullIndex();
    const [iParent, jParent] =
      this.parent === null ? [null, null] : this.parent.getNullIndex();

    if (j > 0 && jParent !== j - 1)
      tables.push(
        new Table(
          this.getSwap(i, j, i, j - 1),
          this.h + 1,
          this.name + "-1",
          iter,
          this
        )
      );
    if (i > 0 && iParent !== i - 1)
      tables.push(
        new Table(
          this.getSwap(i, j, i - 1, j),
          this.h + 1,
          this.name + "-2",
          iter,
          this
        )
      );
    if (j < 2 && jParent !== j + 1)
      tables.push(
        new Table(
          this.getSwap(i, j, i, j + 1),
          this.h + 1,
          this.name + "-3",
          iter,
          this
        )
      );
    if (i < 2 && iParent !== j + 1)
      tables.push(
        new Table(
          this.getSwap(i, j, i + 1, j),
          this.h + 1,
          this.name + "-4",
          iter,
          this
        )
      );
    this.childs = tables;
    return tables;
  }
}

const tableService = (table, iter = 10) => {
  let tables = [table];
  let i = 0;
  let ans = undefined;
  const func = (g, h) => 1000 * g + h;
  while (i < iter) {
    let cur = tables[0];
    for (let i = 1; i < tables.length; i++)
      if (func(tables[i].g, tables[i].h) < func(cur.g, cur.h)) cur = tables[i];
    const next = cur.getNext(i + 1);
    ans = next.find((el) => el.g === 0);
    tables.push(...next);
    tables = tables.filter((t) => t.childs.length === 0);
    i++;
    if (ans !== undefined) return ans;
  }
};

const DrawTable = ({ table }) => {
  const color = `#${`${999999 - 1444 * table.i}`.padStart(6, "0")}`;
  return (
    <table style={{ background: color }}>
      <tbody>
        {table.table.map((row, i) => (
          <tr key={i}>
            {row.map((el, j) => (
              <td key={j} style={{ background: color }}>
                {el}
              </td>
            ))}
          </tr>
        ))}
        <tr>
          <td style={{ fontSize: "10px", background: color }} colSpan={3}>
            <div>{`i=${table.i}; g=${table.g};`}</div>
            <div>{`name=${table.name}`}</div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const DrawTables = ({ table }) => {
  let tables = [table.childs];
  while (tables[tables.length - 1].length !== 0) {
    const newRow = [];
    tables[tables.length - 1].forEach((element) => {
      newRow.push(...element.childs);
    });
    tables.push(newRow);
  }
  tables = [[table], ...tables];
  const lines = [];
  for (let i = 0; i < tables.length - 1; i++) {
    const l = [];
    for (let j = 0; j < tables[i + 1].length; j++) {
      const parent = tables[i + 1][j].parent;
      const parentIndex = tables[i].indexOf(parent);
      if (parentIndex !== -1) l.push([parentIndex, j]);
    }
    lines.push(l);
  }
  return (
    <div>
      {tables.map((tbs, index) => (
        <div key={index}>
          <div>
            <svg
              height={"50px"}
              viewBox={`0 0 10000 50`}
              xmlns="http://www.w3.org/2000/svg"
            >
              {(index === 0 ? [] : lines[index - 1]).map((l) => (
                <line
                  x1={`${32 + l[0] * 63}`}
                  y1="0"
                  x2={`${32 + l[1] * 63}`}
                  y2="50"
                  stroke="black"
                />
              ))}
            </svg>
          </div>
          <div style={{ display: "flex" }}>
            {tbs.map((table, i) => (
              <DrawTable key={i} table={table} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  // const startTable = [
  //   [2, 4, 3],
  //   [1, 8, 5],
  //   [7, null, 6],
  // ];

  const startTable = [
    [null, 8, 7],
    [6, 5, 4],
    [3, 2, 1],
  ];
  const start = new Table(startTable, 0, "t");
  console.log(tableService(start, 1000));
  return (
    <div>
      <DrawTables table={start} />
    </div>
  );
};

export default App;
