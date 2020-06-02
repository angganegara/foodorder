import React from "react";

const Input = ({ id, placeholder, label, handleChange, required, error }) => (
  <div className="form-group">
    {label && (
      <label>
        {label} {required && <span className="req">*</span>}
      </label>
    )}
    <input
      id={id}
      type="text"
      className="form-input"
      placeholder={placeholder}
      onChange={handleChange}
    />
    {error && <span className="input-error">{error}</span>}
  </div>
);

export default Input;
