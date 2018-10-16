import React from "react";

const Input = ({ label, column, handleChange, value, classNames }) => (
  <div className={`column ${classNames}`}>
    <label className="pt-label">
      {label}
      <input className="pt-input pt-fill" type="text" onChange={e => handleChange(e, column)} value={value} />
    </label>
  </div>
);

export default Input;
