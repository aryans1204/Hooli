import React, { Component } from "react";
import NavBar from "./NavBar";
import classes from "./Income.module.css";
import { Box } from "@chakra-ui/react";

class Income extends Component {
  render() {
    return (
      <div className={classes.income}>
        <div>
          <NavBar />
        </div>
        <Box>this is a box</Box>
        <div className={classes.contents}>
          <div>Income page</div>
          <div>test display</div>
        </div>
      </div>
    );
  }
}

export default Income;
