import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import theme from './styles/theme';
import PasswordResetPage from './pages/PasswordReset';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import ModulesListPage from './pages/ModulesListPage';
import MobileFilterPage from './pages/MobileFilterPage';
import ModulePage from './pages/ModulePage';

const App: React.FunctionComponent = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <Route path="/passwordreset" component={PasswordResetPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/create-account" component={CreateAccountPage} />
      <Route path="/modules" exact component={ModulesListPage} />
      <Route path="/modules/filter" component={MobileFilterPage} />
      <Route path="/modules/search/:module([\w ]+)" component={ModulePage} />
    </Router>
  </ThemeProvider>
);

export default App;
