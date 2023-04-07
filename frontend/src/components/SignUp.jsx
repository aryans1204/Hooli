import { Component } from "react";
import classes from "./SignUp.module.css";
import logo from "../assets/icons/hooli-logo.png";
import { Navigate } from "react-router-dom";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "", email: "", password: "", signUpSuccessful: null };

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
    fetch("https://hooli-backend-aryan.herokuapp.com/api/users", {
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
          this.setState({ signUpSuccessful: true });
          return response.json();
        } else {
          this.setState({ signUpSuccessful: false });
        }
      })
      .then((data) => {
        if (this.state.signUpSuccessful == true) {
          sessionStorage.setItem("token", data.token);
          window.location.reload();
        }
      });
  };
  render() {
    return (
      <div className={classes.container}>
          <div className={classes["col", "leftCol"]}>
            <img className={classes.logo} src={logo} alt="Hooli" />
          </div>
          <div className={classes["col", "rightCol"]}>
            <div className={classes.signup}>
              <h2>Sign Up</h2>
              <form onSubmit={this.handleSubmit}>
              <div className={classes.fields}>
                <label>
                  <h3>Name</h3>
                  <input
                    type="text"
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
                    name="password"
                    value={this.state.password}
                    required
                    onChange={this.handleChange}
                  />
                </label>
                <input type="submit" value="Register" />
              </div>
              </form>
              <div>
                {(() => {
                  if (this.state.signUpSuccessful == false) {
                    return (
                      <div>Account creation unsuccessful. Please try again</div>
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
    );
  }
}

export default SignUp;
