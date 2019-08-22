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
import { view } from 'react-easy-state';
import { getModules } from '../../../api';
import { Modules, MODULES_PER_PAGE_OPTIONS } from '../../../store';

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

const TablePaginationActions = view(() => {
  const classes = useStylesActions({});
  
  const getPageClickHandler = (pageGetter: (page: number) => number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const newPage = pageGetter(Modules.store.viewConfig.page);
    if (newPage === Modules.store.viewConfig.page) return;

    Modules.store.viewConfig.page = newPage;

    getModules();
  };

  const handleFirstPageClick = getPageClickHandler(() => 0);
  const handlePreviousPageClick = getPageClickHandler(thePage => thePage - 1);
  const handleNextPageClick = getPageClickHandler(thePage => thePage + 1);
  const handleLastPageClick = getPageClickHandler(() => Modules.totalPages - 1);

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageClick}
        disabled={Modules.store.viewConfig.page === 0}
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handlePreviousPageClick}
        disabled={Modules.store.viewConfig.page === 0}
      >
        <KeyboardArrowLeftIcon />
      </IconButton>

      {/* <Typography className={classes.text}>
        {viewConfig.page}
      </Typography> */}
      <IconButton
        onClick={handleNextPageClick}
        disabled={Modules.store.viewConfig.page >= Modules.totalPages - 1}
      >
        <KeyboardArrowRightIcon />
      </IconButton>
      <IconButton
        onClick={handleLastPageClick}
        disabled={Modules.store.viewConfig.page >= Modules.totalPages - 1}
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
});

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

interface ITablePaginationProps {
  className?: string;
}

@view
class TablePagination extends React.Component<ITablePaginationProps> {
  get numPages() {
    if (Modules.store.modules.length === 0) return 0;

    return Math.ceil(Modules.store.modules.length / Modules.store.viewConfig.modulesPerPage);
  }

  get classes() {
    return (this.props as WithStyles<ReturnType<typeof stylesPagination>>).classes;
  }

  private readonly handleChangeModulesPerPage = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const newModulesPerPage = parseInt(e.target.value as string);
    if (newModulesPerPage === Modules.store.viewConfig.modulesPerPage) return;

    Modules.store.viewConfig.modulesPerPage = newModulesPerPage;
    getModules();
  }

  private readonly handleChangePage = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const newPage = parseInt(e.target.value as string);
    if (newPage === Modules.store.viewConfig.page) return;

    Modules.store.viewConfig.page = newPage;
    getModules();
  }

  public render() {
    return (
      <div className={`${this.classes.root} ${this.props.className || ''}`}>
        <FormGroup row>
          <TextField
            id="modules-per-page-select"
            className={this.classes.textField}
            select
            label="Modules per page"
            value={Modules.store.viewConfig.modulesPerPage}
            onChange={this.handleChangeModulesPerPage}
            SelectProps={{
              MenuProps: {
                className: this.classes.menu
              },
              native: true
            }}
          >
            {MODULES_PER_PAGE_OPTIONS.map(rows => (
              <option key={rows} value={rows}>{rows}</option>
            ))}
          </TextField>
          <TextField
            id="page-select"
            select
            label="Page"
            value={Modules.store.viewConfig.page}
            onChange={this.handleChangePage}
            SelectProps={{
              MenuProps: {
                className: this.classes.menu
              },
              native: true
            }}
          >
            {Array(Modules.totalPages).fill(-1).map((_, i) => (
              <option key={i} value={i}>{i + 1}</option>
            ))}
          </TextField>
          <TablePaginationActions />
        </FormGroup>
      </div>
    );
  }
}

export default withStyles(stylesPagination, { withTheme: true })(TablePagination);
