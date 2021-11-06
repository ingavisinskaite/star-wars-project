import './App.scss';
import People from './components/people/people';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Person from './components/person/person';
import { useState } from 'react';
import Logo from './components/logo/logo';

function App() {
  const [isCrawlActive, setIsCrawlActive] = useState<boolean>(false);

  return (
    <>
      <Logo isCrawlActive={isCrawlActive} />
      <Router>
        <Switch>
          <Route exact path="/people">
            <People />
          </Route>
          <Route exact path="/people/:id">
            <Person isCrawlActive={isCrawlActive} setIsCrawlActive={setIsCrawlActive} />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
