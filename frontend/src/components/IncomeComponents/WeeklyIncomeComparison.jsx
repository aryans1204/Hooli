import React, { Component } from "react";
import NavBar from "../NavBar";
import { useState, useEffect } from "react";
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
import classes from "./WeeklyIncomeComparison.module.css";

//provides the quarter data for the input date e.g. 2022-Q1

/**
 * Returns the input date's year quarter. (e.g. '2022-Q1' for 12 Mar 2022)
 * @param {*} date
 * @returns {string}
 */
function getQuarter(date) {
  const month = date.getMonth();
  const year = date.getFullYear();
  const quarter = Math.floor(month / 3) + 1;
  return `${year}-Q${quarter}`;
}

/**
 * Filters result from API to find matching year quarter and industry type.
 * @param {*} data
 * @param {*} filters
 * @returns {*}
 */
function filterDataByQuarterAndIndustry(data, filters) {
  return data.filter((item) => {
    return filters.some((filter) => {
      const itemQuarter = item.quarter;
      const itemIndustry = item.industry1.toLowerCase();
      return (
        itemQuarter === filter.quarter &&
        itemIndustry === filter.industry.toLowerCase()
      );
    });
  });
}

/**
 * Compares weekly income with the data from API.
 * @export
 * @param {*} props
 * @returns {*}
 */
export function WeeklyIncomeComparison(props) {
  const [apiData, setapiData] = useState(null); //data retrieved from api
  const [userData, setuserData] = useState(null); //user data passed in from parent class as prop
  const [filteredData, setFilteredData] = useState(null);

  // gets latest data from props and adds the quarter data to them every thing the props data changes
  useEffect(() => {
    let tempData = props.data.sort(
      (a, b) => new Date(b.start_date) - new Date(a.start_date)
    );
    console.log(tempData.length);
    if (tempData.length > 5) {
      tempData = tempData.slice(0, 5); //temporary variable to store 5 latest data
    }
    tempData = tempData.map((item) => ({
      ...item,
      quarter: getQuarter(new Date(item.start_date)),
    })); //adds the quarter data to tempData, e.g. 2022-Q2
    setuserData(tempData); //userData now contains the 5 latest income data based on start_date

    //accessing weekly hours API
    const endpoint = "https://data.gov.sg/api/action/datastore_search";
    const resource_id = "1109b8a4-dafe-42af-840e-0cf447147d5e";
    const query_params = {
      resource_id: resource_id,
      sort: "quarter desc",
    };

    const url = new URL(endpoint);
    Object.keys(query_params).forEach((key) =>
      url.searchParams.append(key, query_params[key])
    );
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setapiData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [props.data]);

  // runs everytime apiData is changed
  useEffect(() => {
    if (apiData != null) {
      const filteredDatas = filterDataByQuarterAndIndustry(
        apiData.result.records,
        userData
      );
      setFilteredData(filteredDatas);
    }
  }, [apiData]);

  const getRecommendedHours = (quarter, industry) => {
    const finalData = filteredData.find(
      (data) =>
        data.quarter === quarter && data.industry1 === industry.toLowerCase()
    );
    return finalData ? finalData.total_paid_hours : "N.A.";
  };

  // Formats date to just yyyy-mm-dd format
  const formatDate = (dateString) => {
    const date = dateString.slice(0, 10);
    return date;
  };

  return (
    <div>
      <h3>Weekly hours comparison</h3>
      {userData !== null && filteredData !== null ? (
        <Table variant="striped" colorScheme="purple" size="sm">
          <Thead>
            <Tr>
              <Th>Quarter</Th>
              <Th>Start Date</Th>
              <Th>Industry</Th>
              <Th>Company</Th>
              <Th>My Weekly Hours</Th>
              <Th>
                Average weekly hours per employee by industry in Singapore
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {userData.map((data) => (
              <Tr key={data._id}>
                <Td>{data.quarter}</Td>
                <Td>{formatDate(data.start_date)}</Td>
                <Td>{data.industry}</Td>
                <Td>{data.company ? data.company : "N.A."}</Td>
                <Td>{data.weekly_hours ? data.weekly_hours : "N.A."}</Td>
                <Td>{getRecommendedHours(data.quarter, data.industry)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : null}
    </div>
  );
}
