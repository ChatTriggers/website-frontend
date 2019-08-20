// https://material-ui.com/components/tables/
import React from 'react';
import { IconButton, TextField, FormGroup, Theme } from '@material-ui/core';
import { 
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@material-ui/icons';
import { makeStyles, createStyles, useTheme } from '@material-ui/styles';
import { inject, observer } from 'mobx-react';
import { ModulesStore } from '../../../store';

const useStylesActions = makeStyles((theme: Theme) => createStyles({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
}));

interface IInjectedProps {
  modulesStore: ModulesStore;
}

const TablePaginationActions = inject('modulesStore')(observer((props: {}) => {
  const classes = useStylesActions({});
  const theme = useTheme();
  const { modulesStore: { viewConfig, modules } } = props as IInjectedProps;

  const getPageClickHandler = (pageGetter: (page: number) => number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    return () => {
      viewConfig.page = pageGetter(viewConfig.page);
    };
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

const useStylesPagination = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    justifyContent: 'end',
    alignContent: 'center'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  menu: {
    width: 200
  }
}));

export default inject('modulesStore')(observer((props: {}) => {
  const classes = useStylesPagination({});
  const { modulesStore: { viewConfig } } = props as IInjectedProps;

  const handleChangeModulesPerPage = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    viewConfig.modulesPerPage = parseInt(e.target.value as string);
  };

  return (
    <div className={classes.root}>
      <FormGroup row>
        <TextField 
          id="modules-per-page-select"
          className={classes.textField}
          select
          label="Modules per page"
          value={viewConfig.modulesPerPage}
          onChange={handleChangeModulesPerPage}
          SelectProps={{
            MenuProps: {
              className: classes.menu
            },
            native: true
          }}
        >
          {ModulesStore.MODULES_PER_PAGE_OPTIONS.map(rows => (
            <option key={rows} value={rows}>{rows}</option>
          ))}
        </TextField>
        <TablePaginationActions />
      </FormGroup>
    </div>  
  );
}));
