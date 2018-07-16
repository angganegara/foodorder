import { store } from 'react-easy-state';

const snacks = store({
  open: false,
  activeDate: null,
  itemId: null,
  items: null
});

export default snacks;
