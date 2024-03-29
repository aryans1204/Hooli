import React from "react";
import { useState, useEffect } from "react";
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
import DisplayTableComponent from "./DisplayTableComponent";

/**
 * Overlay component for removing an income record.
 * @export
 * @param {*} props
 * @returns {JSX.Element}
 */
export function RemoveOverlayComponent(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [result, setResult] = useState([{}]); //result is the income data fetched with backend api
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setResult(props.data);
  }, [props.data]);

  /**
   * Stores data of income record to be removed.
   * @param {*} item
   */
  function handleItemSelected(item) {
    setSelectedItem(item);
  }

  /**
   * Removes selected income record using delete/api/income/:id.
   */
  function handleRemove() {
    fetch(
      "https://hooli-backend-aryan.herokuapp.com/api/income/" +
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
   * Retrieves all income records using get/api/income.
   */
  function getData() {
    setResult(props.data);
    onOpen();
  }

  return (
    <div>
      <Button
        onClick={getData}
        w="10em"
        h="4em"
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
            Remove Income Data
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
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
              onClick={handleRemove}
            >
              Remove
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
