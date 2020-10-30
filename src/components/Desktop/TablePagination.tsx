import React from 'react';
import {
  IconButton, TextField, FormGroup, Theme,
} from '@material-ui/core';
import {
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from '@material-ui/icons';
import { makeStyles, createStyles, withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { getModules } from '~api';
import { modulesStore, observer, apiStore } from '~store';
import { StyledComponent, Styles } from '~components';

const useStylesActions = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    color: theme.palette.text.secondary,
  },
  text: {
    alignSelf: 'center',
    justifySelf: 'center',
  },
}));

interface ITablePaginationActionsProps {
  className?: string;
}

const TablePaginationActions = observer(({ className }: ITablePaginationActionsProps) => {
  const classes = useStylesActions({});

  const getPageClickHandler = (pageGetter: (page: number) => number) => () => {
    const newPage = pageGetter(apiStore.page);
    if (newPage === apiStore.page) return;

    apiStore.setPage(newPage);

    getModules();
  };

  const handleFirstPageClick = getPageClickHandler(() => 0);
  const handlePreviousPageClick = getPageClickHandler(thePage => thePage - 1);
  const handleNextPageClick = getPageClickHandler(thePage => thePage + 1);
  const handleLastPageClick = getPageClickHandler(() => apiStore.totalPages - 1);

  return (
    <div className={clsx(classes.root, className)}>
      <IconButton
        onClick={handleFirstPageClick}
        disabled={apiStore.page === 0}
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handlePreviousPageClick}
        disabled={apiStore.page === 0}
      >
        <KeyboardArrowLeftIcon />
      </IconButton>
      <IconButton
        onClick={handleNextPageClick}
        disabled={apiStore.page >= apiStore.totalPages - 1}
      >
        <KeyboardArrowRightIcon />
      </IconButton>
      <IconButton
        onClick={handleLastPageClick}
        disabled={apiStore.page >= apiStore.totalPages - 1}
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
});

const stylesPagination: Styles = () => ({
  root: {
    display: 'flex',
    justifyContent: 'end',
    alignContent: 'center',
  },
  form: {
    display: 'flex',
    width: '100%',
  },
  selectors: {
    flexGrow: 3,
  },
});

interface ITablePaginationProps {
  className?: string;
}

@observer
class TablePagination extends StyledComponent<typeof stylesPagination, ITablePaginationProps> {
  static get numPages(): number {
    if (modulesStore.modules.length === 0) return 0;

    return Math.ceil(modulesStore.modules.length / apiStore.modulesPerPage);
  }

  private readonly handleChangePage = (e: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    const newPage = parseInt(e.target.value as string, 10);
    if (newPage === apiStore.page) return;

    apiStore.setPage(newPage);
    getModules();
  }

  public render(): JSX.Element {
    return (
      <div className={`${this.classes.root} ${this.props.className || ''}`}>
        <FormGroup row className={this.classes.form}>
          <TextField
            id="page-select"
            select
            label="Page"
            value={apiStore.page}
            onChange={this.handleChangePage}
            SelectProps={{
              MenuProps: {
                className: this.classes.menu,
              },
              native: true,
            }}
            InputLabelProps={{ shrink: true }}
          >
            {Array(apiStore.totalPages).fill(-1).map((_, i) => i).map(i => (
              <option key={i} value={i}>{i + 1}</option>
            ))}
          </TextField>
          <TablePaginationActions className={this.classes.selectors} />
        </FormGroup>
      </div>
    );
  }
}

export default withStyles(stylesPagination, { withTheme: true })(TablePagination);
