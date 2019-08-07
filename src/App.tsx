import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ParallaxProvider } from 'react-scroll-parallax';
import HomePage from './pages/Home';
import ModulesPage from './pages/Modules';
import './App.scss';

const App: React.FunctionComponent = () => {
  return (
    <ParallaxProvider>
      <Router>
        <Route path="/" exact component={HomePage} />
        <Route path="/modules" component={ModulesPage} />
      </Router>
    </ParallaxProvider>
  );
};

export default App;
