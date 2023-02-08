import { Component, useState } from "react";
import classes from "./Login.module.css";
import logo from "../assets/icons/hooli-logo.png";

class Login extends Component {
  render() {
    return (
      <div className={classes.row}>
        <div className={classes.column + " " + classes["dark-purple"]}>
          <img className={classes.logo} src={logo} alt="Hooli" />
        </div>
        <div className={classes.column}>
          <div className={classes.login}>
            <h2>Sign In</h2>
            <form>
              <label>
                <h3>Email</h3>
                <input type="text" name="name" />
              </label>
              <label>
                <h3>Password</h3>
                <input type="password" name="name" />
              </label>
              <label>
                <input type="submit" value="Log In" />
              </label>
              <p>
                Don't have an account? <a href="#">Create An Account</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
