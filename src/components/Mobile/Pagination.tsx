import { IconButton, Paper, TextField, Theme } from '@material-ui/core';
import {
  KeyboardArrowLeft as PreviousPageIcon,
  KeyboardArrowRight as NextPageIcon,
  SkipNext as LastPageIcon,
  SkipPrevious as FirstPageIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

import { getModules } from '~api';
import { apiStore, observer } from '~store';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    margin: theme.spacing(2),
    padding: theme.spacing(1, 2),
    alignItems: 'center',
  },
  pageSelector: {
    width: '40%',
    margin: theme.spacing(0, 1),
  },
  button: {
    width: '15%',
  },
}));

export default observer(() => {
  const classes = useStyles();

  const onChangePage = (page: number): void => {
    if (page === apiStore.page) return;

    apiStore.setPage(page);
    getModules();
  };

  const onFirstPage = (): void => onChangePage(0);

  const onLastPage = (): void => onChangePage(apiStore.totalPages - 1);

  const onPreviousPage = (): void => onChangePage(apiStore.page - 1);

  const onNextPage = (): void => onChangePage(apiStore.page + 1);

  const onChangePageEvent = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChangePage(parseInt(e.target.value, 10));
  };

  return (
    <Paper className={classes.root} square>
      <IconButton
        className={classes.button}
        onClick={onFirstPage}
        disabled={apiStore.page === 0}
      >
        <FirstPageIcon fontSize="large" />
      </IconButton>
      <IconButton
        className={classes.button}
        onClick={onPreviousPage}
        disabled={apiStore.page === 0}
      >
        <PreviousPageIcon fontSize="large" />
      </IconButton>
      <TextField
        className={classes.pageSelector}
        select
        label="Page"
        value={apiStore.page}
        onChange={onChangePageEvent}
        margin="normal"
        SelectProps={{
          native: true,
        }}
        InputLabelProps={{ shrink: true }}
      >
        {Array.from(Array(apiStore.totalPages).keys()).map(n => (
          <option key={n} value={n}>
            {n + 1}
          </option>
        ))}
      </TextField>
      <IconButton
        className={classes.button}
        onClick={onNextPage}
        disabled={apiStore.page === apiStore.totalPages}
      >
        <NextPageIcon fontSize="large" />
      </IconButton>
      <IconButton
        className={classes.button}
        onClick={onLastPage}
        disabled={apiStore.page === apiStore.totalPages}
      >
        <LastPageIcon fontSize="large" />
      </IconButton>
    </Paper>
  );
});
