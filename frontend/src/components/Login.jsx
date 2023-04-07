import { Component } from "react";
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
   * Initialises state of component for email, password and loginSuccess.
   * Binds the handleChange() and handleSubmit() methods to the component instance.
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
   * Method that handles changes to the input fields.
   * @param {Object} event 
   */
  handleChange(event) {
    event.preventDefault();
    const target = event.target;
    this.setState({
      [target.name]: target.value,
    });
  }

  /**
   * Method that handles form submission in the component.
   * @param {Object} e 
   */
  handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://hooli-backend-aryan.herokuapp.com/api/users/login", {
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
          this.setState({ loginSuccess: false });
        } else {
          this.setState({ loginSuccess: true });
          return response.json();
        }
      })
      .then((data) => {
        if (this.state.loginSuccess == true) {
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
          <div className={classes.login}>
            <h2>Sign In</h2>
            <form onSubmit={this.handleSubmit}>
              <div className={classes.fields}>
                <label>
                  <h3>Email</h3>
                  <input
                    type="text"
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
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    required
                  />
                </label>
              
                <input type="submit" value="Log In"/>
              </div>
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
