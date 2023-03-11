import React, {useState} from 'react';
import { Table, Thead, Tbody, Tr, 
    Th, Td, TableContainer,} from '@chakra-ui/react';
import classes from './Forex.module.css';

const ForexTable = (num) => {
    let count = num.num;
    let fields = [];
    while (count > 0) {
        let val = "dataKey" + count;
        fields.push(JSON.parse(sessionStorage.getItem(val)));
        count -= 1;
    }
    //console.log(fields);
    //console.log("fields of table");

    return (
        <>
        <p>{JSON.stringify(fields)}</p>
        <div className={classes.currencyDiv}>
        <p>THIS IS THE FOREX TABLE THINGIE</p>
            <TableContainer>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Currency Pairs</Th>
                            <Th>Rate</Th>
                            <Th>Fluctuation</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {fields.map((field, index) => (
                        <Tr key={index}>
                            <Td>{field.from}/{field.to}</Td>
                            <Td>{field.rate}</Td>
                            <Td>{field.change}</Td>
                        </Tr>
                    ))}

                    </Tbody>
                </Table>
            </TableContainer>
        </div>
        </>
  );
};

export default ForexTable;