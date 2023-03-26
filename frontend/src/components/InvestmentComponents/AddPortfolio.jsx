//
// Problem: after clicking add equity, then add option, then trying to add another equity won't load the new form
//

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
import classes from "./AddPortfolio.module.css";

export function AddPortfolio(props) {
  // component that renders a form for the user to enter their data
  const PortfolioForm = () => {
    const [equities, setEquities] = useState([]);
    const [options, setOptions] = useState([]);

    const handleSubmit = async (event) => {
      event.preventDefault();
      console.log(equities);
      console.log(options);
      fetch("/api/investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          equities: equities,
          options: options,
        }),
      })
        .then((response) => {
          if (response.status === 400) {
            console.log("Some error occurred - " + response.status);
            console.log(response);
            //setAddSuccess(false);
          } else {
            console.log("Success");
            //setAddSuccess(true);
            sessionStorage.removeItem("portfolios");
            props.edit();
            return response.json();
          }
        })
        .then((data) => {
          //props.setState();
        });
    };

    return (
      <form onSubmit={handleSubmit}>
        {equities.map((equity, index) => (
          <div key={index}>
            <label htmlFor={`equity_ticker_${index}`}>Ticker:</label>
            <input
              type="text"
              id={`equity_ticker_${index}`}
              value={equity.equity_ticker || ""}
              onChange={(event) => {
                const newEquities = [...equities];
                newEquities[index] = {
                  ...newEquities[index],
                  equity_ticker: event.target.value,
                };
                setEquities(newEquities);
              }}
            />
            <br></br>
            <label htmlFor={`equity_pnl_${index}`}>P&L:</label>
            <input
              type="text"
              id={`equity_pnl_${index}`}
              value={equity.equity_pnl || ""}
              onChange={(event) => {
                const newEquities = [...equities];
                newEquities[index] = {
                  ...newEquities[index],
                  equity_pnl: event.target.value,
                };
                setEquities(newEquities);
              }}
            />
            <br></br>
            <label htmlFor={`equity_buy_price_${index}`}>Buy Price:</label>
            <input
              type="number"
              id={`equity_buy_price_${index}`}
              value={equity.equity_buy_price || 0}
              onChange={(event) => {
                const newEquities = [...equities];
                newEquities[index] = {
                  ...newEquities[index],
                  equity_buy_price: event.target.value,
                };
                setEquities(newEquities);
              }}
            />
            <br></br>
            <label htmlFor={`equity_current_price_${index}`}>
              <br></br>Current Price:
            </label>
            <input
              type="number"
              id={`equity_current_price_${index}`}
              value={equity.equity_current_price || 0}
              onChange={(event) => {
                const newEquities = [...equities];
                newEquities[index] = {
                  ...newEquities[index],
                  equity_current_price: event.target.value,
                };
                setEquities(newEquities);
              }}
            />
            <hr></hr>
          </div>
        ))}

        {options.map((option, index) => (
          <div key={index}>
            <label htmlFor={`derivative_ticker_${index}`}>Ticker:</label>
            <input
              type="text"
              id={`derivative_ticker_${index}`}
              value={option.derivative_ticker || ""}
              onChange={(event) => {
                const newOptions = [...options];
                newOptions[index] = {
                  ...newOptions[index],
                  derivative_ticker: event.target.value,
                };
                setOptions(newOptions);
              }}
            />
            <br></br>
            <label htmlFor={`option_type_${index}`}>Option Type:</label>
            <select
              id={`option_type_${index}`}
              value={option.option_type || ""}
              onChange={(event) => {
                const newOptions = [...options];
                newOptions[index] = {
                  ...newOptions[index],
                  option_type: event.target.value,
                };
                setOptions(newOptions);
              }}
            >
              <option value="">Choose one</option>
              <option value="call">Call</option>
              <option value="put">Put</option>
            </select>
            <br></br>
            <label htmlFor={`strike_price_${index}`}>Strike Price:</label>
            <input
              type="number"
              id={`strike_price_${index}`}
              value={option.strike_price || 0}
              onChange={(event) => {
                const newOptions = [...options];
                newOptions[index] = {
                  ...newOptions[index],
                  strike_price: event.target.value,
                };
                setOptions(newOptions);
              }}
            />
            <br></br>
            <label htmlFor={`expiration_date_${index}`}>
              <br></br>Expiration Date:
            </label>
            <input
              type="date"
              id={`expiration_date_${index}`}
              value={option.expiration_date || ""}
              onChange={(event) => {
                const newOptions = [...options];
                newOptions[index] = {
                  ...newOptions[index],
                  expiration_date: event.target.value,
                };
                setOptions(newOptions);
              }}
            />
            <br></br>
            <label htmlFor={`derivative_current_price_${index}`}>
              <br></br>Current Price:
            </label>
            <input
              type="number"
              id={`derivative_current_price_${index}`}
              value={option.derivative_current_price || 0}
              onChange={(event) => {
                const newOptions = [...options];
                newOptions[index] = {
                  ...newOptions[index],
                  derivative_current_price: event.target.value,
                };
                setOptions(newOptions);
              }}
            />
            <hr></hr>
          </div>
        ))}

        <Button onClick={() => setEquities([...equities, {}])}>
          Add Equity
        </Button>
        <Button onClick={() => setOptions([...options, {}])}>Add Option</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </form>
    );
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
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
        Add Portfolio
      </Button>
      <Modal isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="30px">
            Create Portfolio
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <PortfolioForm />
          <ModalFooter>
            <Button onClick={onClose} colorScheme="yellow" pl="20px">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
