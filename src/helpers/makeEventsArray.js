
import * as dateFns from "date-fns";

const makeEventsArray = (search) => {
  if (Array.isArray(search.events)) {
    return search.events
  } else {
    return [search.events]
  }
}

export default makeEventsArray;