import { Container, Paper, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Helmet } from 'react-helmet-async';

import { Mobile, NotMobile } from '~components';
import ModuleFilter from '~components/Desktop/ModuleFilter';
import TablePagination from '~components/Desktop/TablePagination';
import MobileFilterButton from '~components/Mobile/FilterButton';
import MobilePagination from '~components/Mobile/Pagination';
import Module from '~components/Module';
import CreateModuleFAB from '~components/Module/CreateModuleFAB';
import ModuleError from '~components/Module/ModuleError';
import ModuleSkeleton from '~components/Module/ModuleSkeleton';
import ScrollToTopFAB from '~components/Module/ScrollToTopFAB';
import { errorStore, modulesStore, observer } from '~store';

const useStyles = makeStyles((theme: Theme) => ({
  modules: {
    [theme.breakpoints.only('xs')]: {
      width: '100vw',
      margin: 0,
      padding: 0,
    },
    [theme.breakpoints.up('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    },
  },
  pagination: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  adContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'column',
    flexGrow: 1,
    height: 75,
    maxHeight: 75,
    [theme.breakpoints.only('xs')]: {
      margin: theme.spacing(2),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      margin: theme.spacing(3),
    },
    [theme.breakpoints.up('lg')]: {
      margin: theme.spacing(3, 4, 0, 4),
      padding: theme.spacing(1),
      width: '100%',
      maxWidth: 1000,
    },
  },
  ad: {
    display: 'inline-block',
    width: 728,
    height: 90,
    maxHeight: 90,
  },
}));

export default observer(() => {
  const classes = useStyles();
  const modules = modulesStore.modules.map(module => (
    <Module key={module.id} module={module} />
  ));
  const skeletons = Array(4)
    .fill(undefined)
    .map((_, i) => i)
    .map(n => <ModuleSkeleton key={n} />);

  let content: JSX.Element | JSX.Element[];

  if (errorStore.modulesNotLoaded) {
    content = <ModuleError errorType="no-modules-found" />;
  } else if (modules.length > 0) {
    content = modules;
  } else {
    content = skeletons;
  }

  const Ad = () => {
    return (
      <div className={classes.adContainer}>
        <ins
          className={`adsbygoogle ${classes.ad}`}
          data-ad-client="ca-pub-8493083757746019"
          data-ad-slot="8318592115"
        />
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>All Modules</title>
        <meta property="og:title" content="All Modules" />
        <meta property="og:description" content="A list of all ctjs modules" />
        <meta property="og:url" content="https://www.chattriggers.com/modules/" />
      </Helmet>
      <CreateModuleFAB />
      <ScrollToTopFAB />
      <Mobile>
        <Ad />
        <MobilePagination />
        <MobileFilterButton />
      </Mobile>
      <Container className={classes.modules}>
        <NotMobile>
          <Ad />
          <ModuleFilter />
        </NotMobile>
        {content}
        <Paper className={classes.pagination} square>
          <TablePagination />
        </Paper>
      </Container>
    </>
  );
});
