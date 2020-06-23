import React from "react";
import orderState from "../store/order";

const updateForm = (e, column) => {
  let value = e.target.value;
  orderState.form[column] = value;
};

const Textarea = ({ label, column, handleChange, value, classNames }) => (
  <div className={`column ${classNames}`}>
    <label className="pt-label">
      {label}
      <textarea className="pt-input pt-fill" onChange={e => updateForm(e, column)} value={value} />
    </label>
  </div>
);

export default Textarea;
