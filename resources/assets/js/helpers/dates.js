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
    checkDate.hour(0);

    if (!days.includes(checkDate.format("YYYY-MM-DD"))) {
        return false;
    }

    let day = date.getDay();
    let hours = today.getHours();
    let limit;
    let duration = 12;

    let mtoday = moment().set({ year: today.getFullYear(), month: today.getMonth(), date: today.getDate(), hour: today.getHours(), minute: 0 });
    let diff = checkDate.diff(mtoday, "hours");

    //console.log(day + ': ' + mtoday.format('ddd, DD MMM HH:mm') + '. difference with ' + checkDate.format('ddd, DD MMM HH:mm') + ' is ' + checkDate.diff(mtoday, "hours") + ' hours');

    if (today.getDay() == 0 && day == 1) {
        return true;
    }

    if (diff < duration) {
        return true;
    }

    return false;
};
