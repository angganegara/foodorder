import React from 'react';
import { view } from 'react-easy-state';

import { Radio, RadioGroup } from '@blueprintjs/core';

import cartState from '../store';

const makeSelection = str => {
  return str.split(',');
}

const isSnackOptionExist = (data, id, type, index, scheduleIndex, item) => {
  if (
    data.hasOwnProperty('snackOptions') &&
    data.snackOptions.hasOwnProperty(id) &&
    data.snackOptions[id].hasOwnProperty(type)
  ) {
    return cartState.added[index].schedules[scheduleIndex].snackOptions[id][type];
  } else {
    // give default value
    let opts = null;
  }
}

const SnackOption = ({ id, item, handleClick, updateSnackOption, index, scheduleIndex }) => (
  <div className="snack-option">
    {item.protein && (
      <div className="snack-option--section">
        <RadioGroup
          label="Select Protein"
          onChange={(e) => updateSnackOption(e, id, 'protein')}
          selectedValue={isSnackOptionExist(cartState.added[index].schedules[scheduleIndex], id, 'protein', index, scheduleIndex, item)}
        >
          {makeSelection(item.protein).map((option, i) => <Radio key={i} label={option} value={option} />)}
        </RadioGroup>
      </div>
    )}
    {item.flavour && (
      <div className="snack-option--section">
        <RadioGroup
          label="Select Flavour"
          onChange={(e) => updateSnackOption(e, id, 'flavour')}
          selectedValue={isSnackOptionExist(cartState.added[index].schedules[scheduleIndex], id, 'flavour', index, scheduleIndex, item)}
        >
          {makeSelection(item.flavour).map((option, i) => <Radio key={i} label={option} value={option} />)}
        </RadioGroup>
      </div>
    )}
    <div className="snack-option--section">
      <a href="javascript:" title="" className="snack-option--add" onClick={(e) => handleClick(e, id)}><i className="fal fa fa-plus"></i> ADD SNACK</a>
    </div>
  </div>
);

export default view(SnackOption);
