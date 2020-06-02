import { store } from "react-easy-state";
import { observe } from "@nx-js/observer-util";
const sessionKey = "mp.v2";

let ls = window.sessionStorage;
let currentData = ls.getItem(sessionKey);

const cartState = currentData
  ? store(JSON.parse(currentData))
  : store({
      added: [],
      cartKey: null
    });

observe(() => sessionStorage.setItem(sessionKey, JSON.stringify(cartState)));

export default cartState;
