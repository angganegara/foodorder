import React from 'react';

const PaymentButton = ({ active, icon, label, handleChange }) => (
  <a
    href="javascript:"
    onClick={handleChange}
    className={`form-section--payment-button ${active ? 'active' : ''}`}
    title=""
  >
    <i className={`fa ${icon}`}></i> {label}
  </a>
);

export default PaymentButton;
