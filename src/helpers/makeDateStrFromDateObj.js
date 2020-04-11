import * as dateFns from "date-fns";

const makeDateStrFromDateObj = (dateObj) => {
  // console.log('dateObj: ', dateObj)
  let day = dateFns.getDate(dateObj, 'dd');
  // console.log('day helper: ', day, typeof day)
  if (day < 10) {
    day = `0${day}`
  }
  let month = dateFns.getMonth(dateObj) + 1;
  let year = dateFns.getYear(dateObj);
  let dateStr = `${year}-${month}-${day}`;
  return dateStr;
}

export default makeDateStrFromDateObj;
