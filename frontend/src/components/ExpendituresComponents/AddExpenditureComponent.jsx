import classes from "./AddExpenditureComponent.module.css";
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
 * Component for adding an expenditure.
 * @export
 * @param {*} props
 * @returns {*}
 */
export function AddExpenditureComponent(props) {
  const initialValues = {
    memo: null,
    amount: null,
    date: null,
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
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
    onClose();
  };

  /**
   * Creates new expenditure when submitted using post/api/expenditure.
   */
  function handleSubmit() {
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
          setAddSuccess(false);
        } else {
          setAddSuccess(true);
          setValues(initialValues);
          return response.json();
        }
      })
      .then((data) => {
        props.setState();
      });
  }

  return (
    <div>
      <Button
        onClick={onOpen}
        size="lg"
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
            Add New Expenditure
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody className={classes.inputbox}>
          <div className={classes["field-text", "required"]}>Memo</div>
            <input
              type="text"
              placeholder="Enter expenditure details"
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
              placeholder="Enter a number"
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
            <Button onClick={handleSubmit} colorScheme="yellow">
              Save
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
