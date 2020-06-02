import React from "react";

const AvailableOptions = ({ icons }) => {
  return (
    <div className="available-options">
      <h6>Available options:</h6>
      <div className="available--icons">{icons}</div>
      <p>Leave us a comment at checkout to specify.</p>
    </div>
  );
};

export default AvailableOptions;
