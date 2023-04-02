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

/**
 * Overlay component for editing an income record.
 * @export
 * @param {*} props
 * @returns {*}
 */
export function EditOverlayComponent(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [result, setResult] = useState([{}]); //result is the income data fetched with backend api
  const [selectedItem, setSelectedItem] = useState(null);
  const [targetData, setTargetData] = useState(null); //targetData is the specific data that the user wants to edit
  const [targetFound, setTargetFound] = useState(false);

  // sets result with income data of selected year
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
   * Retrieves selected income record using get/api/income/:id.
   */
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
  /*useEffect(() => {
    if (targetData !== null) {
      console.log("targetData", targetData);
      let startDateL = targetData.start_date;
      let endDateL = targetData.end_date;
      document.getElementById("industryList").value = targetData.industry;
      document.getElementById("monthlyIncome").value =
        targetData.monthly_income;
      document.getElementById("startDate").value = startDateL.slice(0, 10);
      if (targetData.end_date != null)
        document.getElementById("endDate").value = endDateL.slice(0, 10);
      if (targetData.weekly_hours != null)
        document.getElementById("weeklyHours").placeholder =
          targetData.weekly_hours;
      if (targetData.company != null)
        document.getElementById("company").placeholder = targetData.company;
      onOpen();
    }
  }, [targetData]);*/

  /**
   * Sets state to props data of income of selected year
   */
  function getData() {
    setResult(props.data);
    onOpen();
  }

  return (
    <div>
      <div>
        {targetFound === true && targetData !== null ? (
          <EditDataComponent
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
            data={targetData}
            setTargetFound={setTargetFound}
            setTargetData={setTargetData}
            setState={props.setState}
          />
        ) : null}
      </div>
      <Button
        onClick={getData}
        w="10em"
        h="4em"
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
          <ModalHeader textAlign="center" fontSize="2em">
            Edit Income Data
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
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

/**
 * Component for editing an income record.
 * @param {*} props
 * @returns {*}
 */
function EditDataComponent(props) {
  const resetValues = {
    monthlyIncome: null,
    weeklyHours: null,
    startDate: null,
    endDate: null,
    company: null,
  };

  let initValues =
    props.data === null
      ? resetValues
      : {
          monthlyIncome: props.data.monthly_income,
          weeklyHours: props.data.weekly_hours,
          startDate: props.data.start_date.slice(0, 10),
          endDate:
            props.data.end_date !== null
              ? props.data.end_date.slice(0, 10)
              : null,
          company: props.data.company,
        };

  useEffect(() => {}, [props.data]);

  const [values, setValues] = useState(initValues);
  const [industry, setIndustry] = useState(props.data.industry);
  const [addSuccess, setAddSuccess] = useState(null);
  console.log(values);

  const handleInputChange = (e) => {
    var { name, value } = e.target;
    // replaces value
    setValues({
      ...values,
      [name]: value,
    });
  };
  const clearState = () => {
    setValues(resetValues);
    setAddSuccess(null);
    props.setTargetFound(false);
    props.setTargetData(null);
    props.onClose();
  };

  /**
   * Removea an income record using delete/api/income/:id.
   */
  function handleRemove() {
    console.log(props.data._id);
    return fetch("/api/income/" + props.data._id, {
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
   * Creates a new (edited) income record using post/api/income.
   */
  function handleSubmit() {
    handleRemove().then(() => {
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
          weekly_hours: values.weeklyHours,
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
        .then((data) => {
          console.log(data);
          props.setState();
        });
    });
  }
  return (
    <>
      <Modal isOpen={props.isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2em">
            Edit Income
          </ModalHeader>
          <ModalBody>
            Income Type<br></br>
            <select
              id="industryList"
              value={industry}
              onChange={(event) => {
                setIndustry(event.target.value);
              }}
            >
              <option>N.A</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Services">Services</option>
              <option value="Construction">Construction</option>
              <option value="Others">Others</option>
            </select>
          </ModalBody>
          <ModalBody>
            Monthly income<br></br>
            <input
              type="number"
              size="30"
              required
              name="monthlyIncome"
              id="monthlyIncome"
              onChange={handleInputChange}
              value={values.monthlyIncome}
            ></input>
          </ModalBody>

          <ModalBody>
            Start Date<br></br>
            <input
              type="date"
              size="30"
              name="startDate"
              id="startDate"
              onChange={handleInputChange}
              value={values.startDate}
              required
            ></input>
          </ModalBody>
          <ModalBody>
            End Date (optional)<br></br>
            <input
              type="date"
              size="30"
              name="endDate"
              id="endDate"
              onChange={handleInputChange}
              value={values.endDate || ""}
            ></input>
          </ModalBody>
          <ModalBody>
            Weekly hours (optional)<br></br>
            <input
              type="number"
              // placeholder="hours"
              size="30"
              required
              name="weeklyHours"
              id="weeklyHours"
              onChange={handleInputChange}
              value={values.weeklyHours || ""}
            ></input>
          </ModalBody>
          <ModalBody className={classes.inputbox}>
            Company (optional)<br></br>
            <input
              type="text"
              // placeholder="company name"
              size="30"
              name="company"
              id="company"
              onChange={handleInputChange}
              value={values.company || ""}
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
    </>
  );
}
