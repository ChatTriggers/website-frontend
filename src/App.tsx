import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import theme from './styles/theme';
import ModulesPage from './pages/ModulesPage';
import PasswordResetPage from './pages/PasswordReset';

const App: React.FunctionComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Route path="/" exact component={ModulesPage} />
        <Route path="/passwordreset" component={PasswordResetPage} />
      </Router>
    </ThemeProvider>
  );
};

export default App;
