import * as dateFns from 'date-fns';

const urlReader = (url) => {
  //parsing new date obj from the first and last index of url events which is an array of dates.
  if (url.events && url.title) {
    let eventArray = [];
    if (!Array.isArray(url.events)) {
      eventArray.push(url.events);
    } else {
      eventArray = url.events;
    }

    const endNum = eventArray.length;
    const startDate = dateFns.parse(eventArray[0], 'yyyy-MM-dd', new Date());
    const endDate = dateFns.parse(
      eventArray[endNum - 1],
      'yyyy-MM-dd',
      new Date()
    );
    const title = url.title;
    const event = { title, startDate, endDate };
    return event;
  }

  return false;
};

export default urlReader;
