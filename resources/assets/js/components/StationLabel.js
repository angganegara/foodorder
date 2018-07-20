import React from 'react';

const StationLabel = ({ station }) => (
  <React.Fragment>
    {station.station}
    {station.google_map && (<span className="station-map"><a href={station.google_map} target="_blank">Google Map <i className="far fa-external-link-alt"></i></a></span>)}
  </React.Fragment>
)

export default StationLabel;
