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

//overlay component for adding income data
export function AddOverlay() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [incomeType, setIncomeType] = useState("click");
  function handleChange(event) {
    console.log(event.target.value);
  }
  function handleSubmit() {
    console.log("fetch api here");
  }

  return (
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
          <ModalHeader textAlign="center" fontSize="30px">
            Add new income
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Income Type<br></br>
            <select
              value={incomeType}
              onChange={(event) => {
                setIncomeType(event.target.value);
              }}
            >
              <option value="FT">Full-time</option>
              <option value="PT">Part-time</option>
              <option value="Passive">Passive</option>
              <option value="Others">Others</option>
            </select>
          </ModalBody>
          <ModalBody>
            Amount<br></br>
            <input
              type="text"
              placeholder="amount"
              name="amount"
              size="30"
              required
              onChange={handleChange}
            ></input>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="purple"
              h="50px"
              w="80px"
              d="flex"
              onClick={handleSubmit}
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
  );
}

//overlay when attempting to add income. To use, call it as a regular component
const AddOverlayComponent = ({ render }) => {
  return AddOverlay();
};

class Income extends Component {
  //const { isOpen, onOpen, onClose } = useDisclosure();
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
        <AddOverlayComponent />
      </div>
    );
  }
}

export default Income;
