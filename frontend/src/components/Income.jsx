import React, { Component } from "react";
import NavBar from "./NavBar";
import classes from "./Income.module.css";
import { useState, useEffect } from "react";
import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { AddOverlayComponent } from "./AddOverlayComponent";
import { RemoveOverlayComponent } from "./RemoveOverlayComponent";
import { IncomeBarChartComponent } from "./IncomeBarChartComponent";
import { EditOverlayComponent } from "./EditOverlayComponent";

class Income extends Component {
  //const { isOpen, onOpen, onClose } = useDisclosure();
  constructor(props) {
    super(props);
    this.state = {
      authenticated: null,
      incomeData: null,
    };
  }

  async componentDidMount() {
    this.getIncomeData();
    await fetch("/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status == 401) this.setState({ authenticated: false });
        else this.setState({ authenticated: true });
        return response.json();
      })
      .then((data) => {});
  }

  //updates the state of incomeData
  getIncomeData() {
    fetch("/api/income", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 500) {
          console.log("Some error occurred - " + response.status);
        } else {
          return response.json();
        }
      })
      .then((data) => {
        const tempData = data.sort(
          (a, b) => new Date(a.start_date) - new Date(b.start_date)
        );
        this.setState({
          incomeData: tempData,
        });
      });
  }

  render() {
    return (
      <div className={classes.contents}>
        <div>
          {this.state.authenticated == false && (
            <Navigate to="/" replace={true} />
          )}
        </div>
        <div>
          <NavBar />
        </div>
        <div className={classes.title}>My Income</div>
        <Box
          bg="rgba(148, 114, 208, 1)"
          w="770px"
          h="500px"
          color="white"
          p={5}
          mt={5}
          ml="20"
          borderRadius="50"
          overflow="hidden"
        >
          {this.state.incomeData !== null ? (
            <IncomeBarChartComponent data={this.state.incomeData} />
          ) : null}
        </Box>
        <AddOverlayComponent
          setState={() => {
            //this function is passed in as prop and will be triggered by the child component whenever there's a change to the database
            this.getIncomeData();
          }}
        />
        <RemoveOverlayComponent
          setState={() => {
            this.getIncomeData();
          }}
        />
        <EditOverlayComponent
          setState={() => {
            this.getIncomeData();
          }}
        />
      </div>
    );
  }
}

export default Income;
