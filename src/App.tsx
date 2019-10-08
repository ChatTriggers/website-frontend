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
import { modulesStore, action, observer } from '~store';

interface IRouteContainerProps {
  currLocation: string;
  firstLoad: boolean;
}

const RouteContainer = posed.div(({ firstLoad, currLocation }: IRouteContainerProps) => {
  if (firstLoad) {
    setTimeout(action(() => { modulesStore.firstLoad = false; }), 500);
  }

  return {
    enter: {
      transform: 'translate(0%)',
      transition: {
        transform: { type: 'tween', ease: 'easeInOut', duration: firstLoad ? 0 : undefined },
      },
    },
    exit: {
      transform: `translate(${currLocation === '/modules' ? '-100' : '100'}%)`,
      transition: {
        transform: { type: 'tween', ease: 'easeInOut' },
      },
    },
  };
});

const App: React.FunctionComponent = observer(() => (
  <ThemeProvider theme={theme}>
    <Router>
      <Route
        render={({ location }) => (
          <PoseGroup>
            <RouteContainer
              key={location.pathname}
              currLocation={location.pathname}
              firstLoad={modulesStore.firstLoad}
            >
              <Switch location={location}>
                {routes.map(({ route, component, name }) => (
                  <Route
                    key={route}
                    path={route}
                    exact
                    render={({ history, match }) => {
                      const backButton = (
                        <IconButton
                          edge="start"
                          onClick={history.goBack}
                        >
                          <KeyboardArrowLeftIcon />
                        </IconButton>
                      );

                      return (
                        <Drawer
                          title={name || match.params.module}
                          button={location.pathname === '/modules' ? undefined : backButton}
                        >
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
));

export default App;
