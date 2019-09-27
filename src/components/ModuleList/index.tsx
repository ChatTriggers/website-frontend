import React from 'react';
import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { modulesStore, observer } from '~store';
import Module from '../Module';
import FloatingActionButton from './FloatingActionButton';
import MobilePagination from '~components/Mobile/Pagination';
import MobileFilterButton from '~components/Mobile/FilterButton';
import { Mobile } from '~components';
// import ModuleSkeleton from './ModuleSkeleton';
// import ModuleError from './ModuleError';

const useStyles = makeStyles((theme: Theme) => ({
  fab: {
    position: 'fixed',
    right: theme.spacing(4),
    bottom: theme.spacing(4)
  }
}));

export default observer(() => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles({});

  const onFabClick = () => {
    setOpen(isOpen => !isOpen);
  };

  const modules = modulesStore.modules.map(module => <Module key={module.id} {...module} />);

  return (
    <>
      <FloatingActionButton />
      <Mobile>
        <MobilePagination />
        <MobileFilterButton />
      </Mobile>
      {modules}
    </>
  );
});
