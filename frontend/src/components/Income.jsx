import React, { Component } from "react";
import NavBar from "./NavBar";
import classes from "./Income.module.css";
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

function Income() {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
          onClick={onOpen}
          w="175px"
          h="71px"
          borderRadius="50"
          color="white"
          bg="#3f2371"
          float="left"
        >
          Add
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>yes</ModalBody>

            <ModalFooter>
              <Button
                colorScheme="purple"
                onClick={onClose}
                h="50px"
                w="80px"
                d="flex"
              >
                Save
              </Button>
              <Button colorScheme="yellow" pl="20px">
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
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

export default Income;
