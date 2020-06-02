import React from "react";

const Schedule = ({ indexKey, data, snacks, parseStation, slimSunday }) => (
  <div className={`schedule schedule-${indexKey}`}>
    <div className="review-wrap">
      {data.map((day, index) => (
        <div key={index} className="review-card">
          <div className="review-card--day">
            <span>
              <i className="fal fa-fw fa-angle-down" /> {day.label}
              {day.isSaturday && slimSunday ? (
                <small>(including Slim Sunday)</small>
              ) : (
                ""
              )}
            </span>
          </div>
          {day.snacks.length > 0 && (
            <div className="review-card--body">
              <span className="icon">
                <i className="fa fa-fw fa-coffee" /> snacks
              </span>
              <div className="review-card--body-snacks">
                {day.snacks.length > 0 &&
                  day.snacks.map((s, index) => (
                    <span key={index}>
                      {snacks[s].name} ({day.snacksQty[s]}
                      x)
                      {(snacks[s].protein || snacks[s].flavour) && (
                        <div className="snacks--opt">
                          {day.snackOptions &&
                            day.snackOptions[s] &&
                            day.snackOptions[s].protein && (
                              <p>{day.snackOptions[s].protein}</p>
                            )}
                          {day.snackOptions &&
                            day.snackOptions[s] &&
                            day.snackOptions[s].flavour && (
                              <p>{day.snackOptions[s].flavour}</p>
                            )}
                        </div>
                      )}
                    </span>
                  ))}
              </div>
            </div>
          )}
          <div className="review-card--pickup">
            <span className="icon">
              <i className="fa fa-fw fa-truck" /> Pickup station
            </span>
            <p>{parseStation(day.pickup, index, day.address, day.area)}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Schedule;
