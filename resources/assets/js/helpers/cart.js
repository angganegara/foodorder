/**
 * Helper for Shopping Cart related
 */

const numeral = require('numeral');
import cartState from '../store';

const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
export const parsePrice = price => numeral(price).format('0,0');
export const getIndex = (id = null) => cartState.added.findIndex(item => item.key === id);
export const getScheduleIndex = (itemIndex, date) => cartState.added[itemIndex].schedules.findIndex(sc => sc.date === date);
export const guid = () => s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
