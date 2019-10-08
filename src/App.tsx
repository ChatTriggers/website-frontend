import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { KeyboardArrowLeft as KeyboardArrowLeftIcon } from '@material-ui/icons';
import Drawer from '~components/Drawer';
import theme from './styles/theme';
import routes from './routes';

const App: React.FunctionComponent = () => (
  <ThemeProvider theme={theme}>
    <Router>
      {routes.map(({ route, component, name }) => (
        <Route
          key={route}
          path={route}
          exact
          render={({ location, history, match }) => {
            const title = name || match.params.module;

            const backButton = (
              <IconButton
                edge="start"
                onClick={history.goBack}
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
            );

            return (
              <Drawer title={title} button={location.pathname === '/modules' ? undefined : backButton}>
                {component}
              </Drawer>
            );
          }}
        />
      ))}
      <Redirect from="/" to="/modules" />
    </Router>
  </ThemeProvider>
);

export default App;
