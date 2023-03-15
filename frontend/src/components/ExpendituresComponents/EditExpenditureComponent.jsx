import classes from "./EditExpenditureComponent.module.css";
import ExpendituresTableComponent from "./ExpendituresTableComponent";
import React, { Component } from "react";
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

/**
 * Component for editing an expenditure.
 * @export
 * @param {*} props
 * @returns {*}
 */
export function EditExpenditureComponent(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [result, setResult] = useState([{}]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [targetData, setTargetData] = useState(null);
  const [targetFound, setTargetFound] = useState(false);

  /**
   * Stores data of expenditure to be removed.
   * @param {*} item
   */
  function handleItemSelected(item) {
    setSelectedItem(item);
  }

  function setState() {
    props.setState();
  }

  /**
   * Retrieves selected expenditure using get/api/expenditure/:id.
   */
  function getTargetItem() {
    fetch("/api/expenditure/" + selectedItem._id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 500 || response.status === 404) {
          console.log("Some error occurred - " + response.status);
        } else {
          setTargetFound(true);
          return response.json();
        }
      })
      .then((data) => {
        setTargetData(data);
        console.log(data);
      });
  }
  useEffect(() => {
    if (targetData !== null) {
      console.log(targetData);
      onOpen();
    }
  }, [targetData]);

  /**
   * Retrieves all expenditures using get/api/expenditure.
   */
  function getData() {
    fetch("/api/expenditure", {
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
      <div>
        {targetFound === true ? (
          <EditDataComponent
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
            data={targetData}
            setTargetFound={setTargetFound}
            setState={setState}
          />
        ) : null}
      </div>
      <Button
        onClick={getData}
        w="175px"
        h="71px"
        borderRadius="50"
        color="white"
        bg="#3f2371"
        float="left"
      >
        Edit
      </Button>
      <Modal isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="30px">
            Edit expenditure
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody>
            <ExpendituresTableComponent
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
              onClick={getTargetItem}
            >
              Edit
            </Button>
            <Button onClick={onClose} colorScheme="yellow" pl="20px">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

/**
 * Component for editing an expenditure.
 * @param {*} props
 * @returns {*}
 */
function EditDataComponent(props) {
  const initialValues = {
    memo: null,
    amount: null,
  };
  const [values, setValues] = useState(initialValues);
  const [category, setCategory] = useState("");
  const [addSuccess, setAddSuccess] = useState(null);
  const handleInputChange = (e) => {
    var { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const clearState = () => {
    setValues(initialValues);
    setAddSuccess(null);
    props.setTargetFound(false);
    props.onClose();
  };

  /**
   * Remove an expenditure using delete/api/expenditure/:id.
   */
  function handleRemove() {
    console.log(props.data._id);
    return fetch("/api/expenditure/" + props.data._id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 500 || response.status === 404) {
          console.log("Some error occurred - " + response.status);
        } else {
          console.log("Removed");
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      });
  }

  /**
   * Creates a new (edited) expenditure using post/api/expenditure
   */
  function handleSubmit() {
    handleRemove().then(() => {
      fetch("/api/expenditure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          transaction_category: category,
          amount: values.amount,
        }),
      })
        .then((response) => {
          if (response.status === 500) {
            console.log("Some error occurred - " + response.status);
            setAddSuccess(false);
          } else {
            console.log("Added new");
            setAddSuccess(true);
            return response.json();
          }
        })
        .then((data) => {
          console.log(data);
          props.setState();
        });
    });
  }

  return (
    <div>
      <Modal isOpen={props.isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="30px">
            Add new expenditure
          </ModalHeader>
          <ModalBody>
            Memo<br></br>
            <input
              type="text"
              placeholder="Enter expenditure details"
              size="30"
              name="memo"
              onChange={handleInputChange}
            ></input>
          </ModalBody>
          <ModalBody>
            Category<br></br>
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
              }}
            >
              <option value="Food">Food</option>
              <option value="Housing">Housing</option>
              <option value="Utilities">Utilities</option>
              <option value="Bills">Bills</option>
              <option value="Clothes">Clothes</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Transport">Transport</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Pets">Pets</option>
              <option value="Others">Others</option>
            </select>
          </ModalBody>
          <ModalBody>
            Amount<br></br>
            <input
              type="number"
              placeholder="Enter a number"
              size="30"
              required
              name="amount"
              onChange={handleInputChange}
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
            <Button onClick={clearState} colorScheme="yellow" pl="20px">
              Cancel
            </Button>
            <div>
              {(() => {
                if (addSuccess == false) {
                  return <div>An error occurred. Please try again.</div>;
                } else if (addSuccess == true) {
                  return (
                    <div>
                      <div>Successfully added expenditure!</div>
                      <div>
                        <Button onClick={clearState}>OK</Button>
                      </div>
                    </div>
                  );
                } else {
                  return null;
                }
              })()}
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
