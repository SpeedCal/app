
import * as dateFns from "date-fns";

const urlReader = (url) => {
  //parsing new date obj from the first and last index of url events which is an array of dates.
  if (url.events && url.title) {
    const endNum = url.events.length;
    const startDate = dateFns.parse(url.events[0], 'yyyy-MM-d', new Date())
    const endDate = dateFns.parse(url.events[endNum - 1], 'yyyy-MM-d', new Date())
    const title = url.title;
    const event = { title, startDate, endDate }
    return event;
  }

  return false;
}

export default urlReader;