import React, { Component } from "react";
import NavBar from "./NavBar";
import { useState, useEffect } from "react";
import classes from "./WeeklyIncomeComparison.module.css";

function getQuarter(date) {
  const month = date.getMonth();
  const year = date.getFullYear();
  const quarter = Math.floor(month / 3) + 1;
  return `${year}-Q${quarter}`;
}

export function WeeklyIncomeComparison(props) {
  const [apiData, setapiData] = useState(""); //data retrieved from api
  const [userData, setuserData] = useState(null); //user data passed in from parent class as prop
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
    console.log(tempData);
    setuserData(tempData); //userData now contains the 5 latest income data based on start_date
  }, [props.data]);
  const endpoint = "https://data.gov.sg/api/action/datastore_search";
  const resource_id = "1109b8a4-dafe-42af-840e-0cf447147d5e";
  const query_params = {
    resource_id: resource_id,
    limit: 5,
    sort: "quarter desc",
  };

  const url = new URL(endpoint);
  Object.keys(query_params).forEach((key) =>
    url.searchParams.append(key, query_params[key])
  );
  useEffect(() => {
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setapiData(data);
        data.result.records.map((record) => {
          console.log(record.quarter);
          console.log(record.total_paid_hours);
          console.log(record.industry1);
        });
        console.log(data.result.records);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <div>
      <h1>Income Data</h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {apiData &&
          apiData.result.records.map((record) => (
            <li key={record._id}>
              Quarter: {record.quarter}, Total Paid Hours:{" "}
              {record.total_paid_hours}, Industry: {record.industry1}
            </li>
          ))}
      </ul>
    </div>
  );
}
