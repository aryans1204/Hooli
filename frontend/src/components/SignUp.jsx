import { Component, useState } from "react";
import classes from "./SignUp.module.css";
import logo from "../assets/icons/hooli-logo.png";
import { Navigate } from "react-router-dom";


/**
 * Signup class
 * @class SignUp
 * @typedef {SignUp}
 * @extends {Component}
 */
class SignUp extends Component {
  
  /**
   * Creates an instance of SignUp.
   * @constructor
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = { name: "", email: "", password: "", signUpSuccessful: null };

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
   * Creates a new user using post/api/users when user clicks the submit button.
   * @param {*} e
   */
  handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
      })
    );
    fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          console.log("Sign up successful!");
          this.setState({ signUpSuccessful: true });
          return response.json();
        } else {
          this.setState({ signUpSuccessful: false });
          console.log("Error occurred: error" + response.status);
        }
      })
      .then((data) => {
        if (this.state.signUpSuccessful == true) {
          sessionStorage.setItem("token", data.token);
          window.location.reload();
          console.log("DATA STORED");
        }
      });
  };
  
  render() {
    return (
      <div className={classes.app}>
        <div className={classes.row}>
          <div className={classes.column + " " + classes.darkPurple}>
            <img className={classes.logo} src={logo} alt="Hooli" />
          </div>
          <div className={classes.column}>
            <div className={classes.login}>
              <h2>Sign Up</h2>
              <form onSubmit={this.handleSubmit}>
                <label>
                  <h3>Name</h3>
                  <input
                    type="text"
                    placeholder="name"
                    name="name"
                    value={this.state.name}
                    required
                    onChange={this.handleChange}
                  />
                </label>
                <label>
                  <h3>Email</h3>
                  <input
                    type="text"
                    placeholder="email"
                    name="email"
                    value={this.state.email}
                    required
                    onChange={this.handleChange}
                  />
                </label>
                <label>
                  <h3>Password</h3>
                  <input
                    type="password"
                    placeholder="password"
                    name="password"
                    value={this.state.password}
                    required
                    onChange={this.handleChange}
                  />
                </label>
                <label>
                  <input type="submit" value="Sign up" />
                </label>
              </form>
              <div>
                {(() => {
                  if (this.state.signUpSuccessful == false) {
                    return (
                      <div>ACcount creation unsuccessful. Please try again</div>
                    );
                  } else {
                    return null;
                  }
                })()}
              </div>
              {this.state.signUpSuccessful == true && (
                <Navigate to="/personalprofile" replace={true} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUp;
