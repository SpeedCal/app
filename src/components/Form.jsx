import React, { useState } from "react";
import DatePicker from 'react-datepicker';
import { Button, FormGroup, FormControl, ControlLabel, Alert } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";

export default function Form(props) {
  // console.log('props: ', props)
  const { closeForm, event } = props;
  console.log('event: ', event)
  const [startDate, setStartDate] = useState(event ? event.startDate : new Date());
  const [endDate, setEndDate] = useState(event ? event.endDate : new Date());
  const [title, setTitle] = useState(event ? event.title : props.title || '');
  const [dateError, setDateError] = useState(false);

  const saveEvent = () => {
    const newEvent = { title, startDate, endDate }

    //check for date error
    if (startDate > endDate) {
      setDateError(true);
    } else {
      setDateError(false);
      closeForm(newEvent);
    }
  }

  const cancelEvent = () => {
    console.log('cancel')
    setDateError(false);
    closeForm();
  }

  const deleteEvent = () => {
    setDateError(false);
    closeForm("DELETE");
  }

  return (
    <div className="event-form-container">
      <div className="form-element">
        <form >
          <FormGroup controlId='title' bsSize='large'>
            <ControlLabel>Title: </ControlLabel>
            <FormControl
              required
              autoFocus
              type='text'
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </FormGroup>
          <div className="dates-buttons">
            <div><ControlLabel>Start Date:</ControlLabel>{' '}<DatePicker selected={startDate} onChange={date => setStartDate(date)} /></div>
            <div><ControlLabel>End Date:</ControlLabel>{' '}<DatePicker selected={endDate} onChange={date => setEndDate(date)} />{' '}</div>
            <div>
              <Button onClick={saveEvent} variant="primary" className="btn-primary">Save</Button>{' '}
              <Button onClick={cancelEvent} variant="secondary" className="btn-secondary">Cancel</Button>{' '}
              {event ? <Button onClick={deleteEvent} variant="secondary" className="btn-danger">Delete</Button> : null}
            </div>
          </div>
        </form>
      </div>
      {dateError ? <Alert className="alert-danger">Start date must be equal to or before the end date.</Alert> : null}
    </div>
  )
}

