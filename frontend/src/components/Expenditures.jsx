import React, { Component } from "react";
import NavBar from "./NavBar";
import classes from "./Expenditures.module.css";
import { Navigate } from "react-router-dom";
import { Box, Flex, Spacer, Text, Center } from "@chakra-ui/react";
import { Stack, HStack, VStack } from "@chakra-ui/react";
import { AddExpenditureComponent } from "./ExpendituresComponents/AddExpenditureComponent";
import { EditExpenditureComponent } from "./ExpendituresComponents/EditExpenditureComponent";
import { RemoveExpenditureComponent } from "./ExpendituresComponents/RemoveExpenditureComponent";
import {
  ExpendituresPieChartComponent,
  ScrollBar,
} from "./ExpendituresComponents/ExpendituresPieChartComponent";
import { DisplayExpendituresComponent } from "./ExpendituresComponents/DisplayExpendituresComponent";
import DisplayAllExpendituresComponent from "./ExpendituresComponents/DisplayAllExpendituresComponent";

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
      monthlyData: null,
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
        this.setState({
          expendituresData: data,
        });
        const temp = this.filterDataByMonth(data, 0);
        this.setState({ monthlyData: temp });
      });
  }

  filterDataByMonth = (data, month) => {
    const startDate = new Date(2023, month, 1);
    const endDate = new Date(2023, month + 1, 0);

    return data.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate && date <= endDate;
    });
  };

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
        <div className={classes.title}>My Expenditures</div>
        <ScrollBar
          setMonth={(month) => {
            this.setState({
              monthlyData: this.filterDataByMonth(
                this.state.expendituresData,
                month
              ),
            });
          }}
        ></ScrollBar>
        <br></br>
        <Flex minWidth="max-content">
          <Center
            className={classes.chart}
            w="400px"
            border="2px"
            borderColor="#55185d"
            bg="white"
            overflow="hidden"
          >
            <Box>
              <Text className={classes.chartTitle}>
                Total Expenditures by Category{" "}
              </Text>
              {this.state.monthlyData !== null ? (
                <ExpendituresPieChartComponent data={this.state.monthlyData} />
              ) : null}
            </Box>
          </Center>
          <Spacer />
          <Center
            w="250px"
            border="2px"
            borderColor="#55185d"
            overflow="hidden"
          >
            <Box>
              <Text className={classes.displayExpendituresTitle}>
                Recent Expenditures
              </Text>
              {this.state.expendituresData !== null ? (
                <DisplayExpendituresComponent
                  data={this.state.expendituresData}
                />
              ) : null}
            </Box>
          </Center>
          <Spacer />
          <VStack spacing={4} align="stretch" width={450} height={420}>
            <Box
              border="2px"
              borderColor="#55185d"
              height={350}
              overflowY="scroll"
            >
              {this.state.expendituresData !== null ? (
                <DisplayAllExpendituresComponent
                  items={this.state.expendituresData}
                />
              ) : null}
            </Box>
            <Box>
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
            </Box>
          </VStack>
        </Flex>
      </div>
    );
  }
}

export default Expenditures;
