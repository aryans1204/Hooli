import { Component, useState } from "react";
import classes from "./Login.module.css";
import logo from "../assets/icons/hooli-logo.png";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";


/**
 * Login class
 * @class Login
 * @typedef {Login}
 * @extends {Component}
 */
class Login extends Component {

  /**
   * Creates an instance of Login.
   * @constructor
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = { email: "", password: "", loginSuccess: null };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Sets state of the component to the value of the input field when user types in the input field.
   * @param {*} event
   */
  handleChange(event) {
    event.preventDefault();
    const target = event.target;
    this.setState({
      [target.name]: target.value,
    });
  }

  /**
   * Logs in a user with email and password using post/api/users/login
   * @param {*} e
   */
  handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      })
    );
    fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((response) => {
        if (response.status === 400) {
          console.log(response.json().error);
          console.log("fail");
          this.setState({ loginSuccess: false });
        } else {
          console.log("Login successful");
          this.setState({ loginSuccess: true });
          return response.json();
        }
      })
      .then((data) => {
        if (this.state.loginSuccess == true) {
          sessionStorage.setItem("token", data.token);
          window.location.reload();
          console.log("DATA STORED");
        }
      });
  };

  render() {
    return (
      <div className={classes.row}>
        <div className={classes.column + " " + classes["dark-purple"]}>
          <img className={classes.logo} src={logo} alt="Hooli" />
        </div>
        <div className={classes.column}>
          <div className={classes.login}>
            <h2>Sign In</h2>
            <form onSubmit={this.handleSubmit}>
              <label>
                <h3>Email</h3>
                <input
                  type="text"
                  placeholder="email"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  required
                />
              </label>
              <label>
                <h3>Password</h3>
                <input
                  type="password"
                  placeholder="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  required
                />
              </label>
              <label>
                <input type="submit" value="Log In" />
              </label>
              <p>
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  relative="path"
                  className={classes.signupLink}
                >
                  Create an account
                </Link>
              </p>
            </form>
            <div>
              {(() => {
                if (this.state.loginSuccess == false) {
                  return (
                    <div>
                      The email or password is incorrect. Please try again
                    </div>
                  );
                } else if (this.state.loginSuccess == true) {
                  return <div>Login success! You will be redirected</div>;
                } else {
                  return null;
                }
              })()}
            </div>
            {this.state.loginSuccess == true && (
              <Navigate to="/dashboard" replace={true} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
