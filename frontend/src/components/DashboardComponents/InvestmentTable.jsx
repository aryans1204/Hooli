import React, { Component, useEffect, useState } from "react";

export const InvestmentTable = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [equities, setEquities] = useState(null);

  useEffect(() => {
    if (
      sessionStorage.getItem("portfolios") === "null" ||
      sessionStorage.getItem("portfolios") === "undefined" ||
      sessionStorage.getItem("portfolios") === null ||
      sessionStorage.getItem("portfolios") === undefined
    ) {
      getPortfolioData();
    } else {
      setPortfolioData(JSON.parse(sessionStorage.getItem("portfolios")));
    }
  }, []);

  useEffect(() => {
    if (portfolioData !== null) {
      console.log(portfolioData);
      setEquities(portfolioData[0].equities);
    }
  }, [portfolioData]);

  const EquitiesTable = ({ equities }) => {
    const tableRows = equities.map((equity) => {
      const equityPnl = parseFloat(equity.equity_pnl.replace("%", ""));
      const pnlColor =
        equityPnl > 0 ? "#64F185" : equityPnl < 0 ? "red" : "default";
      const roundedEquityPnl = parseFloat(equityPnl.toFixed(2));
      return (
        <tr key={equity.equity_ticker}>
          <td
            style={{
              color: "#FFD700",
              backgroundColor: "#6c49bb",
              border: "none",
              textAlign: "center",
            }}
          >
            {equity.equity_ticker}
          </td>
          <td
            style={{
              color: pnlColor,
              backgroundColor: "#6c49bb",
              border: "none",
              textAlign: "center",
            }}
          >
            {roundedEquityPnl}%
          </td>
        </tr>
      );
    });

    return (
      <table>
        <thead>
          <tr>
            <th
              style={{
                border: "none",
                backgroundColor: "#3e286f",
                color: "#FFD700",
              }}
            >
              Equity Ticker
            </th>
            <th
              style={{
                border: "none",
                backgroundColor: "#3e286f",
                color: "#FFD700",
              }}
            >
              Net Change
            </th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    );
  };

  // gets user portfolio data from database
  const getPortfolioData = () => {
    fetch("https://hooli-backend-aryan.herokuapp.com/api/investments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 500) {
          alert("API query limit reached! Please wait for 1 minute");
          console.log("Some error occurred - " + response.status);
          console.log(response);
        } else if (response.headers.get("Content-Length") === "0") {
          console.log("No portfolio found");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        setPortfolioData(data);
        const tempData = JSON.stringify(data);
        if (
          sessionStorage.getItem("portfolios") === "null" ||
          sessionStorage.getItem("portfolios") === "undefined" ||
          sessionStorage.getItem("portfolios") === null ||
          sessionStorage.getItem("portfolios") === undefined
        ) {
          sessionStorage.setItem("portfolios", tempData);
        }
      });
  };

  return (
    <div>
      {equities ? (
        <EquitiesTable equities={equities}></EquitiesTable>
      ) : (
        <div>no data</div>
      )}
    </div>
  );
};
