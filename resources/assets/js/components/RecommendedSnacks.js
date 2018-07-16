import React from 'react';

import { view } from 'react-easy-state';
import snackState from '../store/snacks';

const RecommendedSnacks = ({ snacks }) => (
  <div className="details--example-menu snack">
    <h3><i className="far fa-thumbs-up"></i> Recommended</h3>
    <ul>
      {snacks.map((snack, index) => (
        <li key={index} className="snack-thumbs">
          <figure><img src={`/images/snacks/${snack}.jpg`} alt={snackState.items[snack].name} /></figure>
          <div className="snack-thumbs--title">{snackState.items[snack].name}</div>
        </li>
      ))}
    </ul>
  </div>
);

export default view(RecommendedSnacks);
