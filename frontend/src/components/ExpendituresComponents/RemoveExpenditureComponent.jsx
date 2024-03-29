import ExpendituresTableComponent from "./ExpendituresTableComponent";
import React from "react";
import { useState } from "react";
import { Button } from "@chakra-ui/react";
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

/**
 * Component for removing an expenditure.
 * @export
 * @function
 * @param {*} props
 * @returns {JSX.Element}
 */
export function RemoveExpenditureComponent(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [result, setResult] = useState([{}]);
  const [selectedItem, setSelectedItem] = useState(null);

  /**
   * Stores data of expenditure to be removed.
   * @function
   * @param {*} item
   * @returns {void}
   */
  function handleItemSelected(item) {
    setSelectedItem(item);
  }

  /**
   * Removes selected expenditure using delete/api/expenditure/:id.
   * @function
   * @returns {object}
   */
  function handleRemove() {
    fetch(
      "https://hooli-backend-aryan.herokuapp.com/api/expenditure/" +
        selectedItem._id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => {
        if (response.status === 500 || response.status === 404) {
          console.log("Some error occurred - " + response.status);
        } else {
          setResult(result.filter((item) => item._id !== selectedItem._id));
          return response.json();
        }
      })
      .then((data) => {
        props.setState();
      });
  }

  /**
   * Retrieves all expenditures using get/api/income.
   * @function
   * @returns {object}
   */
  function getData() {
    fetch("https://hooli-backend-aryan.herokuapp.com/api/expenditure", {
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
    onOpen();
  }

  return (
    <div>
      <Button
        onClick={getData}
        size="lg"
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
            Remove Expenditure
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody>
            <ExpendituresTableComponent
              items={result}
              onItemSelected={handleItemSelected}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleRemove} colorScheme="yellow">
              Remove
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
