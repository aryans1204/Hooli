import { Component, useState } from "react";
import classes from "./PersonalProfile.module.css";
import { Button } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { DeleteAcc } from "./ProfileComponents/DeleteAcc";
import NavBar from "./NavBar";

class PersonalProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      newName: "",
      newEmail: "",
      newPassword: "",
      repeatPassword: "",
      authenticated: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleProfileSubmit = this.handleProfileSubmit.bind(this);
    this.handlePwdSubmit = this.handlePwdSubmit.bind(this);
  }

  async componentDidMount() {
    await fetch("https://hooli-backend-aryan.herokuapp.com/api/users/me", {
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

  handleChange(event) {
    event.preventDefault();
    const target = event.target;
    this.setState({ [target.name]: target.value });
  }

  handleProfileSubmit = (e) => {
    e.preventDefault();
    // Checks for name change
    if (this.state.name != this.state.newName && this.state.newName != "") {
      fetch("https://hooli-backend-aryan.herokuapp.com/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: this.state.newName,
        }),
      })
        .then((response) => {
          if (response.status == 400)
            console.log("Error updating profile name!");
          else {
            console.log("Profile name update successful");
            alert("Name update sucessful");
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    }

    // Checks for email change
    if (this.state.email != this.state.newEmail && this.state.newEmail != "") {
      fetch("https://hooli-backend-aryan.herokuapp.com/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          email: this.state.newEmail,
        }),
      })
        .then((response) => {
          if (response.status == 400) {
            console.log("Error updating profile email!");
            alert("Please enter a valid email");
          } else {
            console.log("Profile email update successful");
            alert("Email update sucessful");
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  handlePwdSubmit = (e) => {
    e.preventDefault();
    if ((this.state.newPassword == this.state.repeatPassword) && ((this.state.newPassword).length >= 7)) {
      fetch("https://hooli-backend-aryan.herokuapp.com/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          password: this.state.newPassword,
        }),
      })
        .then((response) => {
          if (response.status == 400) {
            console.log("Error changing password!");
          } else {
            console.log("Password update successful");
            alert("Password update sucessful. You will be signed out.");
            // log out
            fetch(
              "https://hooli-backend-aryan.herokuapp.com/api/users/logout",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
              }
            ).then((response) => {
              console.log(response.text);
              if (response.status != 500) {
                sessionStorage.clear();
                window.location.assign("/");
              }
            });
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if ((this.state.newPassword == this.state.repeatPassword) && ((this.state.newPassword).length < 7)) {
      alert("Password length must be at least 7 characters long. Please try again.");
    }
    else alert("Password does not match. Please try again.");
  };

  render() {
    return (
      <>
        <NavBar />
        <div className={classes.contents}>
          <h1 className={classes.title}>My Profile</h1>

          <form className={classes.details}>
            <label htmlFor="fname">Name</label>
            <input
              type="text"
              placeholder="Name"
              name="newName"
              defaultValue={this.state.name}
              className={classes.textType}
              onChange={this.handleChange}
              required
            ></input>
            <br />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Email"
              name="newEmail"
              onChange={this.handleChange}
              defaultValue={this.state.email}
              required
            ></input>
            <Button colorScheme="purple" onClick={this.handleProfileSubmit}>
              Change Details
            </Button>
          </form>

          <form className={classes.pwd}>
            <label htmlFor="pwd">Enter New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              className={classes.pwdType}
              onChange={this.handleChange}
              required
            ></input>
            <br />
            <label htmlFor="pwd">Confirm New Password</label>
            <input
              type="password"
              name="repeatPassword"
              placeholder="Confirm New Password"
              className={classes.pwdType}
              onChange={this.handleChange}
              required
            ></input>
            <Button colorScheme="purple" onClick={this.handlePwdSubmit}>
              Change Password
            </Button>
          </form>

          <DeleteAcc />

          <div>
            {this.state.authenticated == false && (
              <Navigate to="/" replace={true} />
            )}
          </div>
        </div>
      </>
    );
  }
}

export default PersonalProfile;
