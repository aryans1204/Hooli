import React, { useEffect, useState } from "react";
import * as Spinners from "react-spinners";

/**
 * Returns table of investments.
 * @export
 * @function
 * @returns {JSX.Element}
 */
export const InvestmentTable = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [equities, setEquities] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * React Hook that fetches portfolio data.
   * If portfolio data is found in sessionStorage, it sets the state with the data from session storage.
   * If not found, it calls getPortfolioData().
   * @function
   * @name useEffect
   * @returns {void}
   */
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
      setIsLoading(false);
    }
  }, []);

  /**
   * React Hook that updates the equities state when portolioData changes.
   * @function
   * @name useEffect
   * @param {array} portfolioData
   * @returns {void}
   */
  useEffect(() => {
    if (
      sessionStorage.getItem("portfolios") !== "null" &&
      sessionStorage.getItem("portfolios") !== "undefined" &&
      sessionStorage.getItem("portfolios") !== null &&
      sessionStorage.getItem("portfolios") !== undefined &&
      portfolioData !== null
    ) {
      setEquities(portfolioData[0].equities);
    }
  }, [portfolioData]);

  /**
   * Renders a table of equities with their respective P&L (profit and loss) data.
   * @function
   * @param {Array} equities
   * @returns {JSX.Element}
   */
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
              backgroundColor: "#B794F4",
              border: "none",
              textAlign: "center",
            }}
          >
            {equity.equity_ticker}
          </td>
          <td
            style={{
              color: pnlColor,
              backgroundColor: "#B794F4",
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
                backgroundColor: "#805AD5",
                color: "#FFD700",
              }}
            >
              Equity Ticker
            </th>
            <th
              style={{
                border: "none",
                backgroundColor: "#805AD5",
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

  /**
   * Fetches portfolio data from the backend API and updates state.
   * @function
   * @returns {void}
   */
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
        setPortfolioData(data);
        setIsLoading(false);
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
      {isLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Spinners.BeatLoader color="#805AD5" />
        </div>
      ) : (
        <div>
          {equities ? (
            <EquitiesTable equities={equities}></EquitiesTable>
          ) : (
            <div style={{ textAlign: "center" }}>No Investment Data</div>
          )}
        </div>
      )}
    </div>
  );
};
