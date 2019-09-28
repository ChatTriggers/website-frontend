import React from 'react';
import {
  Paper,
  IconButton,
  TextField,
  Theme,
} from '@material-ui/core';
import {
  SkipPrevious as FirstPageIcon,
  SkipNext as LastPageIcon,
  KeyboardArrowLeft as PreviousPageIcon,
  KeyboardArrowRight as NextPageIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { getModules } from '~api';
import { modulesStore, observer } from '~store';

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
    if (page === modulesStore.page) return;

    modulesStore.setPage(page);
    getModules();
  };

  const onFirstPage = (): void => onChangePage(0);

  const onLastPage = (): void => onChangePage(modulesStore.totalPages);

  const onPreviousPage = (): void => onChangePage(modulesStore.page - 1);

  const onNextPage = (): void => onChangePage(modulesStore.page + 1);

  const onChangePageEvent = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChangePage(parseInt(e.target.value, 10));
  };

  return (
    <Paper
      className={classes.root}
      elevation={4}
    >
      <IconButton
        className={classes.button}
        onClick={onFirstPage}
        disabled={modulesStore.page === 0}
      >
        <FirstPageIcon fontSize="large" />
      </IconButton>
      <IconButton
        className={classes.button}
        onClick={onPreviousPage}
        disabled={modulesStore.page === 0}
      >
        <PreviousPageIcon fontSize="large" />
      </IconButton>
      <TextField
        className={classes.pageSelector}
        select
        label="Page"
        value={modulesStore.page}
        onChange={onChangePageEvent}
        SelectProps={{
          native: true,
        }}
        margin="normal"
      >
        {Array.from(Array(modulesStore.totalPages).keys()).map(n => (
          <option key={n} value={n}>{n + 1}</option>
        ))}
      </TextField>
      <IconButton
        className={classes.button}
        onClick={onNextPage}
        disabled={modulesStore.page === modulesStore.totalPages}
      >
        <NextPageIcon fontSize="large" />
      </IconButton>
      <IconButton
        className={classes.button}
        onClick={onLastPage}
        disabled={modulesStore.page === modulesStore.totalPages}
      >
        <LastPageIcon fontSize="large" />
      </IconButton>
    </Paper>
  );
});
