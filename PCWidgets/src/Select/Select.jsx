import React, { useEffect, useRef, useState } from "react";
import classes from "./Select.module.css";

function LinkOption({ to = "", text = "" }) {
  return (
    <a href={to} className={classes.option}>
      {text}
    </a>
  );
}

function ButtonOption({ onClick = () => {}, text = "" }) {
  return (
    <button onClick={onClick} className={classes.option}>
      {text}
    </button>
  );
}

function Select({ label, children = null, ...props }) {
  const rootEl = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const type = "click";
    const onClick = (e) => {
      if (!rootEl.current?.contains(e.target)) close();
    };
    document.addEventListener(type, onClick);
    return () => document.removeEventListener(type, onClick);
  }, []);

  return (
    <div {...props}>
      <div className={classes.body} ref={rootEl}>
        <button onClick={open} className={classes.button}>
          {label}
        </button>
        <div className={isOpen ? classes.optionsOpen : classes.options}>
          {children}
        </div>
      </div>
    </div>
  );
}

export { Select, LinkOption, ButtonOption };
