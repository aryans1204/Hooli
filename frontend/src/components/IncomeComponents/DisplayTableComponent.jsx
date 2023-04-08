import React, { useState } from "react";

/**
 * Component to display table of income records.
 * @param {*} props
 * @returns {JSX.Element}
 */
function DisplayTableComponent(props) {
  const [selectedItem, setSelectedItem] = useState(null);


  /**
   * Sets the selected item when clicked.
   */
  function handleItemClick(item) {
    setSelectedItem(item);
    props.onItemSelected(item);
  }

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Industry</th>
          <th>Monthly Income</th>
          <th>Start Date</th>
        </tr>
      </thead>
      <tbody>
        {props.items.map((item) => (
          <tr key={item._id}>
            <td>
              <input
                type="checkbox"
                checked={selectedItem === item}
                onChange={() => handleItemClick(item)}
              />
            </td>
            <td>{item.industry}</td>
            <td>${item.monthly_income}</td>
            <td>{item.start_date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DisplayTableComponent;
