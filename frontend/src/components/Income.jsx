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
import { AddOverlayComponent } from "./IncomeComponents/AddOverlayComponent";
import { RemoveOverlayComponent } from "./IncomeComponents/RemoveOverlayComponent";
import { IncomeBarChartComponent } from "./IncomeComponents/IncomeBarChartComponent";
import { EditOverlayComponent } from "./IncomeComponents/EditOverlayComponent";
import { WeeklyIncomeComparison } from "./IncomeComponents/WeeklyIncomeComparison";

/**
 * Income class
 * @class Income
 * @typedef {Income}
 * @extends {Component}
 */
class Income extends Component {
  //const { isOpen, onOpen, onClose } = useDisclosure();

  /**
   * Creates an instance of Income.
   * @constructor
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      authenticated: null,
      incomeData: null,
    };
  }

  /**
   * Retrieves income data and user profile after component is rendered.
   * @async
   * @returns {*}
   */
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

  /**
   * Retrieves all income records using get/api/income and updates the state of incomeData.
   */
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
          w="50%"
          h="50%"
          color="white"
          p="1%"
          mt="1%"
          ml="5%"
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
        <div className={classes.data}>
          {this.state.incomeData !== null ? (
            <WeeklyIncomeComparison data={this.state.incomeData} />
          ) : null}
        </div>
      </div>
    );
  }
}

export default Income;
