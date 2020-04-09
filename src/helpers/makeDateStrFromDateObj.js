import * as dateFns from "date-fns";

const makeDateStrFromDateObj = (dateObj) => {
  let day = dateFns.getDate(dateObj);
  let month = dateFns.getMonth(dateObj) + 1;
  let year = dateFns.getYear(dateObj);
  let dateStr = `${year}-${month}-${day}`;
  return dateStr;
}

export default makeDateStrFromDateObj;
