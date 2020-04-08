import React from "react";
import {
  BrowserRouter as Router,
  //Router,
  Switch,
  Route,
  //Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Calendar from "components/Calendar";
//import Image from "components/Image";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/calendar.jpg" component={Calendar} />
        </Switch>
      </Router>
    );
  }
}

function Home() {
  return (
    <div className="App">
      <header>
        <div id="logo">
          <span className="icon">date_range</span>
          <span>
            react<b>calendar</b>
          </span>
        </div>
      </header>
      <main>
        <Calendar />
      </main>
    </div>
  );
}

export default App;
