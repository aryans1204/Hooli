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
import classes from "./StockSelector.module.css";

// Renders a table with 2 tabs - equity and options, where their respective data will be displayed for the user to select
// This page is mainly used in the delete portfolio data functions
export default function StockSelector(props) {
  const [activeTab, setActiveTab] = useState("equities");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // ActiveTab controls which tab will be displayed
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleSubmit = () => {
    console.log(selectedItem);
    if (props.onSubmit) {
      props.onSubmit(selectedItem);
    }
  };

  const handleConfirmation = () => {
    if (showConfirmation) {
      props.deletePortfolio();
      console.log("Deleting entire portfolio...");
      alert("Deleting entire portfolio...");
      setShowConfirmation(false);
      onClose();
    } else {
      setShowConfirmation(true);
    }
  };

  const resetValues = () => {
    setShowConfirmation(false);
    onClose();
  };

  // equities tab
  const renderEquities = () => {
    const { equities } = props.data;
    if (!equities || equities.length === 0) {
      return <div>No equities data available.</div>;
    }
    return (
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Ticker</th>
            <th>Buy Price</th>
            <th>Current Price</th>
            <th>P&amp;L</th>
          </tr>
        </thead>
        <tbody>
          {equities.map((equity, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedItem === equity}
                  onChange={() => handleItemClick(equity)}
                />
              </td>
              <td>{equity.equity_ticker}</td>
              <td>{equity.equity_buy_price}</td>
              <td>{equity.equity_current_price}</td>
              <td>
                {parseFloat(equity.equity_pnl.replace("%", "")).toFixed(1) +
                  "%"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // options tab
  const renderOptions = () => {
    const { options } = props.data;
    if (!options || options.length === 0) {
      return <div>No options data available.</div>;
    }
    return (
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Ticker</th>
            <th>Option Type</th>
            <th>Current Price</th>
            <th>Strike Price</th>
            <th>Expiration Date</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedItem === option}
                  onChange={() => handleItemClick(option)}
                />
              </td>
              <td>{option.derivative_ticker || "NA"}</td>
              <td>{option.option_type || "NA"}</td>
              <td>{option.derivative_current_price || "NA"}</td>
              <td>{option.strike_price || "NA"}</td>
              <td>{option.expiration_date.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
        Remove
      </Button>
      <Modal isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="30px">
            Remove Portfolio Data
          </ModalHeader>
          <ModalCloseButton onClick={resetValues} />
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
          {activeTab === "equities" && renderEquities()}
          {activeTab === "options" && renderOptions()}
          <ModalFooter>
            <Button onClick={handleConfirmation} colorScheme="red">
              {showConfirmation ? "Are you sure?" : "Delete Entire Portfolio"}
            </Button>
            <Button onClick={handleSubmit} colorScheme="yellow" pl="20px">
              Remove
            </Button>
            <Button onClick={resetValues} colorScheme="yellow" pl="20px">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
