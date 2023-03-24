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

export default function EditPortfolio(props) {
  const handleSubmit = (item) => {
    console.log(item);
  };
  return (
    <div>
      <StockSelector data={props.data} onSubmit={handleSubmit} />
    </div>
  );
}
