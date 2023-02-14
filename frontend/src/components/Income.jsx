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
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";

export function AddOverlay() {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
            <IncomeTypeMenuComponent />
          </ModalBody>

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
  );
}

const AddOverlayComponent = ({ render }) => {
  return AddOverlay();
};

export function IncomeTypes() {
  return (
    <Menu>
      <MenuButton as={Button}>Click</MenuButton>
      <MenuList>
        <MenuItem>Download</MenuItem>
        <MenuItem>Create a Copy</MenuItem>
        <MenuItem>Mark as Draft</MenuItem>
        <MenuItem>Delete</MenuItem>
        <MenuItem>Attend a Workshop</MenuItem>
      </MenuList>
    </Menu>
  );
}

const IncomeTypeMenuComponent = ({ render }) => {
  return IncomeTypes();
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
