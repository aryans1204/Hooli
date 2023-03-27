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
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'

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
        size="lg"
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
            Edit Expenditure
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody>
            <ExpendituresTableComponent
              items={result}
              onItemSelected={handleItemSelected}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={getTargetItem} colorScheme="yellow">
              Edit
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
    date: null,
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
    //handleRemove().then(() => {
      fetch("/api/expenditure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          memo: values.memo,
          category: category,
          amount: values.amount,
          date: values.date,
        }),
      })
        .then((response) => {
          if (response.status === 500) {
            console.log("Some error occurred - " + response.status);
            setAddSuccess(false);
          } else {
            console.log("Added new");
            setAddSuccess(true);
            setValues(initialValues);
            handleRemove();
            return response.json();
          }
        })
        .then((data) => {
          console.log(data);
          props.setState();
        });
    //});
  }

  return (
    <div>
      <Modal isOpen={props.isOpen} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="30px">
            Edit Expenditure
          </ModalHeader>
          <ModalBody className={classes.inputbox}>
            Memo<br></br>
            <input
              type="text"
              placeholder="Enter expenditure details"
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
              <option value=''>Select one</option>
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
          <ModalBody>
            Date<br></br>
            <input
              type="date"
              size="30"
              required
              name="date"
              onChange={handleInputChange}
            ></input>
          </ModalBody>

          <ModalFooter>
          <ButtonGroup spacing='4'>
            <Button onClick={handleSubmit} variant="solid" colorScheme="purple" size="md">
              Save
            </Button>
            <Button onClick={clearState} variant="outline" colorScheme="purple" size="md">
              Cancel
            </Button>
            </ButtonGroup>
            <div>
              {(() => {
                if (addSuccess == false) {
                  return <div>An error occurred. Please try again.</div>;
                } else if (addSuccess == true) {
                  return (
                    <div>
                      <div>Successfully edited expenditure!</div>
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
