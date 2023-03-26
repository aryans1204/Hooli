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

function EditEquity(props) {
  const initialValues = {
    equity_ticker: "",
    equity_pnl: "",
    equity_buy_price: 0,
    equity_current_price: 0,
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [values, setValues] = useState(initialValues);
  const [addSuccess, setAddSuccess] = useState(null);
  //const [targetData, setTargetData] = useState(null);
  const [initialRender, setInitialRender] = useState(true);
  const handleInputChange = (e) => {
    var { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  useEffect(() => {
    onOpen();
    console.log(props.data);
    console.log(props.portfolios);
  }, []);

  useEffect(() => {
    if (!initialRender && !isOpen) {
      props.setTargetFound(false);
    }
    setInitialRender(false);
  }, [isOpen]);

  const clearState = () => {
    setValues(initialValues);
    setAddSuccess(null);
    //props.setTargetFound(false);
    onClose();
  };

  function handleSubmit() {
    console.log("data");
    console.log(props.data);
    console.log("test");
    console.log(props.portfolio);
    fetch("/api/investments/equities/" + props.data._id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        equity_ticker: values.equity_ticker,
        equity_pnl: values.equity_pnl,
        equity_buy_price: values.equity_buy_price,
        equity_current_price: values.equity_current_price,
      }),
    })
      .then((response) => {
        if (response.status === 400 || response.status === 404) {
          console.log("Some error occurred - " + response.status);
        } else {
          console.log("Edited");
          //setResult(result.filter((item) => item._id !== selectedItem._id));
          console.log(response);
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      });
  }

  return (
    <div>
      <Modal isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="30px">
            Add equity
          </ModalHeader>
          <ModalBody>
            Ticker<br></br>
            <input
              type="text"
              placeholder="ticker"
              size="30"
              required
              name="equity_ticker"
              onChange={handleInputChange}
            ></input>
          </ModalBody>
          <ModalBody>
            P&L<br></br>
            <input
              type="text"
              placeholder="P&L"
              size="30"
              required
              name="equity_pnl"
              onChange={handleInputChange}
            ></input>
          </ModalBody>
          <ModalBody>
            Buy price<br></br>
            <input
              type="number"
              placeholder="price"
              size="30"
              required
              name="equity_buy_price"
              onChange={handleInputChange}
            ></input>
          </ModalBody>
          <ModalBody>
            Current price<br></br>
            <input
              type="number"
              placeholder="price"
              size="30"
              required
              name="equity_current_price"
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
            <Button onClick={clearState} colorScheme="yellow" pl="20px">
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
    </div>
  );
}

//function that renders the 'Edit' button
export function EditPortfolio(props) {
  const [targetFound, setTargetFound] = useState(false);
  const [targetData, setTargetData] = useState(null);

  // props.data._id will be the id used to locate the portfolio containing the data we want to remove
  const removeEquity = (item) => {
    console.log(item);
    fetch("/api/investments/equities/" + props.data._id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        equity_ticker: item.equity_ticker,
      }),
    })
      .then((response) => {
        if (response.status === 500) {
          console.log("Some error occurred - " + response.status);
        } else {
          console.log("Removed");
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      });
  };

  const removeOption = (item) => {
    console.log(item);
    fetch("/api/investments/options/" + props.data._id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        derivative_ticker: item.derivative_ticker,
      }),
    })
      .then((response) => {
        if (response.status === 500) {
          console.log("Some error occurred - " + response.status);
        } else {
          console.log("Removed");
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      });
  };

  const handleSubmit = (item) => {
    console.log(props.data);
    if (item.derivative_ticker) {
      removeOption(item);
      setTargetFound(true);
      setTargetData(item);
    } else if (item.equity_ticker) {
      removeEquity(item);
      setTargetFound(true);
      setTargetData(item);
    } else {
      console.log("Something wrong here");
    }
  };
  return (
    <div>
      <StockSelector data={props.data} onSubmit={handleSubmit} />
      {/*<div>
        {targetFound === true ? (
          <EditEquity
            data={targetData}
            setTargetFound={setTargetFound}
            portfolio={props.data}
            //setState={setState}
          />
        ) : null}
        </div>*/}
    </div>
  );
}
