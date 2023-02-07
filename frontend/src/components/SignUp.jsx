import { Component, useState } from "react";
import "./SignUp.module.css";
import logo from "../assets/icons/hooli-logo.png";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "", email: "", password: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    const target = event.target;
    this.setState({
      [target.name]: target.value,
    });
  }

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
          return response.json();
        } else {
          console.log("Error occurred: error" + response.status);
        }
      })
      .then((data) => {
        console.log("DATA STORED");
      });
  };
  render() {
    return (
      <div className={"SignUp.app"}>
        <div class={SignUp.row}>
          <div class={SignUp.column + " " + SignUp.darkPurple}>
            <img class={SignUp.logo} src={logo} alt="Hooli" />
          </div>
          <div class={SignUp.column}>
            <div class={SignUp.login}>
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
                  <button type="submit">Sign Up</button>
                </label>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUp;