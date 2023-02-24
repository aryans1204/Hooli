import React, { Component } from "react";
import NavBar from "./NavBar";
import classes from "./Income.module.css";
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

//overlay component for adding income data
export function AddOverlay() {
  const initialValues = {
    incomeAmount: 0,
    startDate: 0,
    endDate: null,
    company: null,
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [values, setValues] = useState(initialValues);
  const [incomeType, setIncomeType] = useState(0);

  const handleInputChange = (e) => {
    var { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
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
        } else {
          console.log("Success");
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
      <Modal isOpen={isOpen} onClose={onClose}>
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
            <Button onClick={onClose} colorScheme="yellow" pl="20px">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button
        w="175px"
        h="71px"
        borderRadius="50"
        color="white"
        bg="#3f2371"
        float="left"
      >
        Remove
      </Button>
      <Button
        w="175px"
        h="71px"
        borderRadius="50"
        color="white"
        bg="#3f2371"
        float="left"
      >
        Edit
      </Button>
    </ButtonGroup>
  );
}

//overlay when attempting to add income. To use, call it as a regular component
const AddOverlayComponent = ({ render }) => {
  return AddOverlay();
};

class Income extends Component {
  //const { isOpen, onOpen, onClose } = useDisclosure();
  constructor(props) {
    super(props);
    this.state = {
      authenticated: null,
    };
  }

  async componentDidMount() {
    await fetch("/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log(response.status);
        if (response.status == 401) this.setState({ authenticated: false });
        else this.setState({ authenticated: true });
        return response.json();
      })
      .then((data) => {});
  }

  render() {
    return (
      <div className={classes.contents}>
        <div>
          {this.state.authenticated == false && (
            <Navigate to="/" replace={true} />
          )}
        </div>
        <div>
          <NavBar />
        </div>
        <div className={classes.title}>My Income</div>
        <Box
          bg="rgba(148, 114, 208, 1)"
          w="769px"
          h="400px"
          color="white"
          p={5}
          mt={5}
          ml="20"
          borderRadius="50"
        >
          <div>test test test test</div>
        </Box>
        <AddOverlayComponent />
      </div>
    );
  }
}

export default Income;
