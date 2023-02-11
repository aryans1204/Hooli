import { Component, useState } from "react";
import classes from "./PersonalProfile.module.css";
import logo from "../assets/icons/hooli-logo.png";

class PersonalProfile extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "", email: "" };
  }

  async componentDidMount() {
    let token = sessionStorage.getItem("token");
    let profileData = await fetch("/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let item = data;
        return item;
      });
    this.setState({ name: profileData.name });
    this.setState({ email: profileData.email });
  }
  render() {
    return (
      <div>
        <div className={classes.title}>Personal Profile</div>
        <div>Name: {this.state.name}</div>
        <div>Email: {this.state.email}</div>
      </div>
    );
  }
}

export default PersonalProfile;
