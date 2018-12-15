import moment from "moment";

var startOfWeek = moment().startOf("isoWeek");
var endOfWeek = moment().endOf("isoWeek");

var days = [];
var day = startOfWeek;

while (day <= endOfWeek) {
  days.push(day.format("YYYY-MM-DD"));
  day = day.clone().add(1, "d");
}
for (let i = 1; i <= 2; i++) {
  days.push(day.format("YYYY-MM-DD"));
  day = day.clone().add(i, "d");
}

const limitDates = {
  "1": 5,
  "2": 6,
  "3": 1,
  "4": 2,
  "5": 3,
  "6": 4
};

// disable next wednesday for 4 day package. limit : Monday after 10 pm
export const checkDayLimit = date => {
  let today = new Date();
  let checkDate = moment(date);

  if (!days.includes(checkDate.format("YYYY-MM-DD"))) {
    return false;
  }

  let day = date.getDay();
  let hours = today.getHours();
  let limit;
  let duration = day == 1 ? 47 : 23;

  if (today.getDay() == 6 && hours <= 13) {
    duration = 0;
  }

  let mtoday = moment().set({ year: today.getFullYear(), month: today.getMonth(), date: today.getDate(), hour: 12, minute: 0 });

  switch (day) {
    case 1:
      limit = 17;
      break;
    case 2:
      limit = 17;
      break;
    case 3:
      limit = 17;
      break;
    case 4:
      limit = 17;
      break;
    case 5:
      limit = 17;
      break;
    case 6:
      limit = 12;
      break;
  }

  if (today.getDay() == 0) {
    if (day == 1 || day == 2) {
      return true;
    }
  }

  if (checkDate.diff(mtoday, "hours") == duration) {
    return true;
  }

  for (let i = 1; i <= 6; i++) {
    if (day == i) {
      if (today.getDay() == limitDates[i] && hours >= limit) {
        return true;
      }
    }
  }

  return false;
};
