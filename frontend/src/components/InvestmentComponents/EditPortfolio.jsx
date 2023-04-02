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
import StockSelector from "./StockSelector";
import classes from "./EditPortfolio.module.css";

//
// To do : After selecting some thing to edit, another overlay will appear. EditEquity attempts to open an equity overlay (not done yet)
//

export function EditPortfolio(props) {
  const initialEquityValues = {
    equity_ticker: "",
    equity_buy_price: 0,
  };
  const initialOptionValues = {
    derivative_ticker: "",
    option_type: "",
    strike_price: 0,
    expiration_date: "",
  };
  const [equityValues, setEquityValues] = useState(initialEquityValues);
  const [optionValues, setOptionValues] = useState(initialOptionValues);
  //const [addSuccess, setAddSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("equities");
  const { isOpen, onOpen, onClose } = useDisclosure();

  // tracks input change for equity data
  const handleEquityChange = (e) => {
    var { name, value } = e.target;
    setEquityValues({
      ...equityValues,
      [name]: value,
    });
  };

  // tracks input change for option data
  const handleOptionChange = (e) => {
    var { name, value } = e.target;
    setOptionValues({
      ...optionValues,
      [name]: value,
    });
  };

  const clearState = () => {
    //setValues(initialValues);
    setAddSuccess(null);
    //props.setTargetFound(false);
  };

  // function to add new equity into the database
  function handleEquitySubmit(e) {
    e.preventDefault();
    console.log("SUBMIT");
    fetch(
      "https://hooli-backend-aryan.herokuapp.com/api/investments/equities/" +
        props.data._id,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          equity_ticker: equityValues.equity_ticker,
          equity_buy_price: equityValues.equity_buy_price,
        }),
      }
    )
      .then((response) => {
        if (response.status === 400 || response.status === 404) {
          console.log("Some error occurred - " + response.status);
        } else {
          console.log("Edited");
          console.log(response);
          updatePortfolios();
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      });
  }
  function handleOptionSubmit(e) {
    e.preventDefault();
    console.log("SUBMIT");
    fetch(
      "https://hooli-backend-aryan.herokuapp.com/api/investments/options/" +
        props.data._id,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          derivative_ticker: optionValues.derivative_ticker,
          option_type: optionValues.option_type,
          strike_price: optionValues.strike_price,
          expiration_date: optionValues.expiration_date,
        }),
      }
    )
      .then((response) => {
        if (response.status === 400 || response.status === 404) {
          console.log("Some error occurred - " + response.status);
        } else {
          console.log("Edited");
          console.log(response);
          updatePortfolios();
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      });
  }

  // function that renders the form for user to enter equity data
  function EditEquity() {
    return (
      <div className={classes.editEquity}>
        <form onSubmit={handleEquitySubmit}>
          <label>
            Equity Ticker:
            <input
              type="text"
              name="equity_ticker"
              value={equityValues.equity_ticker}
              onChange={handleEquityChange}
            />
          </label>
          <br />
          <label>
            Equity Buy Price:
            <input
              type="number"
              name="equity_buy_price"
              value={equityValues.equity_buy_price}
              onChange={handleEquityChange}
            />
          </label>
          <br />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    );
  }

  // function to refresh the portfolios in sessionStorage after a change has been made
  const updatePortfolios = () => {
    sessionStorage.removeItem("portfolios");
    //sessionStorage.removeItem("tickerData");
    props.edit();
    window.location.reload();
  };

  // function that renders the form for user to enter option data
  function EditOption() {
    return (
      <div className={classes.editOption}>
        <form onSubmit={handleOptionSubmit}>
          <label>
            Ticker:
            <input
              type="text"
              name="derivative_ticker"
              value={optionValues.derivative_ticker}
              onChange={handleOptionChange}
            />
          </label>
          <br />
          <label>Option Type:</label>
          <select
            value={optionValues.option_type}
            name="option_type"
            onChange={handleOptionChange}
          >
            <option value="">Choose one</option>
            <option value="call">Call</option>
            <option value="put">Put</option>
          </select>

          <br />
          <label>
            Strike Price:
            <input
              type="text"
              name="strike_price"
              value={optionValues.strike_price}
              onChange={handleOptionChange}
            />
          </label>
          <br />
          <label>
            Expiration Date:
            <input
              type="date"
              name="expiration_date"
              value={optionValues.expiration_date}
              onChange={handleOptionChange}
            />
          </label>
          <br />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    );
  }
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onOpen();
  };

  const closeOverlay = () => {
    setEquityValues(initialEquityValues);
    setOptionValues(initialOptionValues);
    onClose();
  };

  return (
    <div>
      <Button
        onClick={onOpen}
        w="175px"
        h="71px"
        borderRadius="50"
        color="white"
        bg="#3f2371"
        float="right"
      >
        Edit
      </Button>
      <Modal isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="30px">
            Update Portfolio Data
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <div>
            <button
              onClick={() => handleTabClick("equities")}
              className={
                activeTab === "equities" ? classes.activeTab : classes.tab
              }
            >
              Equities
            </button>
            <button
              onClick={() => handleTabClick("options")}
              className={
                activeTab === "options" ? classes.activeTab : classes.tab
              }
            >
              Options
            </button>
          </div>
          {activeTab === "equities" && EditEquity()}
          {activeTab === "options" && EditOption()}
          <ModalFooter>
            <Button onClick={closeOverlay} colorScheme="yellow" pl="20px">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
