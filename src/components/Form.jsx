import React, { useState } from "react";
// import closeForm from './Calendar';
import DatePicker from 'react-datepicker';
import { Button, FormGroup, FormControl, ControlLabel, Alert } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
// import { Alert } from 'reactstrap';


export default function Form(props) {
  const { closeForm } = props;
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [title, setTitle] = useState(props.title || '');
  const [dateError, setDateError] = useState(false);

  const saveEvent = () => {
    console.log('save')
    // console.log('title: ', title)
    // console.log('start date: ', startDate)
    // console.log('end date: ', endDate)
    const newEvent = { title, startDate, endDate }
    console.log(newEvent)

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
              <Button onClick={cancelEvent} variant="secondary" className="btn-secondary">Cancel</Button>
            </div>
          </div>
        </form>
      </div>
      {dateError ? <Alert className="alert-danger">Start date must be equal to or before the end date.</Alert> : null}
    </div>
  )
}

