import React from "react";
import classes from "./CurrentGroup.module.css";

function CurrentGroup({ group }) {
  return <div className={classes.group}>{group.name}</div>;
}

export default CurrentGroup;
