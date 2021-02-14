import React from 'react';
import { Paper, Container, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import MetaTags from 'react-meta-tags';
import { modulesStore, errorStore, observer } from '~store';
import { Mobile, NotMobile } from '~components';
import Module from '~components/Module';
import FloatingActionButton from '~components/Module/FloatingActionButton';
import ModuleSkeleton from '~components/Module/ModuleSkeleton';
import MobilePagination from '~components/Mobile/Pagination';
import MobileFilterButton from '~components/Mobile/FilterButton';
import ModuleFilter from '~components/Desktop/ModuleFilter';
import TablePagination from '~components/Desktop/TablePagination';
import ModuleError from '~components/Module/ModuleError';

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
  const modules = modulesStore.modules.map(module => <Module key={module.id} module={module} />);
  const skeletons = Array(4).fill(undefined).map((_, i) => i).map(n => <ModuleSkeleton key={n} />);

  let content: JSX.Element | JSX.Element[];

  if (errorStore.modulesNotLoaded) {
    content = <ModuleError errorType="no-modules-found" />;
  } else if (modules.length > 0) {
    content = modules;
  } else {
    content = skeletons;
  }

  const Ad = (): JSX.Element => (
    <div className={classes.adContainer}>
      <ins
        className={`adsbygoogle ${classes.ad}`}
        data-ad-client="ca-pub-8493083757746019"
        data-ad-slot="8318592115"
      />
    </div>
  );

  return (
    <>
      <MetaTags>
        <title>All Modules</title>
        <meta property="og:title" content="All Modules" />
        <meta property="og:description" content="A list of all ctjs modules" />
        <meta property="og:url" content="https://www.chattriggers.com/modules/" />
      </MetaTags>
      <FloatingActionButton />
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
