import React, { useEffect, useState } from "react";
import "./App.css";

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
  { matrix: [0, 1, 1, 0, 0, 0, 0, 0], classification: "Чай с сахаром" },
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
  return el.classification;
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
          {result && <th>Результат</th>}
        </tr>
      </thead>
      <tbody>
        {matrix.map((row, index) => (
          <tr key={index}>
            <th>{row.classification}</th>
            {row.matrix.map((el, index2) => (
              <td key={index2}>{el}</td>
            ))}
            {result && <td>{multiplyByMatrix(row.matrix, matrix2)}</td>}
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
    }, 500);
  };

  useEffect(() => {
    setTrainingData([]);
    addTrain();
  }, []);

  return (
    <div>
      <h1>Классификация типов напитков</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <h2>Матрица</h2>
          <Table matrix={matrix} />
        </div>
        <div>
          <h2>Обучение</h2>
          <Table matrix={trainingData} />
        </div>
        <div>
          <h2>Демоны</h2>
          <Table matrix={baseDemons} matrix2={matrix} result={true} />
        </div>
      </div>
    </div>
  );
};

export default App;
