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
    const [commodities, setCommodities] = useState([]);

    const handleSubmit = async (event) => {
      event.preventDefault();
      console.log(equities);
      console.log(options);
      console.log(commodities);
      fetch("/api/investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          equities: equities,
          options: options,
          commodities: commodities,
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

        {commodities.map((commodity, index) => (
          <div key={index}>
            <label htmlFor={`commodity_type_${index}`}>Commodity Type:</label>
            <select
              id={`commodity_type_${index}`}
              value={commodity.commodity_type || ""}
              onChange={(event) => {
                const newCommodities = [...commodities];
                newCommodities[index] = {
                  ...newCommodities[index],
                  commodity_type: event.target.value,
                };
                setCommodities(newCommodities);
              }}
            >
              <option value="">Choose one</option>
              <option value="crude_oil">Crude Oil</option>
              <option value="natural_gas">Natural Gas</option>
              <option value="copper">Copper</option>
              <option value="aluminium">Aluminium</option>
              <option value="wheat">Wheat</option>
              <option value="coffee">Coffee</option>
            </select>
            <label htmlFor={`commodity_price_${index}`}>Price:</label>
            <input
              type="number"
              id={`commodity_price_${index}`}
              value={commodity.commodity_price || 0}
              onChange={(event) => {
                const newCommodities = [...commodities];
                newCommodities[index] = {
                  ...newCommodities[index],
                  commodity_price: event.target.value,
                };
                setCommodities(newCommodities);
              }}
            />
            <hr></hr>
          </div>
        ))}
        <Button onClick={() => setEquities([...equities, {}])}>
          Add Equity
        </Button>
        <Button onClick={() => setOptions([...options, {}])}>Add Option</Button>
        <Button onClick={() => setCommodities([...commodities, {}])}>
          Add Commodity
        </Button>
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
