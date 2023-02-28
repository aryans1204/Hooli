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

class Income extends Component {
  //const { isOpen, onOpen, onClose } = useDisclosure();
  constructor(props) {
    super(props);
    this.state = {
      authenticated: null,
    };
  }

  async componentDidMount() {
    await fetch("/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log(response.status);
        if (response.status == 401) this.setState({ authenticated: false });
        else this.setState({ authenticated: true });
        return response.json();
      })
      .then((data) => {});
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
          w="769px"
          h="400px"
          color="white"
          p={5}
          mt={5}
          ml="20"
          borderRadius="50"
        >
          <div>test test test test</div>
          <div>
            <IncomeBarChartComponent />
          </div>
        </Box>
        <AddOverlayComponent />
        <RemoveOverlayComponent />
      </div>
    );
  }
}

export default Income;
