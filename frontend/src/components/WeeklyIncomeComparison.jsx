import React, { Component } from "react";
import NavBar from "./NavBar";
import { useState, useEffect } from "react";
import classes from "./WeeklyIncomeComparison.module.css";

//provides the quarter data for the input date e.g. 2022-Q1
function getQuarter(date) {
  const month = date.getMonth();
  const year = date.getFullYear();
  const quarter = Math.floor(month / 3) + 1;
  return `${year}-Q${quarter}`;
}

//filters result from api to find matching quarter and industry
function filterDataByQuarterAndIndustry(data, filters) {
  return data.filter((item) => {
    return filters.some((filter) => {
      const itemQuarter = item.quarter;
      const itemIndustry = item.industry1.toLowerCase();
      return itemQuarter === filter.quarter && itemIndustry === filter.industry;
    });
  });
}

export function WeeklyIncomeComparison(props) {
  const [apiData, setapiData] = useState(null); //data retrieved from api
  const [userData, setuserData] = useState(null); //user data passed in from parent class as prop
  const [filteredData, setFilteredData] = useState(null);
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
      limit: 30,
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
      (data) => data.quarter === quarter && data.industry1 === industry
    );
    return finalData ? finalData.total_paid_hours : "N.A.";
  };

  const formatDate = (dateString) => {
    const date = dateString.slice(0, 10);
    return date;
  };

  return (
    <div>
      <h2>Weekly hours comparison</h2>
      {userData !== null && filteredData !== null ? (
        <table>
          <thead>
            <tr>
              <th>Quarter</th>
              <th>Start Date</th>
              <th>Industry</th>
              <th>My Weekly Hours</th>
              <th>Recommended Weekly Hours</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((data) => (
              <tr key={data._id}>
                <td>{data.quarter}</td>
                <td>{formatDate(data.start_date)}</td>
                <td>{data.industry}</td>
                <td>{data.weekly_hours ? data.weekly_hours : "N.A."}</td>
                <td>{getRecommendedHours(data.quarter, data.industry)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}
