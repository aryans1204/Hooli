import { Component, useState } from "react";
import classes from "./PersonalProfile.module.css";
import { Input, InputGroup, InputLeftElement, Button} from '@chakra-ui/react';
import { Navigate } from "react-router-dom";
import NavBar from "./NavBar";

class PersonalProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      authenticated: null,
      inputName: '',
    };
    this.handleDeleteUser = this.handleDeleteUser.bind(this);
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

  async handleDeleteUser () {
    try {
      const response = await fetch("/api/users/me", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      console.log("Account deleted successfully");
      location.reload();
    }
    catch (error) {
      console.log(error.message);
    }
  }

  render() {
    return (
      <>
        <NavBar />
        <div className={classes.contents}>
          <h1 className={classes.title}>Personal Profile</h1>
          <div>Name: {this.state.name}</div>
          <div>Email: {this.state.email}</div>
          <Input placeholder='Enter Currency Pair' htmlSize={50} width='auto' variant='filled' id="myInput"/>
          

          <Button colorScheme='purple' onClick={this.handleDeleteUser}>Delete Account</Button>

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
