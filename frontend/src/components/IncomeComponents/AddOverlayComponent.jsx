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
import classes from "./AddOverlayComponent.module.css";

/**
 * Overlay component for adding an income record.
 * @export
 * @param {*} props
 * @returns {*}
 */
export function AddOverlayComponent(props) {
  const initialValues = {
    monthlyIncome: null,
    weeklyHours: null,
    startDate: null,
    endDate: null,
    company: null,
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
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
    onClose();
  };

  /**
   * Creates new income data when submitted using post/api/income.
   */
  function handleSubmit() {
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
        company: values.company,
        weekly_hours: values.weeklyHours,
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
  }

  return (
    <>
      <Button
        onClick={onOpen}
        height="4em"
        width="10em"
        borderRadius="50"
        color="white"
        bg="#3f2371"
        float="left"
      >
        {" "}
        Add{" "}
      </Button>
      <Modal isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="30px">
            Add New Income
          </ModalHeader>
          <ModalCloseButton onClick={clearState} />
          <ModalBody>
            <div className={classes["field-text", "required"]}>Income Type</div>
            <select
              value={industry}
              onChange={(event) => {
                setIndustry(event.target.value);
              }}
            >
              <option>N.A.</option>
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
              onChange={handleInputChange}
            ></input>
          </ModalBody>

          <ModalBody>
          <div className={classes["field-text", "required"]}>Start Date</div>
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
              size="30"
              name="weeklyHours"
              onChange={handleInputChange}
            ></input>
          </ModalBody>
          <ModalBody className={classes.inputbox}>
            Company (optional)<br></br>
            <input
              type="text"
              size="30"
              name="company"
              onChange={handleInputChange}
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
