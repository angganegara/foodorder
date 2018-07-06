import { store } from 'react-easy-state';

const snacks = store({
  open: false,
  activeDate: null,
  itemId: null
});

export default snacks;
