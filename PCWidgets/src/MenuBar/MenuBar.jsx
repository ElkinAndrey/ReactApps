import React from "react";
import classes from "./MenuBar.module.css";
import minilogo from "../assets/minilogo.svg";
import { Select, LinkOption, ButtonOption } from "../Select/Select";

function MenuBar() {
  return (
    <header className={classes.body}>
      <img className={classes.logo} src={minilogo} alt="" />
      <Select label="Аккаунт">
        <ButtonOption
          onClick={() => console.log("register")}
          text="Зарегистрироваться"
        />
        <ButtonOption onClick={() => console.log("login")} text="Войти" />
        <ButtonOption
          onClick={() => console.log("forgot-password")}
          text="Забыли пароль"
        />
        <ButtonOption
          onClick={() => console.log("settings")}
          text="Настройки"
        />
        <ButtonOption onClick={() => console.log("logout")} text="Выйти" />
      </Select>
    </header>
  );
}

export default MenuBar;
