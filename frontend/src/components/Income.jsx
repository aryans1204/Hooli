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
import { IncomeBarChart } from "./IncomeComponents/IncomeBarChart";

/**
 * Income class
 * @class Income
 * @typedef {Income}
 * @extends {Component}
 */
class Income extends Component {

  /**
   * Creates an instance of Income.
   * @constructor
   * @param {*} props
   */
  constructor(props) {
    super(props);
    var curYear = new Date().getFullYear();
    curYear = curYear.toString();
    this.state = {
      authenticated: null,
      incomeData: [],
      year: curYear,
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
    var year = this.state.year;
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
        console.log("dataaaaaa", data);
        const tempData = data.sort(
          (a, b) => new Date(a.start_date) - new Date(b.start_date)
        );

        console.log("tempData", tempData);
        console.log("tempData", typeof(tempData));

        // Get DB entries within the correct year
        let finalData = [];
        tempData.forEach(data => {
          if ((data.start_date).includes(year)) {
            console.log("HELLO");
            finalData.push(data);
          }
        });
        
        this.setState({incomeData: finalData});

        console.log("final", finalData);

        return finalData;
        // console.log("final", typeof(finalData));

      });
  }

  render() {
    return (
      <div className={classes.contents}>
        {this.state.authenticated == false && (<Navigate to="/" replace={true} />)}
        <NavBar />
        <h1 className={classes.text}>MY INCOME</h1>

        {/* {this.state.incomeData !== null ? (<IncomeBarChart data={this.state.incomeData} />) : null} */}
        <label htmlFor="Year">Year:</label>
        <select name="years" id="year"
          onChange={(event) => {
            this.setState({ year: event.target.value }, () => {
            this.getIncomeData();
          });
        }}>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
        </select>

        

        <Box
          bg="rgba(148, 114, 208, 1)"
          w="50%"
          h="50%"
          color="white"
          p="1%"
          mt="1%"
          borderRadius="50"
          overflow="hidden"
        >
        {this.state.incomeData.length > 0 ? (
          <IncomeBarChartComponent setState={() => {
              this.getIncomeData();
            }} />
            ) : (
          <p>No income entry!</p>
            )}
        </Box>
        
        <div className={classes.buttons}>
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
