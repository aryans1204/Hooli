import React, { Component } from "react";
import NavBar from "./NavBar";
import classes from "./Income.module.css";
import { Box, Button, ButtonGroup } from "@chakra-ui/react";

class Income extends Component {
  render() {
    return (
      <div className={classes.contents}>
        <div>
          <NavBar />
        </div>
        <div className={classes.title}>My Income</div>
        <Box
          bg="rgba(148, 114, 208, 1)"
          w="769px"
          h="400px"
          color="white"
          p={5}
          mt={5}
          ml="20"
          borderRadius="50"
        >
          <div>test test test test</div>
        </Box>

        <ButtonGroup spacing="40px" float="left" pl="180px">
          <Button
            w="175px"
            h="71px"
            borderRadius="50"
            color="white"
            bg="#3f2371"
            float="left"
          >
            Add
          </Button>
          <Button
            w="175px"
            h="71px"
            borderRadius="50"
            color="white"
            bg="#3f2371"
            float="left"
          >
            Remove
          </Button>
          <Button
            w="175px"
            h="71px"
            borderRadius="50"
            color="white"
            bg="#3f2371"
            float="left"
          >
            Edit
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}

export default Income;
