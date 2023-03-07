import React, { Component } from "react";
import NavBar from "./NavBar";
import { useState, useEffect } from "react";

import classes from "./WeeklyIncomeComparison.module.css";

export function WeeklyIncomeComparison() {
  const [incomeData, setIncomeData] = useState("");
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
        setIncomeData(data);
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
        {incomeData &&
          incomeData.result.records.map((record) => (
            <li key={record._id}>
              Quarter: {record.quarter}, Total Paid Hours:{" "}
              {record.total_paid_hours}, Industry: {record.industry1}
            </li>
          ))}
      </ul>
    </div>
  );
}
