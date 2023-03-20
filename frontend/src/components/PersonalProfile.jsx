import { Component, useState } from "react";
import classes from "./PersonalProfile.module.css";
import { Input, InputGroup, InputLeftElement, Button, FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,} from '@chakra-ui/react';
import { Navigate } from "react-router-dom";
import  {DeleteAcc}  from "./ProfileComponents/DeleteAcc";
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
      authenticated: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleChange(event) {
    event.preventDefault();
    const target = event.target;
    this.setState({[target.name]: target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
    // Checks for name change
    if ((this.state.name != this.state.newName) && (this.state.newName != "")) {
      fetch("/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name: this.state.newName,
        })
      })
      .then ((response) => {
        if (response.status == 400) console.log("Error updating profile name!");
        else console.log("Profile name update successful");
      })
      .catch((err) => {
        console.log(err.message);
      });
    }

    // Checks for email change
    if ((this.state.email != this.state.newEmail) && (this.state.newEmail != "")) {
      fetch("/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({
          email: this.state.newEmail,
        })
      })
      .then ((response) => {
        if (response.status == 400) console.log("Error updating profile email!");
        else console.log("Profile email update successful");
      })
      .catch((err) => {
        console.log(err.message);
      });
    }
    location.reload();
  }

  render() {
    return (
      <>
        <NavBar />
        <div className={classes.contents}>
          <h1 className={classes.title}>Personal Profile</h1>

          <form className={classes.details}>
            <label htmlFor="fname">Name</label>
            <input type="text" placeholder="Name" name="newName" defaultValue={this.state.name} onChange={this.handleChange} required></input>
            <br/>
            <label htmlFor="email">Email</label>
            <input type="email" placeholder="Email" name="newEmail" defaultValue={this.state.email} required></input>
            {/* <input type="submit" value="Change Details" onSubmit={this.handleSubmit}></input> */}
            <Button colorScheme='purple' onClick={this.handleSubmit}>Change Details</Button>
          </form>

          <form className={classes.pwd}>
            <label htmlFor="pwd">Enter New Password</label>
            <input type="password" placeholder="New Password" onChange={this.handleChange} required></input>
            <br/>
            <label htmlFor="pwd">Confirm New Password</label>
            <input type="password" placeholder="Confirm New Password" onChange={this.handleChange} required></input>
            <input type="submit" value="Change Password"></input>
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
