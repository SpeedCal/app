import React, { useState, useEffect } from "react";
import * as dateFns from "date-fns";
import { useLocation, useHistory, withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { IoIosAdd } from "react-icons/io";
import Form from './Form';
//import { logger } from "services/Logger";
import makeArrayOfDateStr from '../helpers/makeArrayOfDateStr'
import makeDateStrFromDateObj from '../helpers/makeDateStrFromDateObj'

//function Calendar(){
const Calendar = ({ history }) => {
  //const history = useHistory()
  const location = useLocation()
  const search = queryString.parse(location.search)
  const searchDate = dateFns.parse(search.selected, 'yyyy-MM-dd', new Date())
  const initialDate = dateFns.isValid(searchDate) ? searchDate : new Date()

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [form, setForm] = useState(false);
  const [edit, setEdit] = useState(false);
  const [eventDates, setEventDates] = useState([])
  const [eventTitle, setEventTitle] = useState('')

  // const [search, setSearch] = useState(queryString.parse(rawLocation.search));
  // console.log(rawLocation)
  // console.log(search)
  //console.log('history:  ', history.location.search)
  //console.log('location: ', location.search)

  //history.listen(loc => {
  //  console.log('loc: ', loc)
  //})
  useEffect(() => history.listen((newHistory) => {
    const newDate = queryString.parse(newHistory.search)?.selected
    const historyDate = dateFns.parse(newDate, 'yyyy-MM-dd', new Date())
    setSelectedDate(historyDate)
  }), [])

  const onDateClick = date => {
    const day = dateFns.parse(date, 'yyyy-MM-dd', new Date())

    const newState = Object.assign({}, history.state, {
      selected: date
    })

    history.push({
      search: '?' + queryString.stringify(newState),
      state: newState
    })

    setSelectedDate(day)
    // console.log('CLICK', day, date)
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

  const makeEvent = () => {
    setForm(true);
  }
  const editEvent = () => {
    console.log('edit')
    setEdit(true);
  }

  const closeForm = (event) => {
    setForm(false);
    setEdit(false);
    if (event === "DELETE") {
      setEventDates([]);
      setEventTitle('');
    } else if (event) {

      const newState = Object.assign({}, history.state, {
        events: [event]
      })

      history.push({
        search: '?' + queryString.stringify(newState),
        state: newState
      })
      // console.log('event: ', event)
      // let startDate = dateFns.getDayOfYear(event.startDate); //pulls off day of the month from startDate obj.
      // console.log('startDate: ', startDate)
      // let numDays = Math.round((event.endDate - event.startDate) / 86400000); //number of milliseconds in a day.
      // let datesOfEvent = [startDate];

      let result = dateFns.eachDayOfInterval({
        start: event.startDate,
        end: event.endDate
      })
      let dateStrArray = makeArrayOfDateStr(result)

      setEventDates(dateStrArray);
      setEventTitle(event.title);
    }
  }

  const renderCells = () => {
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";
    let currentDateString = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        currentDateString = makeDateStrFromDateObj(day)

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
            <span className="bg">{formattedDate}</span>
            {form ? null : <span><IoIosAdd className="add-event-button" size={25} onClick={makeEvent} /></span>}
            {/* Chained ternary checks if the current date being rendered is a member of the eventDates array, if 
            not then null. Otherwise insert the event stripe and only put the title if it's the fisrt date of the event. */}
            {!eventDates.includes(currentDateString)
              ? null
              : (currentDateString === eventDates[0])
                ? <div className="event-stripe" onClick={editEvent}>{eventTitle}</div>
                : <div className="event-stripe">&nbsp;</div>
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
      {form ? <Form closeForm={closeForm} /> : null}
      {edit ? <Form closeForm={closeForm} edit={edit} /> : null}
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}

export default withRouter(Calendar);
