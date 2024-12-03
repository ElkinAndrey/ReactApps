import React from "react";

const th = [
  "Тип почвы",
  "Температура воздуха",
  "Количество удобрений",
  "Были болезни",
  "Урожайность",
  "№",
];

const params = [
  ["песчаная", "дерново-подзолистая", "чернозём"],
  ["ниже 15", "15-25", "25 и выше"],
  ["мало", "много"],
  ["были", "не было"],
  ["низкая", "средняя", "высокая"],
];

const sumArray = (mas) => {
  let sum = 0;
  for (let i = 0; i < mas.length; i++) {
    sum += mas[i];
  }
  return sum;
};

const getArray = (size, value = () => 0) => {
  const array = [];
  for (let i = 0; i < size; i++) array.push(value());
  return array;
};

const getDoubleArray = (size1, size2) => {
  const array = [];
  for (let i = 0; i < size1; i++) {
    const array2 = [];
    for (let j = 0; j < size2; j++) {
      array2.push(0);
    }
    array.push(array2);
  }
  return array;
};

const minIndex = (mas) => {
  if ((mas?.length ?? 0) === 0) return -1;
  let min = 0;
  for (let i = 1; i < mas.length; i++) {
    if (mas[i] < mas[min]) min = i;
  }
  return min;
};

const deleteItemArray = (array, index) => {
  const newArray = [...array];
  newArray.splice(index, 1);
  return newArray;
};

const cutArray = (productivity, values, index) => {
  const bits = getArray(values[index] + 1, () => []);
  for (let i = 0; i < productivity.length; i++) {
    bits[productivity[i][index]].push(deleteItemArray(productivity[i], index));
  }
  return bits;
};

const getBestNode = (mas, values) => {
  const array = getArray(values.length - 1);
  for (let node = 0; node < values.length - 1; node++) {
    const counts = getDoubleArray(
      values[node] + 1,
      values[values.length - 1] + 1
    );
    for (let i = 0; i < mas.length; i++) {
      counts[mas[i][node]][mas[i][values.length - 1]] += 1;
    }
    const bits = getArray(values[node] + 1);
    for (let i = 0; i < counts.length; i++) {
      const sum = sumArray(counts[i]);
      for (let j = 0; j < counts[i].length; j++) {
        if (counts[i][j] === 0) break;
        bits[i] -= Math.log2(counts[i][j] / sum);
      }
    }
    array[node] = sumArray(bits);
  }
  return minIndex(array);
};

class NodeTree {
  constructor(productivity, values, parent = null, value = null) {
    this.productivity = productivity;
    this.values = values;
    this.parent = parent;
    this.value = value;
    if (productivity.length > 1) {
      this.bestNodeIndex = getBestNode(productivity, values);
      const arrays = cutArray(productivity, values, this.bestNodeIndex);
      const newValues = deleteItemArray(values, this.bestNodeIndex);
      this.nodes = arrays.map(
        (newProductivity, index) =>
          new NodeTree(newProductivity, newValues, this, index)
      );
    }
  }

  getIndex() {
    if (this.bestNodeIndex === undefined) return -1;
    if (this.parent === null) return this.bestNodeIndex;
    let index = this.bestNodeIndex;
    let parent = this.parent;
    while (parent !== null) {
      if (this.bestNodeIndex >= parent.bestNodeIndex) {
        index++;
      }
      parent = parent.parent;
    }
    return index;
  }
}

const DrawNode = ({ node }) => {
  return (
    <div
      style={{
        display: "inline-block",
        margin: "10px",
      }}
    >
      {node.value !== null && (
        <div>{`${params[node.parent.getIndex()][node.value]}`}</div>
      )}
      <div
        style={{
          display: "inline-block",
          border: "1px solid red",
        }}
      >
        <div
          style={{
            display: "inline-block",
            margin: "10px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              border: "5px solid black",
            }}
          >
            {node.getIndex() !== -1 && (
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>{`${
                th[node.getIndex()]
              }`}</div>
            )}
            <div style={{ whiteSpace: "nowrap" }}>
              {(node.productivity ?? [])
                .map(
                  (p) =>
                    `${params[params.length - 1][p[p.length - 2]]} (№${
                      p[p.length - 1]
                    })`
                )
                .join(", ")}
            </div>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          {(node.nodes ?? []).map((n, index) => (
            <div key={index}>
              <DrawNode node={n} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  // Урожайность (низкая (0), средняя (1), высокая (2))
  // Тип почвы (песчаная (0), дерново-подзолистая (1), чернозём (2))
  // Температура воздуха (ниже 15 (0), 15-25 (1), 25 и выше (2))
  // Количество удобрений (мало (0), много (1))
  // Были болезни (были (0), не было (1))
  const values = [2, 2, 1, 1, 2];

  // const productivity = [
  //   [0, 0, 0, 1, 0, 1],
  //   [0, 0, 1, 1, 0, 2],
  //   [0, 1, 0, 1, 0, 3],
  //   [0, 1, 1, 1, 1, 4],
  //   [0, 2, 0, 1, 0, 5],
  //   [0, 2, 1, 1, 1, 6],
  //   [1, 0, 0, 1, 0, 7],
  //   [1, 0, 1, 1, 1, 8],
  //   [1, 1, 0, 1, 1, 9],
  //   [1, 1, 1, 1, 2, 10],
  //   [1, 2, 0, 1, 1, 11],
  //   [1, 2, 1, 1, 2, 12],
  //   [2, 0, 0, 1, 1, 13],
  //   [2, 0, 1, 1, 2, 14],
  //   [2, 1, 0, 1, 2, 15],
  //   [2, 1, 1, 1, 2, 16],
  //   [2, 2, 0, 1, 2, 17],
  //   [2, 2, 1, 1, 2, 18],
  //   [2, 0, 0, 0, 0, 19],
  // ];

  const productivity = [
    [0, 1, 0, 1, 0, 1],
    [0, 1, 1, 1, 1, 2],
    [1, 2, 1, 1, 2, 3],
    [0, 0, 1, 1, 0, 4],
    [1, 2, 0, 1, 1, 5],
    [2, 0, 1, 1, 2, 6],
    [0, 0, 0, 1, 0, 7],
    [2, 0, 0, 1, 1, 8],
    [1, 0, 1, 1, 1, 9],
    [2, 0, 0, 0, 0, 10],
    [1, 1, 0, 1, 1, 11],
    [1, 1, 1, 1, 2, 12],
    [2, 1, 0, 1, 2, 13],
    [0, 2, 0, 1, 0, 14],
    [2, 2, 0, 1, 2, 15],
    [1, 0, 0, 1, 0, 16],
    [2, 2, 1, 1, 2, 17],
    [0, 2, 1, 1, 1, 18],
    [2, 1, 1, 1, 2, 19],
  ];

  // console.log(getBestNode(productivity, values));
  // cutArray(productivity, values, 0);

  const node = new NodeTree(productivity, values);
  console.log(node);

  return (
    <div>
      <table>
        <thead>
          <tr>
            {th.map((item, index) => (
              <th key={index}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productivity.map((p, i) => (
            <tr key={i}>
              {p.map((item, j) => (
                <td key={j}>{j === p.length - 1 ? item : params[j][item]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <DrawNode node={node} />
    </div>
  );
};

export default App;
