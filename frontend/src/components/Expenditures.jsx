import React, { Component } from 'react';
import NavBar from './NavBar';
import classes from './Expenditures.module.css';
import { Navigate } from "react-router-dom";
import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import { AddExpenditureComponent } from "./ExpendituresComponents/AddExpenditureComponent";
import { EditExpenditureComponent } from "./ExpendituresComponents/EditExpenditureComponent";
import { RemoveExpenditureComponent } from "./ExpendituresComponents/RemoveExpenditureComponent";
import { ExpendituresPieChartComponent } from "./ExpendituresComponents/ExpendituresPieChartComponent";

/**
 * Expenditures class
 * @class Expenditures
 * @typedef {Expenditures}
 * @extends {Component}
 */
class Expenditures extends Component {

  /**
   * Creates an instance of Expenditures.
   * @constructor
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      authenticated: null,
      expendituresData: null,
    };
  }

  /**
   * Retrieves expenditures and user profile after component is rendered.
   * @async
   * @returns {*}
   */
  async componentDidMount() {
    this.getData();
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
   * Retrieves all expenditures using get/api/expenditure and updates the state of incomeData.
   */
  getData() {
    fetch("/api/expenditure", {
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
        // const tempData = data.sort(
        //   (a, b) => new Date(a.start_date) - new Date(b.start_date)
        // );
        this.setState({
          expendituresData: data,
        });
      });
  }

  render() {
    return (
      <div className={classes.contents}>
        <div>
          {this.state.authenticated == false && (<Navigate to="/" replace={true} />)}
        </div>
        <div>
          <NavBar />
        </div>
        <div className={classes.title}>My Expenditures</div>
        <Box>
          {this.state.expendituresData !== null ? (
            <ExpendituresPieChartComponent data={this.state.expendituresData} />
          ) : null}
        </Box>
        <AddExpenditureComponent
          setState={() => {
            this.getData();
          }}
        />
        <EditExpenditureComponent
          setState={() => {
            this.getData();
          }}
        />
        <RemoveExpenditureComponent
          setState={() => {
            this.getData();
          }}
        />
      </div>
    );
  }
}

export default Expenditures;