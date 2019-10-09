import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import Drawer from '~components/Drawer';
import theme from './styles/theme';
import routes from './routes';
import { globalStore, observer } from '~store';

const App: React.FunctionComponent = observer(() => (
  <ThemeProvider theme={theme}>
    <Router>
      <Drawer>
        <Switch>
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
      </Drawer>
    </Router>
  </ThemeProvider>
));

export default App;
