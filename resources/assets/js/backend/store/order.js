import { store } from "react-easy-state";
import { observe } from "@nx-js/observer-util";

export const sessionKey = ACTION == "NEW" ? "MPBackEnd.order-new" : "MPBackEnd.order-edit";

let ls = window.sessionStorage;
let currentData = ls.getItem(sessionKey);

const orderState = currentData
  ? store(JSON.parse(currentData))
  : store({
      action: ACTION,
      activePage: 1,
      form: {
        fname: "",
        lname: "",
        email: "",
        phone: "",
        comments: "",
        price: 0,
        discount: 0,
        delivery: 0,
        ecoPrice: 0,
        total: 0,
        payment_type: "cash",
        payment_date: "",
        amount_paid: 0,
        slimSunday: false
      },
      days: [
        { index: 0, day: 1 },
        { index: 1, day: 2 },
        { index: 2, day: 3 },
        { index: 3, day: 4 },
        { index: 4, day: 5 },
        { index: 5, day: 6 }
      ],
      availableDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
      schedules: [],
      copyData: null,
      meals: null,
      mealplans: null,
      presets: null,
      preset: null,
      items: [],
      category: "",
      editor: false,
      editorData: null,
      isSaving: false,
      presetName: "",
      overwrite: false,
      alertOpen: false,
      loadFrom: "",
      showTable: false,
      startingDate: "",
      endDate: "",
      datePeriods: [],
      dateRaw: [],
      duration: 6,
      preview: false,
      carts: null
    });

observe(() => sessionStorage.setItem(sessionKey, JSON.stringify(orderState)));

export default orderState;
