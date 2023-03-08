import classes from "./EditOverlayComponent.module.css";
import React, { Component } from "react";
import NavBar from "../NavBar";
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
import DisplayTableComponent from "./DisplayTableComponent";
import { AddOverlayComponent } from "./AddOverlayComponent";

export function EditOverlayComponent(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [result, setResult] = useState([{}]); //result is the income data fetched with backend api
  const [selectedItem, setSelectedItem] = useState(null);
  const [targetData, setTargetData] = useState(null); //targetData is the specific data that the user wants to edit
  const [targetFound, setTargetFound] = useState(false);

  function handleItemSelected(item) {
    setSelectedItem(item);
  }
  function setState() {
    props.setState();
  }

  function getTargetItem() {
    fetch("/api/income/" + selectedItem._id, {
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
  function getData() {
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
            Edit income data
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

function EditDataComponent(props) {
  const initialValues = {
    monthlyIncome: null,
    weeklyHours: null,
    startDate: null,
    endDate: null,
    company: null,
  };
  const [values, setValues] = useState(initialValues);
  const [industry, setIndustry] = useState("");
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

  function handleRemove() {
    console.log(props.data._id);
    fetch("/api/income/" + props.data._id, {
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
          //setResult(result.filter((item) => item._id !== selectedItem._id));
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      });
  }

  function handleSubmit() {
    handleRemove();
    fetch("/api/income", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        industry: industry,
        monthly_income: values.monthlyIncome,
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
          console.log("Added new");
          setAddSuccess(true);
          return response.json();
        }
      })
      .then((data) => {});
    props.setState();
  }
  return (
    <div>
      <Modal isOpen={props.isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="30px">
            Add new income
          </ModalHeader>
          <ModalBody>
            Income Type<br></br>
            <select
              value={industry}
              onChange={(event) => {
                setIndustry(event.target.value);
              }}
            >
              <option>N.A</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="services">Services</option>
              <option value="construction">Construction</option>
              <option value="others">Others</option>
            </select>
          </ModalBody>
          <ModalBody>
            Monthly income<br></br>
            <input
              type="number"
              placeholder="amount"
              size="30"
              required
              name="monthlyIncome"
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
            Weekly hours (optional)<br></br>
            <input
              type="number"
              placeholder="hours"
              size="30"
              required
              name="weeklyHours"
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
    </div>
  );
}
