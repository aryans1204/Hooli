import classes from "./EditExpenditureComponent.module.css";
import ExpendituresTableComponent from "./ExpendituresTableComponent";
import React from "react";
import { useState, useEffect } from "react";
import { Button, ButtonGroup } from "@chakra-ui/react";
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
 * @function
 * @param {*} props
 * @returns {JSX.Element}
 */
export function EditExpenditureComponent(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [result, setResult] = useState([{}]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [targetData, setTargetData] = useState(null);
  const [targetFound, setTargetFound] = useState(false);

  /**
   * Stores data of expenditure to be removed.
   * @function
   * @param {*} item
   */
  function handleItemSelected(item) {
    setSelectedItem(item);
  }

  /**
   * Retrieves selected expenditure using get/api/expenditure/:id from a GET request
   * @function
   * @returns {Object}
   */
  function getTargetItem() {
    fetch(
      "https://hooli-backend-aryan.herokuapp.com/api/expenditure/" +
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
   * React hook that invokes onOpen() function if the targetData is not null.
   * Is triggered with every change in targetData
   * @function
   * @param {array} dependencies
   * @returns {void}
   */
  useEffect(() => {
    if (targetData !== null) {
      onOpen();
    }
  }, [targetData]);

  /**
   * Retrieves all expenditures using get/api/expenditure with a GET request
   * @function
   * @returns {Object}
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
      <div>
        {targetFound === true ? (
          <EditDataComponent
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
            data={targetData}
            setTargetFound={setTargetFound}
            setState={props.setState()}
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
 * @function
 * @param {*} props
 * @returns {JSX.Element}
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

  /**
   * Method that handles changes to the input fields.
   * @function
   * @param {Object} e 
   * @returns {void}
   */        
  const handleInputChange = (e) => {
    var { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

    /**
   * Method that clears state by setting values back to their initial values.
   * @function
   * @returns {void}
   */
  const clearState = () => {
    setValues(initialValues);
    setAddSuccess(null);
    props.setTargetFound(false);
    props.onClose();
  };

  /**
   * Method that deletes expenditure record using a DELETE method to the database.
   * @function
   * @returns {Object}
   */
  function handleRemove() {
    return fetch(
      "https://hooli-backend-aryan.herokuapp.com/api/expenditure/" +
        props.data._id,
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
          console.log("Removed");
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      });
  }

  /**
   * Sends a POST request to the database to add expenditure record after deleting old record.
   * @function
   * @returns {Object}
   */
  function handleSubmit() {
      handleRemove().then(
        fetch("https://hooli-backend-aryan.herokuapp.com/api/expenditure", {
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
            return response.json();
          }
        })
        .then((data) => {
          props.setState();
        })
      )
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
          <div className={classes["field-text", "required"]}>Memo</div>
            <input
              type="text"
              name="memo"
              onChange={handleInputChange}
            ></input>
          </ModalBody>
          <ModalBody>
          <div className={classes["field-text", "required"]}>Category</div>
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
              }}
            >
              <option value="">Select one</option>
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
          <div className={classes["field-text", "required"]}>Amount</div>
            <input
              type="number"
              size="30"
              required
              name="amount"
              onChange={handleInputChange}
            ></input>
          </ModalBody>
          <ModalBody>
          <div className={classes["field-text", "required"]}>Date</div>
            <input
              type="date"
              size="30"
              required
              name="date"
              onChange={handleInputChange}
            ></input>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup spacing="4">
              <Button
                onClick={handleSubmit}
                variant="solid"
                colorScheme="purple"
                size="md"
              >
                Save
              </Button>
              <Button
                onClick={clearState}
                variant="outline"
                colorScheme="purple"
                size="md"
              >
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
