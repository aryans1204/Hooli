import { Component, useState } from "react";
import classes from "./PersonalProfile.module.css";
import logo from "../assets/icons/hooli-logo.png";
import { Navigate } from "react-router-dom";

class PersonalProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      logoutSuccess: null,
      authenticated: null,
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  async componentDidMount() {
    await fetch("/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log(response.status);
        if (response.status == 401) this.setState({ authenticated: false });
        else this.setState({ authenticated: true });
        return response.json();
      })
      .then((data) => {
        this.setState({ name: data.name });
        this.setState({ email: data.email });
      });
  }

  handleLogout(e) {
    e.preventDefault();
    alert("Logging out");
    fetch("/api/users/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    })
      .then((response) => {
        if (response.status != 500) {
          this.setState({ logoutSuccess: true });
          sessionStorage.clear();
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
  }

  render() {
    return (
      <div>
        <div className={classes.title}>Personal Profile</div>
        <div>Name: {this.state.name}</div>
        <div>Email: {this.state.email}</div>
        <div>
          <button onClick={this.handleLogout}>logout</button>
        </div>
        <div>
          {this.state.authenticated == false && (
            <Navigate to="/" replace={true} />
          )}
          {this.state.logoutSuccess == true && (
            <Navigate to="/" replace={true} />
          )}
        </div>
      </div>
    );
  }
}

export default PersonalProfile;
