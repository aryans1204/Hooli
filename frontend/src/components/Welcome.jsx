import { React, Component } from "react";
import { Link } from "react-router-dom";
import classes from "./Welcome.module.css";
import logo from "../assets/icons/hooli-logo.png";

/**
 * Welcome class
 * @class Welcome
 * @typedef {Welcome}
 * @extends {Component}
 */
class Welcome extends Component {
  render() {
    return (
      <div className={classes.container}>
        <div className={classes["col", "leftCol"]}>
          <img src={logo} alt="Hooli" />
        </div>
        <div className={classes["col", "rightCol"]}>
          <div className={classes.nav}>
            <Link to="/login" relative="path" className={classes.login}>Login</Link>
            <Link to="/signup" relative="path" className={classes.signup}>Get Started</Link>
          </div>
          <div className={classes.description}>
            <h1>Welcome</h1>
            <p>Hooli is an online application that helps you manage your finances.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Welcome;
