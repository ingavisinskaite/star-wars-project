import './App.scss';
import People from './components/people';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Person from './components/person';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/people">
            <People />
        </Route>
        <Route exact path="/people/:id">
            <Person />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
