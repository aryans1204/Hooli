import React, { useState, useEffect } from "react";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from '@chakra-ui/react'

/**
 * Component for displaying all expenditures in a table.
 * @param {*} props
 * @returns {*}
 */
function DisplayAllExpendituresComponent(props) {

  return (
    <Table variant="striped" colorScheme="purple" size="md">
      <Thead>
        <Tr>
          <Th>Memo</Th>
          <Th>Category</Th>
          <Th>Amount</Th>
          <Th>Date</Th>
        </Tr>
      </Thead>
      <Tbody>
        {props.items.map((item) => (
          <Tr key={item._id}>
            <Td>{item.memo}</Td>
            <Td>{item.category}</Td>
            <Td>{item.amount}</Td>
            <Td>{item.date.slice(0,10)}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default DisplayAllExpendituresComponent;