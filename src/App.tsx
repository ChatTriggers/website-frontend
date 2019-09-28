import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import theme from './styles/theme';
import ModulePage from './pages/ModulePage';
import ModulesListPage from './pages/ModulesListPage';
import PasswordResetPage from './pages/PasswordReset';
import MobileFilterPage from './pages/MobileFilterPage';

const App: React.FunctionComponent = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <Route path="/passwordreset" component={PasswordResetPage} />
      <Route path="/modules" exact component={ModulesListPage} />
      <Route path="/modules/filter" component={MobileFilterPage} />
      <Route path="/modules/search/:module([\w ]+)" component={ModulePage} />
    </Router>
  </ThemeProvider>
);

export default App;
