import React from 'react';

const SnackDescription = ({ toggleCard, className, title, description }) => (
  <div className={`snack-description ${className}`}>
    <a href="javascript:" onClick={toggleCard} className="snack-description--close"><i className="fa fa-fw fa-long-arrow-alt-left"></i> Close</a>
    <div className="snack-description--title">{title}</div>
    <div className="snack-description--body" dangerouslySetInnerHTML={{__html: description}}></div>
  </div>
);

export default SnackDescription;
