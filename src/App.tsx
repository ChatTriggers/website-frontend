import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Theme } from '@material-ui/core';
import { ThemeProvider, makeStyles } from '@material-ui/styles';
import { Location } from 'history';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import theme from './styles/theme';
import ModulesPage from './pages/ModulesPage';
import PasswordResetPage from './pages/PasswordReset';
import MobileFilterPage from './pages/MobileFilterPage';

const useStyles = makeStyles((t: Theme) => ({
  root: {
    position: 'relative',
    width: '100vw',
    height: '100vh'
  }
}));

const PageContainer = (props: { children: React.ReactChild }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {props.children}
    </div>
  );
};

const App: React.FunctionComponent = () => {
  // const render = ({ location }: { location: Location }) => (
  //   <PageContainer>
  //     <TransitionGroup>
  //       <CSSTransition
  //         timeout={300}
  //         classNames="page"
  //         key={location.key}
  //       >
  //         <Switch location={location}>
  //           {/* <Route path="/" exact component={HomePage} */}
  //           <Route path="/passwordreset" component={PasswordResetPage} />
  //           <Route path="/modules" exact component={ModulesPage} />
  //           <Route path="/modules/filter" component={MobileFilterPage} />
  //           <Route path="/modules/:module(\d+)" />
  //         </Switch>
  //       </CSSTransition>
  //     </TransitionGroup>
  //   </PageContainer>
  // );

  return (
    <ThemeProvider theme={theme}>
      <Router>
        {/* <Route render={render} /> */}
        <Route path="/passwordreset" component={PasswordResetPage} />
        <Route path="/modules" exact component={ModulesPage} />
        <Route path="/modules/filter" component={MobileFilterPage} />
        <Route path="/modules/:module(\d+)" />
      </Router>
    </ThemeProvider>
  );
};

export default App;
