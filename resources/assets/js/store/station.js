import { store } from 'react-easy-state';

const domain = window.location.hostname;

const station = store({
  stations: [],
  availableStations() {
    return station.stations.filter(s => (s.domain === domain || s.always_visible === 1))
  }
});

export default station;
