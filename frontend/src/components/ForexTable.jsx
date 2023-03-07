import React from 'react';
import { Table, Thead, Tbody, Tfoot, Tr, 
    Th, Td, TableContainer,} from '@chakra-ui/react';
import classes from './Forex.module.css';

const ForexTable = ({ data }) => {
  return (
    <div className={classes.currencyDiv}>
    <p>THIS IS THE FOREX TABLE THINGIE</p>

        <TableContainer>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th>Currency Pairs</Th>
                        <Th>Rate</Th>
                        <Th isNumeric>Fluctuation</Th>
                    </Tr>
                </Thead>
                <Tbody>

                        {/* <Tr>
                            <Td>inches</Td>
                            <Td>millimetres (mm)</Td>
                            <Td isNumeric>25.4</Td>
                        </Tr> */}

                </Tbody>
            </Table>
        </TableContainer>
    </div>
  );
};

export default ForexTable;