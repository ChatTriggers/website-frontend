import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { Provider } from 'mobx-react';
import { modulesStore, authStore } from './store';
import theme from './style/theme';
// import HomePage from './pages/Home';
import ModulesPage from './pages/Modules';

const App: React.FunctionComponent = () => {
  return (
    <Provider
      modulesStore={modulesStore}
      authStore={authStore}
    >
      <ThemeProvider theme={theme}>
        <Router>
          <Route path="/" exact component={ModulesPage} />
          {/* <Route path="/modules" component={ModulesPage} /> */}
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
