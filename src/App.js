import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Calendar from 'components/Calendar';
import './styling/App.css';
import './styling/Form.css';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route
            exact
            path='/calendar.jpg'
            render={(props) => <Calendar {...props} takingScreenShot={true} />}
          />
        </Switch>
      </Router>
    );
  }
}

function Home() {
  return (
    <div className='App'>
      <header>
        <div id='logo'>
          <span className='icon'>date_range</span>
          <span>
            speed<b>cal</b>.date
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
