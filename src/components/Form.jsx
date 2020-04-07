import React, { Component, useState, useEffect } from "react";
// import closeForm from './Calendar';
import DatePicker from 'react-datepicker';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

export default function Form(props) {
  const { closeForm } = props;
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [title, setTitle] = useState(props.title || '')

  const saveEvent = () => {
    console.log('save')
    console.log('title: ', title)
    console.log('start date: ', startDate)
    console.log('end date: ', endDate)
    closeForm();
  }
  const cancelEvent = () => {
    console.log('cancel')
    closeForm();
  }

  return (
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
        <Button onClick={saveEvent} >Save</Button>
        <Button onClick={cancelEvent} >Cancel</Button>
      </form>
    </div>
  )

}

