import { useState } from "react";
import { Button } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import classes from "./EditPortfolio.module.css";

export function EditPortfolio(props) {
  const initialEquityValues = {
    equity_ticker: "",
    equity_buy_price: "",
  };
  const initialOptionValues = {
    derivative_ticker: "",
    option_type: "",
    strike_price: "",
    expiration_date: "",
  };
  const [equityValues, setEquityValues] = useState(initialEquityValues);
  const [optionValues, setOptionValues] = useState(initialOptionValues);
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
    setAddSuccess(null);
  };

  // function to add new equity into the database
  async function handleEquitySubmit(e) {
    e.preventDefault();
    const isValid = await checkTicker(equityValues.equity_ticker);
    if (isValid) {
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
            updatePortfolios();
            return response.json();
          }
        })
        .then((data) => {
          console.log(data);
        });
    }
  }
  async function handleOptionSubmit(e) {
    e.preventDefault();
    const isValid = await checkTicker(optionValues.derivative_ticker);
    if (isValid) {
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
            updatePortfolios();
            return response.json();
          }
        })
        .then((data) => {
          console.log(data);
        });
    }
  }

  // function that renders the form for user to enter equity data
  function EditEquity() {
    return (
      <div className={classes.editEquity}>
        <form onSubmit={handleEquitySubmit}>
          <label>
            <div className={classes[("field-text", "required")]}>
              Equity Ticker:
            </div>
            <input
              required
              placeholder="e.g. AAPL"
              type="text"
              name="equity_ticker"
              value={equityValues.equity_ticker}
              onChange={handleEquityChange}
            />
          </label>
          <br />
          <label>
            <div className={classes[("field-text", "required")]}>
              Equity Buy Price:
            </div>
            <input
              required
              placeholder="0"
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
    props.edit();
    window.location.reload();
  };

  // function that renders the form for user to enter option data
  function EditOption() {
    return (
      <div className={classes.editOption}>
        <form onSubmit={handleOptionSubmit}>
          <label>
            <div className={classes[("field-text", "required")]}>Ticker:</div>
            <input
              required
              placeholder="e.g. AAPL"
              type="text"
              name="derivative_ticker"
              value={optionValues.derivative_ticker}
              onChange={handleOptionChange}
            />
          </label>
          <br />
          <div className={classes[("field-text", "required")]}>
            <label>Option Type:</label>
          </div>
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
            <div className={classes[("field-text", "required")]}>
              Strike Price:
            </div>
            <input
              required
              placeholder="0"
              type="text"
              name="strike_price"
              value={optionValues.strike_price}
              onChange={handleOptionChange}
            />
          </label>
          <br />
          <label>
            <div className={classes[("field-text", "required")]}>
              Expiration Date:
            </div>
            <input
              required
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

  // Checks whether user input ticker is valid :)
  const checkTicker = async (symbol) => {
    const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
    const response = await fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        const found = data.bestMatches.some(
          (match) => match["1. symbol"].toLowerCase() === symbol.toLowerCase()
        );
        if (found) {
          console.log(`${symbol} was found!`);
        } else {
          alert(`${symbol} is not a valid ticker.`);
        }
        return found;
      });
    return response;
  };

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
