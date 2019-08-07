import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Grommet } from 'grommet';
import HomePage from './pages/Home';
import ModulesPage from './pages/Modules';
import './App.scss';

const App: React.FunctionComponent = () => {
  return (
    <Grommet>
      <Router>
        <Route path="/" exact component={HomePage} />
        <Route path="/modules" component={ModulesPage} />
      </Router>
    </Grommet>
  );
};

export default App;
