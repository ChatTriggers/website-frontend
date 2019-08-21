// https://material-ui.com/components/tables/
import React from 'react';
import { IconButton, TextField, FormGroup, Theme } from '@material-ui/core';
import {
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@material-ui/icons';
import { makeStyles, createStyles, withStyles, WithStyles } from '@material-ui/styles';
import { action, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import { ModulesStore } from '../../../store';

const useStylesActions = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
  text: {
    alignSelf: 'center',
    justifySelf: 'center',
    padding: '0 10px'
  }
}));

interface IInjectedProps {
  modulesStore: ModulesStore;
}

const TablePaginationActions = inject('modulesStore')(observer((props: {}) => {
  const classes = useStylesActions({});
  const { modulesStore: { viewConfig, modules } } = props as IInjectedProps;

  const getPageClickHandler = (pageGetter: (page: number) => number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    return action(() => {
      viewConfig.page = pageGetter(viewConfig.page);
    });
  };

  const handleFirstPageClick = getPageClickHandler(() => 0);
  const handlePreviousPageClick = getPageClickHandler(thePage => thePage - 1);
  const handleNextPageClick = getPageClickHandler(thePage => thePage + 1);
  const handleLastPageClick = getPageClickHandler(() => Math.max(0, Math.ceil(modules.length / viewConfig.modulesPerPage) - 1));

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageClick}
        disabled={viewConfig.page === 0}
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handlePreviousPageClick}
        disabled={viewConfig.page === 0}
      >
        <KeyboardArrowLeftIcon />
      </IconButton>

      {/* <Typography className={classes.text}>
        {viewConfig.page}
      </Typography> */}
      <IconButton
        onClick={handleNextPageClick}
        disabled={viewConfig.page >= Math.ceil(modules.length / viewConfig.modulesPerPage) - 1}
      >
        <KeyboardArrowRightIcon />
      </IconButton>
      <IconButton
        onClick={handleLastPageClick}
        disabled={viewConfig.page >= Math.ceil(modules.length / viewConfig.modulesPerPage) - 1}
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
}));

const stylesPagination = (theme: Theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'end',
    alignContent: 'center'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 150
  },
  menu: {
    width: 150
  }
});

@observer
@inject('modulesStore')
class TablePagination extends React.Component {
  get injected() {
    return this.props as unknown as IInjectedProps;
  }

  @computed
  get viewConfig() {
    return this.injected.modulesStore.viewConfig;
  }

  @computed
  get numModules() {
    return this.injected.modulesStore.modules.length === 0 ? 0
      : Math.ceil(this.injected.modulesStore.modules.length / this.viewConfig.modulesPerPage) - 1;
  }

  get classes() {
    return (this.props as WithStyles<ReturnType<typeof stylesPagination>>).classes;
  }

  @action
  private handleChangeModulesPerPage = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    this.viewConfig.modulesPerPage = parseInt(e.target.value as string);
  }

  @action
  private handleChangePage = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    this.viewConfig.page = parseInt(e.target.value as string);
  }

  public render() {
    console.log(this.injected.modulesStore.modules.length);

    setTimeout(() => {
      console.log(this.injected.modulesStore.modules.length);
    }, 5000);
    
    return (
      <div className={this.classes.root}>
        <FormGroup row>
          <TextField
            id="modules-per-page-select"
            className={this.classes.textField}
            select
            label="Modules per page"
            value={this.viewConfig.modulesPerPage}
            onChange={this.handleChangeModulesPerPage}
            SelectProps={{
              MenuProps: {
                className: this.classes.menu
              },
              native: true
            }}
          >
            {ModulesStore.MODULES_PER_PAGE_OPTIONS.map(rows => (
              <option key={rows} value={rows}>{rows}</option>
            ))}
          </TextField>
          <TextField
            id="page-select"
            select
            label="Page"
            value={this.viewConfig.page + 1}
            onChange={this.handleChangePage}
            SelectProps={{
              MenuProps: {
                className: this.classes.menu
              },
              native: true
            }}
          >
            {Array(this.numModules).fill(-1).map((_, i) => {
              console.log(`i: ${i}`);

              return (
                <option key={i} value={i}>{i}</option>
              );
            })}
          </TextField>
          <TablePaginationActions />
        </FormGroup>
      </div>
    );
  }
}

export default withStyles(stylesPagination, { withTheme: true })(TablePagination);
