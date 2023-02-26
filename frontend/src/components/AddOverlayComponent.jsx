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
import classes from "./AddOverlayComponent.module.css";

//overlay component for adding income data
export function AddOverlay() {
  const initialValues = {
    incomeAmount: null,
    startDate: null,
    endDate: null,
    company: null,
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [values, setValues] = useState(initialValues);
  const [incomeType, setIncomeType] = useState(0);
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
    onClose();
  };

  //calls backend api to create new income data when submitted
  function handleSubmit() {
    fetch("/api/income", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        income_type: incomeType,
        monthly_income: values.incomeAmount,
        start_date: values.startDate,
        end_date: values.endDate,
        company: values.company,
      }),
    })
      .then((response) => {
        if (response.status === 500) {
          console.log("Some error occurred - " + response.status);
          setAddSuccess(false);
        } else {
          console.log("Success");
          setAddSuccess(true);
          return response.json();
        }
      })
      .then((data) => {});
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
      <Modal isOpen={isOpen}>
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
              <option>N.A</option>
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
              size="30"
              required
              name="incomeAmount"
              onChange={handleInputChange}
            ></input>
          </ModalBody>
          <ModalBody>
            Start Date<br></br>
            <input
              type="date"
              size="30"
              required
              name="startDate"
              onChange={handleInputChange}
            ></input>
          </ModalBody>
          <ModalBody>
            End Date (optional)<br></br>
            <input
              type="date"
              size="30"
              name="endDate"
              onChange={handleInputChange}
            ></input>
          </ModalBody>
          <ModalBody>
            Company (optional)<br></br>
            <input
              type="text"
              placeholder="company name"
              size="30"
              name="company"
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
                  return <div>An error occurred. Please try again</div>;
                } else if (addSuccess == true) {
                  return (
                    <div>
                      <div>Successfully added income data!</div>
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
    </ButtonGroup>
  );
}

//overlay when attempting to add income. To use, call it as a regular component
export const AddOverlayComponent = ({ render }) => {
  return AddOverlay();
};
