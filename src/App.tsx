import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import Drawer from '~components/Drawer';
import theme from './styles/theme';
import routes from './routes';
import { globalStore, modulesStore, observer } from '~store';
import {
  getModules, getCurrentAccount, loadTags, loadCtVersions,
} from '~api';

@observer
export default class App extends React.Component {
  public componentDidMount = async (): Promise<void> => {
    if (modulesStore.modules.length === 0) {
      getModules();
      getCurrentAccount();
      loadTags();
      loadCtVersions();
    }
  }

  public render(): JSX.Element {
    return (
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
    );
  }
}
