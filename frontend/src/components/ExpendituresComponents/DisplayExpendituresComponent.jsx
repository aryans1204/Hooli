import React from "react";
import { useState, useEffect } from "react";
import { VStack } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'

/**
 * Component for displaying most recent 5 expenditures.
 * @export
 * @function
 * @param {*} props 
 * @returns {JSX.Element}
 */
export function DisplayExpendituresComponent(props) {

  const [result, setResult] = useState(null);
  /**
   * React hook that sets result with props data.
   * Is triggered with every change in props data.
   * @function
   * @param {array} dependencies
   * @returns {void}
   */
  useEffect(() => {
    setResult(props.data);
  }, [props.data]);

  var displayData = [
    {memo: 'No Record', amount: null},
    {memo: 'No Record', amount: null},
    {memo: 'No Record', amount: null},
    {memo: 'No Record', amount: null},
    {memo: 'No Record', amount: null},
  ];

  if (result !== null) {
    const sortedData = result.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );
    for (var count=0; count<sortedData.length; count++) {
        if (count==5) {break;}
        displayData[count].memo = sortedData[count].memo;
        displayData[count].amount = sortedData[count].amount;
    }
  };

  return (
    <VStack
      spacing={1}
      align='stretch'
    >
    <Box h='50px' bg='#290849' borderRadius={200} maxW={280}>
      <Text color='white' mx='2em'>{displayData[0].memo}&nbsp;&nbsp;&nbsp;${displayData[0].amount} </Text>
    </Box>
    <Box h='50px' bg='#55185d' borderRadius={200} maxW={280}>
      <Text color='white' mx='2em'>{displayData[1].memo}&nbsp;&nbsp;&nbsp;${displayData[1].amount}</Text>
    </Box>
    <Box h='50px' bg='#290849' borderRadius={200} maxW={280}>
      <Text color='white' mx='2em'>{displayData[2].memo}&nbsp;&nbsp;&nbsp;${displayData[2].amount}</Text>
    </Box>
    <Box h='50px' bg='#55185d' borderRadius={200} maxW={280}>
      <Text color='white' mx='2em'>{displayData[3].memo}&nbsp;&nbsp;&nbsp;${displayData[3].amount}</Text>
    </Box>
    <Box h='50px' bg='#290849' borderRadius={200} maxW={280}>
      <Text color='white' mx='2em'>{displayData[4].memo}&nbsp;&nbsp;&nbsp;${displayData[4].amount}</Text>
    </Box>
    </VStack>
  );
}