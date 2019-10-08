import React from 'react';
import {
  BrowserRouter as Router, Route, Redirect, Switch,
} from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { KeyboardArrowLeft as KeyboardArrowLeftIcon } from '@material-ui/icons';
import posed, { PoseGroup } from 'react-pose';
import Drawer from '~components/Drawer';
import theme from './styles/theme';
import routes from './routes';

interface IRouteContainerProps {
  currLocation: string;
}

const RouteContainer = posed.div(({ currLocation }: IRouteContainerProps) => ({
  enter: {
    transform: 'translate(0%)',
    transition: {
      transform: { type: 'tween', ease: 'easeInOut' },
    },
  },
  exit: {
    transform: currLocation === '/modules' ? 'translate(-100%)' : 'translate(100%)',
    transition: {
      transform: { type: 'tween', ease: 'easeInOut' },
    },
  },
}));

const App: React.FunctionComponent = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <Route
        render={({ location }) => (
          <PoseGroup>
            <RouteContainer key={location.key} currLocation={location.pathname}>
              <Switch location={location}>
                {routes.map(({ route, component, name }) => (
                  <Route
                    key={route}
                    path={route}
                    exact
                    render={({ history, match }) => {
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
              </Switch>
            </RouteContainer>
          </PoseGroup>
        )}
      />
      <Redirect from="/" to="/modules" />
    </Router>
  </ThemeProvider>
);

export default App;
