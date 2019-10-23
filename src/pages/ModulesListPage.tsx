import React from 'react';
import { Container, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { modulesStore, errorStore, observer } from '~store';
import { Mobile, NotMobile } from '~components';
import Module from '~components/Module';
import FloatingActionButton from '~components/Module/FloatingActionButton';
import ModuleSkeleton from '~components/Module/ModuleSkeleton';
import MobilePagination from '~components/Mobile/Pagination';
import MobileFilterButton from '~components/Mobile/FilterButton';
import ModuleFilter from '~components/Desktop/ModuleFilter';
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

  return (
    <>
      <FloatingActionButton />
      <Mobile>
        <MobilePagination />
        <MobileFilterButton />
      </Mobile>
      <Container className={classes.modules}>
        <NotMobile>
          <ModuleFilter />
        </NotMobile>
        {content}
      </Container>
    </>
  );
});
