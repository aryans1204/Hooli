import React, {useState} from 'react';
import { Table, Thead, Tbody, Tfoot, Tr, 
    Th, Td, TableContainer,} from '@chakra-ui/react';
import classes from './Forex.module.css';

const ForexTable = ({ data }) => {
    const [fields, setFields] = useState(data);
    console.log("DFDF"); console.log(fields); console.log(typeof(fields)); console.log("SOMETHING");
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
                    <Tr>
                        <Td>sgfsdfg</Td>
                        <Td>sgfsdfg</Td>
                        <Td>sgfsdfg</Td>
                    </Tr>
                    {fields.map((field, index) => (
                        <Tr key={index}>
                            <Td>{field.base}</Td>
                            <Td>{field.timestamp}</Td>
                            <Td>{field.success}</Td>
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