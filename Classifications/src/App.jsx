import React, { useEffect, useState } from "react";
import "./App.css";

const signs = [
  "Алкогольный",
  "Горячий",
  "Сладкий",
  "Кислотный",
  "Горький",
  "Свежевыжатый",
  "Густой",
  "Газированный",
];

const baseDemons = [
  { matrix: [0, 1, 0, 0, 1, 0, 0, 0], classification: "Кофе" },
  { matrix: [0, 0, 0, 1, 0, 1, 0, 0], classification: "Апельсиновый сок" },
  { matrix: [0, 0, 1, 0, 0, 0, 0, 1], classification: "Лимонад" },
  { matrix: [0, 0, 1, 0, 0, 1, 1, 0], classification: "Смузи" },
  { matrix: [1, 0, 0, 0, 1, 0, 0, 0], classification: "Водка" },
  { matrix: [0, 1, 1, 0, 0, 0, 0, 0], classification: "Чай с сахаром" },
  { matrix: [0, 0, 1, 0, 0, 0, 0, 1], classification: "Кола" },
  { matrix: [1, 0, 0, 0, 1, 0, 0, 0], classification: "Коньяк" },
];

const baseTrainingData = [
  { matrix: [0, 1, 0, 0, 1, 0, 0, 0], classification: "Кофе" },
  { matrix: [0, 0, 0, 1, 0, 1, 0, 0], classification: "Апельсиновый сок" },
  { matrix: [0, 0, 1, 0, 0, 0, 0, 1], classification: "Лимонад" },
  { matrix: [0, 0, 1, 0, 0, 1, 1, 0], classification: "Смузи" },
  { matrix: [1, 0, 0, 0, 1, 0, 0, 0], classification: "Водка" },
  { matrix: [0, 1, 1, 0, 0, 0, 0, 0], classification: "Чай с сахаром" },
];

const baseMatrix = [
  { matrix: [0, 0, 0, 0, 0, 0, 0, 0], classification: "Кофе" },
  { matrix: [0, 0, 0, 0, 0, 0, 0, 0], classification: "Апельсиновый сок" },
  { matrix: [0, 0, 0, 0, 0, 0, 0, 0], classification: "Лимонад" },
  { matrix: [0, 0, 0, 0, 0, 0, 0, 0], classification: "Смузи" },
  { matrix: [0, 0, 0, 0, 0, 0, 0, 0], classification: "Водка" },
  { matrix: [0, 0, 0, 0, 0, 0, 0, 0], classification: "Чай с сахаром" },
];

const multiplyByMatrix = (m1, m2) => {
  const mas = m2.map((el) => {
    let sum = 0;
    for (let i = 0; i < el.matrix.length; i++) sum += el.matrix[i] * m1[i];
    return { sum: sum, classification: el.classification };
  });
  let el = mas[0];
  for (let i = 0; i < mas.length; i++) {
    if (mas[i].sum > el.sum) el = mas[i];
  }
  return { classification: el.classification, demons: mas };
};

/** Вычитание векторов столбиком */
const columnVectorSubtraction = (matrix) => {
  const vectors = {};
  for (let i = 0; i < matrix.length; i++) {
    vectors[matrix[i].classification] = {};
    for (let j = 0; j < matrix.length; j++) {
      vectors[matrix[i].classification][matrix[j].classification] = 0;
      for (let k = 0; k < matrix[0].matrix.length; k++) {
        vectors[matrix[i].classification][matrix[j].classification] += Math.abs(
          matrix[i].matrix[k] - matrix[j].matrix[k]
        );
      }
    }
  }
  return vectors;
};

const getEquationsSystem = (matrix, signs) => {
  const equations = [];
  const ys = [];
  const xs = [];
  for (let i = 0; i < matrix.length; i++) {
    const y = `Y${i + 1}`;
    equations.push(`${y} =`);
    ys.push(`${y} - ${matrix[i].classification}`);
  }
  for (let i = 0; i < signs.length; i++) {
    const x = `X${i + 1}`;
    xs.push(`${x} - ${signs[i]}`);
    for (let j = 0; j < matrix.length; j++) {
      equations[j] += ` (${matrix[j].matrix[i]})*${x}`;
    }
  }
  return {
    equations,
    ys,
    xs,
  };
};

const cropMatrix = (matrix, axes) => {
  const newMatrix = [];
  for (let i = 0; i < matrix.length; i++) {
    newMatrix.push({
      ...matrix[i],
      matrix: matrix[i].matrix.filter((_, index) => axes.indexOf(index) !== -1),
    });
  }
  return newMatrix;
};

const Table = ({ matrix, matrix2, result = false }) => {
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Алкогольный</th>
          <th>Горячий</th>
          <th>Сладкий</th>
          <th>Кислотный</th>
          <th>Горький</th>
          <th>Свежевыжатый</th>
          <th>Густой</th>
          <th>Газированный</th>
          {result && (
            <React.Fragment>
              <th>Результат</th>
              <th>Демоны</th>
            </React.Fragment>
          )}
        </tr>
      </thead>
      <tbody>
        {matrix.map((row, index) => {
          let classification = "";
          let demons = [];
          if (result) {
            const multiply = multiplyByMatrix(row.matrix, matrix2);
            classification = multiply.classification;
            demons = multiply.demons;
          }
          return (
            <tr key={index}>
              <th>{row.classification}</th>
              {row.matrix.map((el, index2) => (
                <td key={index2}>{el}</td>
              ))}
              {result && (
                <React.Fragment>
                  <td>{classification}</td>
                  <td>
                    <select value={0}>
                      <option value={0}>Демоны</option>
                      {(demons ?? []).map((demon, index) => (
                        <option key={index}>
                          {demon.classification} {demon.sum}
                        </option>
                      ))}
                    </select>
                  </td>
                </React.Fragment>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const MirrorTable = ({ matrix }) => {
  const keys = Object.keys(matrix);
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          {keys.map((value, index) => (
            <th key={index}>{value}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {keys.map((value, index) => (
          <tr key={index}>
            <th>{value}</th>
            {keys.map((value2, index2) => (
              <td key={index2}>{matrix[value][value2]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const matrixSum = (matrix1, matrix2) => {
  return matrix1.map((m, index) => m + matrix2[index]);
};

const matrixDel = (matrix1, matrix2) => {
  return matrix1.map((m, index) => m - matrix2[index]);
};

const App = () => {
  const [trainingData, setTrainingData] = useState([]);
  const [matrix, setMatrix] = useState([...baseMatrix]);

  const addTrain = (iter = 0) => {
    if (iter >= baseTrainingData.length) return;
    setTimeout(() => {
      setTrainingData((state) => [...state, baseTrainingData[iter]]);
      setMatrix((state) => {
        return state.map((m) => {
          if (m.classification === baseTrainingData[iter].classification) {
            return {
              ...m,
              matrix: matrixSum(m.matrix, baseTrainingData[iter].matrix),
            };
          } else {
            return {
              ...m,
              matrix: matrixDel(m.matrix, baseTrainingData[iter].matrix),
            };
          }
        });
      });
      addTrain(iter + 1);
    }, 1000);
  };

  useEffect(() => {
    setTrainingData([]);
    addTrain();
  }, []);

  const { equations, xs, ys } = getEquationsSystem(matrix, signs);
  const threeAxes = [signs[1], signs[4], signs[6]];
  const threeMatrix = cropMatrix(matrix, [1, 4, 6]);
  const {
    equations: threeEquations,
    xs: threeXs,
    ys: threeYs,
  } = getEquationsSystem(threeMatrix, threeAxes);

  return (
    <div>
      <h1>Классификация типов напитков</h1>
      <div>
        <h2>1. Классификация</h2>
        <div>Напитки</div>
      </div>
      <div>
        <h2>2. Классы признаки</h2>
        <div style={{ display: "flex", gap: "20px" }}>
          <div>
            <b>Классы</b>
            <div>Кофе</div>
            <div>Апельсиновый сок</div>
            <div>Лимонад</div>
            <div>Смузи</div>
            <div>Водка</div>
            <div>Чай с сахаром</div>
          </div>
          <div>
            <b>Признаки</b>
            <div>Алкогольный</div>
            <div>Горячий</div>
            <div>Сладкий</div>
            <div>Кислотный</div>
            <div>Горький</div>
            <div>Свежевыжатый</div>
            <div>Густой</div>
            <div>Газированный</div>
          </div>
        </div>
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}
      >
        <h2>3. Обучение</h2>
        <div></div>
        <div>
          <b>Матрица коэффициентов</b>
          <Table matrix={matrix} />
        </div>
        <div>
          <b>Тренировочные данные</b>
          <Table matrix={trainingData} />
        </div>
      </div>
      <div>
        <h2>
          4. Проверить модель. Предъявить к экспертизе ранее неизвестный ей
          класс
        </h2>
        <Table matrix={baseDemons} matrix2={matrix} result={true} />
      </div>
      <div>
        <h2>
          5. Рассчитать вид предметной области по хэминговой мере в «мозгах» и в
          «мире». Показать расстояния между объектами на рисунке
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <div>
            <b>В мозгах</b>
            <MirrorTable matrix={columnVectorSubtraction(matrix)} />
          </div>
          <div>
            <b>В мире</b>
            <MirrorTable matrix={columnVectorSubtraction(trainingData)} />
          </div>
        </div>
      </div>
      <div>
        <h2>6. Привести систему уравнений</h2>
        {equations.map((equation, index) => (
          <div key={index}>{equation}</div>
        ))}
        <br />
        {ys.map((y, index) => (
          <div key={index}>{y}</div>
        ))}
        <br />
        {xs.map((x, index) => (
          <div key={index}>{x}</div>
        ))}
      </div>
      <div>
        <h2>7. Выбрать 3 оси координат (признаки)</h2>
        {threeAxes.map((axes, index) => (
          <div key={index}>{axes}</div>
        ))}
      </div>
      <div>
        <h2>8. Выписать уравнения с выбранными признаками</h2>
        {threeEquations.map((equation, index) => (
          <div key={index}>{equation}</div>
        ))}
        <br />
        {threeYs.map((y, index) => (
          <div key={index}>{y}</div>
        ))}
        <br />
        {threeXs.map((x, index) => (
          <div key={index}>{x}</div>
        ))}
      </div>
    </div>
  );
};

export default App;
