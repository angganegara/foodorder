import React from "react";
import orderState from "../store/order";

const updateForm = (e, column) => {
  let value = e.target.value;
  if (column == "price" || column == "discount" || column == "delivery") {
    if (value == "") {
      value = 0;
    }
    orderState.form[column] = parseInt(value);
    orderState.form.total = parseInt(orderState.form.price) - parseInt(orderState.form.discount) + parseInt(orderState.form.delivery);
  } else {
    orderState.form[column] = value;
  }
};

const Input = ({ label, column, handleChange, value, classNames }) => (
  <div className={`column ${classNames}`}>
    <label className="pt-label">
      {label}
      <input className="pt-input pt-fill" type="text" onChange={e => updateForm(e, column)} value={value} />
    </label>
  </div>
);

export default Input;
