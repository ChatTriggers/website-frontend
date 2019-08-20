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

const useStylesActions = makeStyles((theme: Theme) => createStyles({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
}));

interface ITablePaginationActionProps {
  totalModules: number;
  page: number;
  modulesPerPage: number;
  onChangePage(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, newPage: number): void;
}

interface ITablePaginationProps {
  totalModules: number;
  offset: number;
  modulesPerPageOptions: number[];
  onChangePage(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, newPage: number): void;
  onChangeModulesPerPageOption(rowsPerPage: number): void;
}

const TablePaginationActions = (props: ITablePaginationActionProps) => {
  const classes = useStylesActions({});
  const theme = useTheme();
  const { totalModules, page, modulesPerPage, onChangePage } = props;

  const getPageClickHandler = (pageGetter: (page: number) => number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onChangePage(e, pageGetter(page));
  };

  const handleFirstPageClick = getPageClickHandler(() => 0);
  const handlePreviousPageClick = getPageClickHandler(thePage => thePage - 1);
  const handleNextPageClick = getPageClickHandler(thePage => thePage + 1);
  const handleLastPageClick = getPageClickHandler(() => Math.max(0, Math.ceil(totalModules / modulesPerPage) - 1));

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageClick}
        disabled={page === 0}
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handlePreviousPageClick}
        disabled={page === 0}
      >
        <KeyboardArrowLeftIcon />
      </IconButton>
      <IconButton
        onClick={handleNextPageClick}
        disabled={page >= Math.ceil(totalModules / modulesPerPage) - 1}
      >
        <KeyboardArrowRightIcon />
      </IconButton>
      <IconButton
        onClick={handleLastPageClick}
        disabled={page >= Math.ceil(totalModules / modulesPerPage) - 1}
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
};

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

export default (props: ITablePaginationProps) => {
  const { offset, modulesPerPageOptions, totalModules, onChangePage, onChangeModulesPerPageOption } = props;
  const classes = useStylesPagination({});

  const [modulesPerPage, setModulesPerPage] = React.useState(modulesPerPageOptions[0]);

  const handleChangeModulesPerPage = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const rows = parseInt(e.target.value as string);
    setModulesPerPage(rows);
    onChangeModulesPerPageOption(rows);
  };

  return (
    <div className={classes.root}>
      <FormGroup row>
        <TextField 
          id="modules-per-page-select"
          className={classes.textField}
          select
          label="Modules per page"
          value={modulesPerPage}
          onChange={handleChangeModulesPerPage}
          SelectProps={{
            MenuProps: {
              className: classes.menu
            },
            native: true
          }}
        >
          {modulesPerPageOptions.map(rows => (
            <option key={rows} value={rows}>{rows}</option>
          ))}
        </TextField>
        {/* <Select
          value={modulesPerPage}
          onChange={handleChangeRowsPerPageOption}
          inputProps={{
            name: 'modules-per-page',
            id: 'modules-per-page-select'
          }}
          native
        >
          {modulesPerPageOptions.map(rows => (
            <option key={rows} value={rows}>{rows}</option>
          ))}
        </Select> */}
        <TablePaginationActions 
          totalModules={totalModules}
          onChangePage={onChangePage}
          modulesPerPage={10}
          page={0}
        />
      </FormGroup>
    </div>  
  );
};
