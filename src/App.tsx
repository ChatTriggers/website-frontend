import React from 'react';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import posed, { PoseGroup } from 'react-pose';
import Drawer from '~components/Drawer';
import theme from './styles/theme';
import routes from './routes';
import {
  modulesStore, globalStore, action, observer,
} from '~store';

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
          <Drawer>
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
                      render={({ match }) => {
                        globalStore.setDrawerTitle(name || match.params.module);

                        return component;
                      }}
                    />
                  ))}
                </Switch>
              </RouteContainer>
            </PoseGroup>
          </Drawer>
        )}
      />
    </Router>
  </ThemeProvider>
));

export default App;
