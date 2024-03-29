import classes from "./EditOverlayComponent.module.css";
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
 * Overlay component for editing an income record.
 * @export
 * @param {*} props
 * @returns {JSX.Element}
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
    fetch(
      "https://hooli-backend-aryan.herokuapp.com/api/income/" +
        selectedItem._id,
      {
        method: "GET",
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
          setTargetFound(true);
          return response.json();
        }
      })
      .then((data) => {
        setTargetData(data);
      });
  }

  /**
   * Sets state to props data of income of selected year.
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
 * @returns {JSX.Element}
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
   * Removes an income record using delete/api/income/:id.
   */
  function handleRemove() {
    return fetch(
      "https://hooli-backend-aryan.herokuapp.com/api/income/" + props.data._id,
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
      fetch("https://hooli-backend-aryan.herokuapp.com/api/income", {
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
            setAddSuccess(true);
            return response.json();
          }
        })
        .then((data) => {
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
          <div className={classes["field-text", "required"]}>Income Type</div>
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
          <div className={classes["field-text", "required"]}>Monthly Income</div>
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
          <div className={classes["field-text", "required"]}>Start Date</div>
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
              size="md"
              d="flex"
              onClick={handleSubmit}
            >
              Save
            </Button>
            <Button onClick={clearState} colorScheme="yellow" size="md">
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
