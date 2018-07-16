// disable next monday for 6 day package. limit : friday after 10 pm
export const checkPackage6DisabledDates = (date) => {
  let limit = false;
  let day = date.getDay();
  let hours = date.getHours();

  if (day === 1) {
    const today = new Date();
    if ((date.getMonth() == today.getMonth()) && date.getFullYear() == today.getFullYear()) {
      limit = today;
    }
  }

  if (day === 5 && hours > 22) {
    // friday, past 10pm, set limit to 3 days
    limit = new Date(date.setHours(24 * 3));
  }

  if (day === 6) {
    // saturday, disable next monday
    limit = new Date(date.setHours(24 * 2));
  }

  if (day === 0) {
    // sunday, disable next monday
    limit = new Date(date.setHours(24));
  }
  return limit;
}

// disable next wednesday for 4 day package. limit : Monday after 10 pm
export const checkPackage4DisabledDates = (date) => {
  let limit = false;
  let day = date.getDay();
  let hours = date.getHours();

  if (day === 1 && hours > 22) {
    // monday, past 10pm, set limit to 3 days
    limit = new Date(date.setHours(24 * 2));
  }

  if (day === 2) {
    // tuesday, disable next monday
    limit = new Date(date.setHours(24));
  }

  return limit;
}
