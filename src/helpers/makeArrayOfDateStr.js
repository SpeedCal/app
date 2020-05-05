import * as dateFns from "date-fns";

const makeArrayOfDateStr = (arrayDateObj) => {
  let arrayOfDateStr = [];

  arrayDateObj.forEach(dateObj => {
    let day = dateFns.getDate(dateObj);
    if (day < 10) {
      day = `0${day}`;
    }
    let month = dateFns.getMonth(dateObj) + 1;
    let year = dateFns.getYear(dateObj);
    let dateStr = `${year}-${month}-${day}`;
    arrayOfDateStr.push(dateStr)
  })

  return arrayOfDateStr
}

export default makeArrayOfDateStr;
