import React, { Component } from "react";
import NavBar from "./NavBar";
import classes from "./Income.module.css";
import { Box, Button } from "@chakra-ui/react";

class Income extends Component {
  render() {
    return (
      <div className={classes.contents}>
        <div>
          <NavBar />
        </div>
        <div className={classes.title}>My Income</div>
        <Box className={classes.barChart}>
          <div>test test test test</div>
        </Box>
        <Button className={classes.buttons}>Add</Button>
      </div>
    );
  }
}

export default Income;
