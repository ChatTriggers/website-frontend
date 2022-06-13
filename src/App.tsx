import { ThemeProvider } from '@material-ui/styles';
import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import { getCurrentAccount, getModules, loadCtVersions, loadTags } from '~api';
import Drawer from '~components/Drawer';
import ErrorDialog from '~components/ErrorDialog';
import { action, globalStore, modulesStore } from '~store';

import routes from './routes';
import theme from './styles/theme';

export default () => {
  useEffect(
    action(() => {
      if (modulesStore.modules.length === 0) {
        getModules();
        getCurrentAccount();
        loadTags();
        loadCtVersions();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    }),
    [],
  );

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <HelmetProvider>
          <Drawer>
            <ErrorDialog />
            <Switch>
              {routes.map(({ route, component, name }) => (
                <Route
                  key={route}
                  path={route}
                  exact
                  render={({ match }) => {
                    // setTimeout makes the state mutation have lower precedence to avoid react warning
                    // https://github.com/facebook/react/issues/18178#issuecomment-595846312
                    setTimeout(() => {
                      globalStore.setDrawerTitle(name || match.params.module || '');
                    }, 0);

                    return component;
                  }}
                />
              ))}
              <Redirect to="/modules" />
            </Switch>
          </Drawer>
        </HelmetProvider>
      </ThemeProvider>
    </Router>
  );
};
