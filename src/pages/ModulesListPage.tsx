import React from 'react';
import { Container, Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { getModules, getCurrentAccount, loadTags } from '~api';
import { modulesStore, observer } from '~store';
import {
  StyledComponent,
  Mobile,
  Styles,
  Desktop,
} from '~components';
import Module from '~components/Module';
import FloatingActionButton from '~components/Module/FloatingActionButton';
import ModuleSkeleton from '~components/Module/ModuleSkeleton';
import MobilePagination from '~components/Mobile/Pagination';
import MobileFilterButton from '~components/Mobile/FilterButton';
import ModuleFilter from '~components/Desktop/ModuleFilter';

const styles: Styles = (theme: Theme) => ({
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
});

@observer
class ModulesListPage extends StyledComponent<typeof styles> {
  public componentDidMount = async (): Promise<void> => {
    if (modulesStore.modules.length === 0) {
      getModules();
      getCurrentAccount();
      loadTags();
    }
  }

  public render(): JSX.Element {
    const modules = modulesStore.modules.map(module => <Module key={module.id} module={module} />);
    const skeletons = Array(4).fill(undefined).map((_, i) => i).map(n => <ModuleSkeleton key={n} />);

    return (
      <>
        <FloatingActionButton />
        <Mobile>
          <MobilePagination />
          <MobileFilterButton />
        </Mobile>
        <Container className={this.classes.modules}>
          <Desktop>
            <ModuleFilter />
          </Desktop>
          {modules.length > 0 ? modules : skeletons}
        </Container>
      </>
    );
  }
}

export default withStyles(styles)(ModulesListPage);
