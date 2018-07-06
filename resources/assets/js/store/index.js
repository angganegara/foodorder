import { store } from 'react-easy-state';
import { observe } from '@nx-js/observer-util';
let ls = window.sessionStorage;
let currentData = ls.getItem('mp');

const cartState = currentData ? store(JSON.parse(currentData)) : store({
  added: []
});

observe(() => sessionStorage.setItem('mp', JSON.stringify(cartState)))

export default cartState;
