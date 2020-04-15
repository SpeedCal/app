
import * as dateFns from "date-fns";

const urlReader = (url) => {
  //parsing new date obj from the first and last index of url events which is an array of dates.
  if (url.events && url.title) {
    // console.log('url.events: ', url.events, typeof url.events)
    let eventArray = [];
    if (!Array.isArray(url.events)) {
      // console.log('url.events is not an array')
      // const onlyDate = dateFns.parse(url.events, 'yyyy-MM-d', new Date())
      // console.log('onlyDate: ', onlyDate)
      eventArray.push(url.events);
    } else {
      eventArray = url.events;
    }
    // console.log('eventArray: ', eventArray)
    const endNum = eventArray.length;
    const startDate = dateFns.parse(eventArray[0], 'yyyy-MM-dd', new Date())
    const endDate = dateFns.parse(eventArray[endNum - 1], 'yyyy-MM-dd', new Date())
    const title = url.title;
    const event = { title, startDate, endDate }
    // console.log('urlReader event: ', event)
    return event;
  }

  return false;
}

export default urlReader;