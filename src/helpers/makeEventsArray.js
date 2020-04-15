const makeEventsArray = (search) => {
  return (Array.isArray(search.events) ? search.events : [search.events]);
}

export default makeEventsArray;