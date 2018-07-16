import React from 'react';

const ExampleMenu = ({ menu }) => (
  <div className="details--example-menu">
    <h3><i className="far fa-fw fa-check-circle"></i> What you get</h3>
    <div className="details--example-menu--body" dangerouslySetInnerHTML={{__html: menu}}></div>
  </div>
);

export default ExampleMenu;
