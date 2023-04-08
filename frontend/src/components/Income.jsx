import React, { Component } from "react";
import NavBar from "./NavBar";
import classes from "./Income.module.css";
import { Box } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { AddOverlayComponent } from "./IncomeComponents/AddOverlayComponent";
import { RemoveOverlayComponent } from "./IncomeComponents/RemoveOverlayComponent";
import { IncomeBarChartComponent } from "./IncomeComponents/IncomeBarChartComponent";
import { EditOverlayComponent } from "./IncomeComponents/EditOverlayComponent";
import { WeeklyIncomeComparison } from "./IncomeComponents/WeeklyIncomeComparison";
import * as Spinners from "react-spinners";

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
    this.state = {
      authenticated: null,
      incomeData: [],
      yearlyData: null,
      year: null,
      yearOptions: [],
      loading: true,
    };
  }

  /**
   * Retrieves income data and user profile after component is rendered.
   * @async
   * @returns {*}
   */
  async componentDidMount() {
    this.getIncomeData();
    await fetch("https://hooli-backend-aryan.herokuapp.com/api/users/me", {
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
    fetch("https://hooli-backend-aryan.herokuapp.com/api/income", {
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

        let uniqueYears = [];
        tempData.forEach((data) => {
          let year = new Date(data.start_date).getFullYear().toString();
          if (!uniqueYears.includes(year)) {
            uniqueYears.push(year);
          }
        });
        uniqueYears.reverse();

        var year;
        // Sets the year option to be the latest year found in the database
        if (
          !this.state.year ||
          !uniqueYears.includes(this.state.year.toString())
        ) {
          this.setState({ year: Math.max(...uniqueYears) });
          year = Math.max(...uniqueYears);
        } else {
          year = this.state.year;
        }
        // Get DB entries within the correct year
        let finalData = [];
        tempData.forEach((data) => {
          if (data.start_date.includes(year)) {
            finalData.push(data);
          }
        });

        this.setState({ yearlyData: finalData });

        this.setState({ yearOptions: uniqueYears, loading: false });
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
        <div className={classes.info}>
          <div className={classes.left}>
            <label htmlFor="Year">Year:</label>
            <select
              className={classes.custom}
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
              bg="#E9D8FD"
              p="2%"
              mt="1%"
              borderRadius="40"
              marginRight="15px"
            >
              {this.state.incomeData.length > 0 ? (
                <IncomeBarChartComponent data={this.state.yearlyData} />
              ) : this.state.loading ? (
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Spinners.BeatLoader color="#805AD5" />
                </div>
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
          </div>

          <div className={classes.data}>
            {this.state.incomeData.length > 0 ? (
              <WeeklyIncomeComparison data={this.state.yearlyData} />
            ) : this.state.loading ? (
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Spinners.MoonLoader color="#805AD5" />
              </div>
            ) : (
              <p>No Weekly Income Comparison!</p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Income;
