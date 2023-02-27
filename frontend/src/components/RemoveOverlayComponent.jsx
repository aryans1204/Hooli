import React, { Component } from "react";
import NavBar from "./NavBar";
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
import classes from "./RemoveOverlayComponent.module.css";
import DisplayTableComponent from "./DisplayTableComponent";

export function RemoveOverlay() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [result, setResult] = useState([{}]); //result is the income data fetched with backend api
  const [selectedItem, setSelectedItem] = useState(null);

  function handleItemSelected(item) {
    setSelectedItem(item);
  }

  //populates 'result' with income data
  useEffect(() => {
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
        setResult(data);
      });
  }, []);

  return (
    <div>
      <Button
        onClick={onOpen}
        w="175px"
        h="71px"
        borderRadius="50"
        color="white"
        bg="#3f2371"
        float="left"
      >
        Remove
      </Button>
      <Modal isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="30px">
            Remove income data
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <DisplayTableComponent
              items={result}
              onItemSelected={handleItemSelected}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="purple"
              h="50px"
              w="80px"
              d="flex"
              onClick={onClose}
            >
              Save
            </Button>
            <Button onClick={onClose} colorScheme="yellow" pl="20px">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
export const RemoveOverlayComponent = ({ render }) => {
  return RemoveOverlay();
};
