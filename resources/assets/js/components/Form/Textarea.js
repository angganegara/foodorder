import React from 'react';

const Textarea = ({ placeholder, label, handleChange, required }) => (
  <div className="form-group">
    {label !== '' && <label>{label} {required && <span className="req">*</span>}</label>}
    <textarea
      type="text"
      className="form-textarea"
      placeholder={placeholder}
      onChange={handleChange}
      rows="8"
    ></textarea>
  </div>
);

export default Textarea;
