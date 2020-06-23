import React from 'react';

const SnackDescription = ({ toggleCard, className, title, description }) => (
  <a className={`snack-description ${className}`} onClick={toggleCard}>
    <div className="snack-description--title">{title}</div>
    <div className="snack-description--body" dangerouslySetInnerHTML={{__html: description}}></div>
  </a>
);

export default SnackDescription;
