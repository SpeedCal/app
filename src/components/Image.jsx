import React from "react";

class Image extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date()
  };

  render() {
    return (
      <div className="calendar-image">
        calendar-image
      </div>
    );
  }
}

export default Image;