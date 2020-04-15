import React, { useState, useEffect } from "react";
import * as dateFns from "date-fns";
import { useLocation, useHistory, withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { IoIosAdd } from "react-icons/io";
import Form from './Form';
//import { logger } from "services/Logger";
import makeArrayOfDateStr from '../helpers/makeArrayOfDateStr'
import makeDateStrFromDateObj from '../helpers/makeDateStrFromDateObj'
import urlReader from '../helpers/urlReader';
import makeEventsArray from '../helpers/makeEventsArray';

const Calendar = ({ history }) => {
  const location = useLocation()
  const search = queryString.parse(location.search)
  const eventsArray = makeEventsArray(search);
  const urlEvent = urlReader(search);
  // console.log('urlEvent: ', urlEvent)
  const searchDate = dateFns.parse(search.selected, 'yyyy-MM-dd', new Date());
  const initialDate = dateFns.isValid(searchDate) ? searchDate : new Date();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [edit, setEdit] = useState(false);
  const [eventDates, setEventDates] = useState(eventsArray || []);
  const [eventTitle, setEventTitle] = useState(search.title || '');
  const [event, setEvent] = useState(urlEvent || null);
  const [plusClickDate, setPlusClickDate] = useState(null);
  // console.log('eventDates: ', eventDates);
  // console.log('calendar event: ', event);

  useEffect(() => history.listen((newHistory) => {
    const newDate = queryString.parse(newHistory.search)?.selected
    const historyDate = dateFns.parse(newDate, 'yyyy-MM-dd', new Date())
    setSelectedDate(historyDate)
  }), [])

  const onDateClick = date => {
    const day = dateFns.parse(date, 'yyyy-MM-dd', new Date())
    // console.log('day: ', day)
    setSelectedDate(day)
  };

  const nextMonth = () => {
    setCurrentMonth(dateFns.addMonths(currentMonth, 1))
  };

  const prevMonth = () => {
    setCurrentMonth(dateFns.subMonths(currentMonth, 1))
  };

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  }

  const renderDays = () => {
    const dateFormat = "iiii";
    const days = [];

    let startDate = dateFns.startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  }

  const editEvent = (date) => {
    // console.log('current Date: ', selectedDate)
    // const location = useLocation()
    console.log('date: ', date)
    if (!event) {
      setPlusClickDate(date)
    }
    setEdit(true);
  }

  const closeForm = (event) => {
    setEdit(false);
    if (event === "DELETE") {
      setEventDates([]);
      setEventTitle('');
      setEvent(null);

      // resetting url to empty as well.
      const newState = Object.assign({})

      history.push({
        search: '?' + queryString.stringify(''),
        state: newState
      })

    } else if (event) {
      let result = dateFns.eachDayOfInterval({
        start: event.startDate,
        end: event.endDate
      })
      let dateStrArray = makeArrayOfDateStr(result)
      console.log('next:  ', event)
      console.log(dateStrArray)
      setEvent(event);
      setEventDates(dateStrArray);
      setEventTitle(event.title);

      const newState = Object.assign({}, {
        title: event.title,
        events: dateStrArray,
      })
      // console.log('newState: ', newState)
      history.push({
        search: '?' + queryString.stringify(newState),
        state: newState
      })
    }
  }

  const renderCells = () => {
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "dd";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";
    let currentDateString = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        // console.log('formated date: ', formattedDate)
        // console.log('day: ', day)
        currentDateString = makeDateStrFromDateObj(day)
        // console.log('eventDates: ', eventDates);
        // console.log('currentDateString: ', currentDateString)
        // This is gross - I think this works because `const` prevents further mutation.
        // If the onClick() fn uses `day` the selected class never moves...
        const cloneDay = day;

        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
              }`}
            key={day}
            onClick={() => onDateClick(dateFns.format(cloneDay, 'yyyy-MM-dd'))}
          >
            <span className="number">{formattedDate}</span>
            {/* <span className="bg">{formattedDate}</span> */}
            {event ? <div>&nbsp;</div> : <span className={currentDateString}><IoIosAdd className="add-event-button" size={25} onClick={() => editEvent(cloneDay)} /></span>}
            {/* Chained ternary checks if the current date being rendered is a member of the eventDates array, if 
            not then null. Otherwise insert the event stripe and only put the title if it's the fisrt date of the event. */}
            {!eventDates.includes(currentDateString)
              ? null
              : (currentDateString === eventDates[0])
                ? <div className="event-stripe" onClick={editEvent}>{eventTitle}</div>
                : <div className="event-stripe" onClick={editEvent}>&nbsp;</div>
            }
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  return (
    <div className="calendar">
      {edit ? <Form closeForm={closeForm} event={event} selected={selectedDate} plusClickDate={plusClickDate} /> : null}
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}

export default withRouter(Calendar);
