import React, { useState } from "react";


/**
 * Component for display table.
 * @param {*} props
 * @returns {*}
 */
function DisplayTableComponent(props) {
  const [selectedItem, setSelectedItem] = useState(null);

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
            <td>{item.monthly_income}</td>
            <td>{item.start_date.substring(0, 10)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DisplayTableComponent;
