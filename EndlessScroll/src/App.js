import React, { useState } from "react";
import "./App.css";
import Groups from "./GroupHeader/GroupHeader";
import CurrentGroup from "./CurrentGroup/CurrentGroup";

const App = () => {
  const groups = [
    { id: 1, name: "Группа 1" },
    { id: 2, name: "Группа 2" },
    { id: 3, name: "Группа 3" },
    { id: 4, name: "Группа 4" },
    { id: 5, name: "Группа 5" },
    { id: 6, name: "Группа 6" },
    { id: 7, name: "Группа 7" },
    { id: 8, name: "Группа 8" },
    { id: 9, name: "Группа 9" },
    { id: 10, name: "Группа 10" },
    { id: 11, name: "Группа 11" },
    { id: 12, name: "Группа 12" },
    { id: 13, name: "Группа 13" },
    { id: 14, name: "Группа 14" },
    { id: 15, name: "Группа 15" },
    { id: 16, name: "Группа 16" },
    { id: 17, name: "Группа 17" },
    { id: 18, name: "Группа 18" },
    { id: 19, name: "Группа 19" },
    { id: 20, name: "Группа 20" },
  ];

  const [curGroup, setCurGroup] = useState(groups[0]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Groups groups={groups} curGroup={curGroup} setCurGroup={setCurGroup} />
      <CurrentGroup group={curGroup} />
    </div>
  );
};

export default App;
