/*welcome page*/

import { React, Component } from "react";
import { Link } from "react-router-dom";
import classes from "./Welcome.module.css";
import logo from "../assets/icons/hooli-logo.png";

class Welcome extends Component {
  render() {
    return (
      <div className={classes.app}>
        <div className={classes["purple-column"]}>
          <img className={classes.logo} src={logo} alt="Hooli" />
        </div>
        <div className={classes["yellow-column"]}>
          <div className={classes.nav}>
            <Link to="/login" relative="path" className={classes.link}>
              Login
            </Link>
            <Link to="/signup" relative="path" className={classes.signup}>
              Get Started
            </Link>
            {/* <Link to="/dashboard" relative="path" className={classes.signup}>Dash</Link> */}
          </div>
          <div>
            <h1 className={classes.title}>Welcome</h1>
          </div>
          <div>
            <p className={classes.about}>
              Hooli is an online application that helps you manage your
              finances.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Welcome;
