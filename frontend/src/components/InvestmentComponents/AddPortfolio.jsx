import { useState, useEffect, useRef } from "react";
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
import { forwardRef } from "react";
import { useImperativeHandle } from "react";

// component that renders a form for the user to enter their data
// This component is called by the AddPortfolio component (can be found at the bottom of the file)
const PortfolioForm = forwardRef((props, ref) => {
  const [equities, setEquities] = useState([]);
  const [options, setOptions] = useState([]);
  const [addSuccess, setAddSuccess] = useState(null);

  const handleSubmit = async () => {
    console.log(equities);
    console.log(options);
    fetch("https://hooli-backend-aryan.herokuapp.com/api/investments", {
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
          setAddSuccess(false);
        } else {
          console.log("Success");
          console.log(response);
          setAddSuccess(true);
          sessionStorage.removeItem("portfolios");
          sessionStorage.removeItem("tickerData");
          props.edit();
          return response.json();
        }
      })
      .then((data) => {
        //props.setState();
      });
  };

  const clearState = () => {
    setAddSuccess(null);
    props.onClose();
  };

  // Passes teh handleSubmit function to the parent component for them to use
  useImperativeHandle(ref, () => ({ handleSubmit }));

  return (
    <form onSubmit={handleSubmit}>
      {equities.map((equity, index) => (
        <div key={index}>
        <div className={classes["field-text", "required"]}><label htmlFor={`equity_ticker_${index}`}>Ticker:</label></div>
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
          <br></br>

          <div className={classes["field-text", "required"]}><label htmlFor={`equity_buy_price_${index}`}>Buy Price:</label></div>
          <input
            type="number"
            id={`equity_buy_price_${index}`}
            value={equity.equity_buy_price || ""}
            onChange={(event) => {
              const newEquities = [...equities];
              const value = event.target.value !== "" ? event.target.value : 0;
              newEquities[index] = {
                ...newEquities[index],
                equity_buy_price: value,
              };
              setEquities(newEquities);
            }}
          />
          <hr></hr>
        </div>
      ))}

      {options.map((option, index) => (
        <div key={index}>
        <div className={classes["field-text", "required"]}><label htmlFor={`derivative_ticker_${index}`}>Ticker:</label></div>
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
          <div className={classes["field-text", "required"]}><label htmlFor={`option_type_${index}`}>Option Type:</label></div>
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
          <div className={classes["field-text", "required"]}><label htmlFor={`strike_price_${index}`}>Strike Price:</label></div>
          <input
            type="number"
            id={`strike_price_${index}`}
            value={option.strike_price || ""}
            onChange={(event) => {
              const newOptions = [...options];
              const value = event.target.value !== "" ? event.target.value : 0;
              newOptions[index] = {
                ...newOptions[index],
                strike_price: value,
              };
              setOptions(newOptions);
            }}
          />
          <div className={classes["field-text", "required"]}><label htmlFor={`expiration_date_${index}`}>
          Expiration Date:
          </label>
          </div>
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
          <hr></hr>
        </div>
      ))}

      <Button onClick={() => setEquities([...equities, {}])}>Add Equity</Button>
      <Button onClick={() => setOptions([...options, {}])}>Add Option</Button>
      <footer>
        <div>
          {(() => {
            if (addSuccess == false) {
              return <div>An error occurred. Please try again</div>;
            } else if (addSuccess == true) {
              return (
                <div>
                  <div>Successfully added portfolio!</div>
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
      </footer>
    </form>
  );
});

export function AddPortfolio(props) {
  const handleCreatePortfolio = () => {
    // Call the handleSubmit function defined in the child component
    console.log(portfolioFormRef.current);
    if (portfolioFormRef.current) {
      portfolioFormRef.current.handleSubmit();
    }
  };
  const portfolioFormRef = useRef(null);

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
          <PortfolioForm
            ref={portfolioFormRef}
            edit={props.edit}
            onClose={onClose}
          />
          <ModalFooter>
            <Button onClick={handleCreatePortfolio} colorScheme="yellow">
              Submit
            </Button>
            <Button onClick={onClose} colorScheme="yellow" pl="20px">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
