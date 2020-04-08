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
      console.log('start date greater than endDate')
      console.log('dateError: ', dateError)
      setDateError(true);

    } else {
      console.log('start date equal endDate')
      setDateError(false);
      closeForm(newEvent);
    }
    console.log('dateError: ', dateError)

  }
  const cancelEvent = () => {
    console.log('cancel')
    console.log('dateError: ', dateError)

    setDateError(false);
    console.log('dateError: ', dateError)

    closeForm();
  }

  return (
    <div>
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
          <ControlLabel>Start Date: </ControlLabel><DatePicker selected={startDate} onChange={date => setStartDate(date)} />
          <ControlLabel>End Date: </ControlLabel><DatePicker selected={endDate} onChange={date => setEndDate(date)} />
          <Button onClick={saveEvent} color="primary">Save</Button>
          <Button onClick={cancelEvent} color="secondary">Cancel</Button>
        </form>
      </div>
      {dateError ? <Alert color="danger">Start date must be equal to or before the end date.</Alert> : null}
    </div>
  )

}

