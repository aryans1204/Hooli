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
      yearlyData: null,
      year: curYear,
      yearOptions: [],
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
        var tempData = data.sort(
          (a, b) => new Date(a.start_date) - new Date(b.start_date)
        );

        tempData.forEach((indiv) => {
          let longDate = indiv.start_date;
          indiv.start_date = longDate.slice(0, 10);
        });

        this.setState({ incomeData: tempData });

        console.log("tempData", tempData);
        console.log("tempData", typeof tempData);

        // Get DB entries within the correct year
        let finalData = [];
        tempData.forEach((data) => {
          if (data.start_date.includes(year)) {
            console.log("HELLO");
            finalData.push(data);
          }
        });

        this.setState({ yearlyData: finalData });

        console.log("final", finalData);
        // console.log("final", typeof(finalData));

        let uniqueYears = [];
        tempData.forEach((data) => {
          let year = new Date(data.start_date).getFullYear().toString();
          if (!uniqueYears.includes(year)) {
            uniqueYears.push(year);
          }
        });
        uniqueYears.reverse();
        this.setState({ yearOptions: uniqueYears });
      });
  }

  render() {
    const yearOptions = this.state.yearOptions.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ));
    return (
      <div className={classes.contents}>
        {this.state.authenticated == false && (
          <Navigate to="/" replace={true} />
        )}
        <NavBar />
        <h1 className={classes.text}>MY INCOME</h1>

        <label htmlFor="Year">Year:</label>
        <select
          name="years"
          id="year"
          onChange={(event) => {
            this.setState({ year: event.target.value }, () => {
              this.getIncomeData();
            });
          }}
        >
          {yearOptions}
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
            <IncomeBarChartComponent data={this.state.yearlyData} />
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
            data={this.state.yearlyData}
          />
          <EditOverlayComponent
            setState={() => {
              this.getIncomeData();
            }}
            data={this.state.yearlyData}
          />
        </div>

        <div className={classes.data}>
          {this.state.incomeData.length > 0 ? (
            <WeeklyIncomeComparison data={this.state.yearlyData} />
          ) : null}
        </div>
      </div>
    );
  }
}

export default Income;
