import React from 'react';
import { Container, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { modulesStore, observer } from '~store';
import { Mobile, Desktop } from '~components';
import Module from '~components/Module';
import FloatingActionButton from '~components/Module/FloatingActionButton';
import ModuleSkeleton from '~components/Module/ModuleSkeleton';
import MobilePagination from '~components/Mobile/Pagination';
import MobileFilterButton from '~components/Mobile/FilterButton';
import ModuleFilter from '~components/Desktop/ModuleFilter';

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

  return (
    <>
      <FloatingActionButton />
      <Mobile>
        <MobilePagination />
        <MobileFilterButton />
      </Mobile>
      <Container className={classes.modules}>
        <Desktop>
          <ModuleFilter />
        </Desktop>
        {modules.length > 0 ? modules : skeletons}
      </Container>
    </>
  );
});
