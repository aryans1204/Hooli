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

  function handleRemove() {
    /*console.log(props.data._id);
    return fetch("/api/income/" + props.data._id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 500 || response.status === 404) {
          console.log("Some error occurred - " + response.status);
        } else {
          console.log("Removed");
          //setResult(result.filter((item) => item._id !== selectedItem._id));
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      });*/
    console.log("hello");
  }

  function handleAdd() {
    /*handleRemove().then(() => {
      fetch("/api/income", {
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
          weekly_hours: values.weeklyHours,
          company: values.company,
        }),
      })
        .then((response) => {
          if (response.status === 500) {
            console.log("Some error occurred - " + response.status);
            setAddSuccess(false);
          } else {
            console.log("Added new");
            setAddSuccess(true);
            return response.json();
          }
        })
        .then((data) => {
          console.log(data);
          props.setState();
        });
    });*/
    console.log("hello again");
  }
  return (
    <div>
      <Modal isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="30px">
            Edit equity
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
              onClick={handleAdd}
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

  const handleSubmit = (item) => {
    if (item.derivative_ticker) {
      console.log("it's an option");
      setTargetFound(true);
      setTargetData(item);
    } else if (item.equity_ticker) {
      console.log("It's an equity");
      setTargetFound(true);
      setTargetData(item);
    } else {
      console.log("Something wrong here");
    }
    console.log(item);
  };
  return (
    <div>
      <StockSelector data={props.data} onSubmit={handleSubmit} />
      <div>
        {targetFound === true ? (
          <EditEquity
            //isOpen={isOpen}
            //onClose={onClose}
            //onOpen={onOpen}
            data={targetData}
            setTargetFound={setTargetFound}
            //setState={setState}
          />
        ) : null}
      </div>
    </div>
  );
}
