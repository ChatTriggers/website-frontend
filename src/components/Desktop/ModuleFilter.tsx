import React from 'react';
import {
  Paper,
  FormGroup,
  FormControlLabel,
  TextField,
  Radio,
  RadioGroup,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {
  observer, modulesStore, authStore,
} from '~store';
import { getModules } from '~api';
import TablePagination from './TablePagination';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(2, 4, 6, 4),
    padding: theme.spacing(4, 4, 3, 4),
    width: '100%',
    maxWidth: `calc(1000px - ${theme.spacing(4) * 2}px)`,
  },
  content: {
    margin: 0,
    padding: 0,
    paddingTop: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  search: {
    width: '50%',
  },
  pagination: {
    paddingRight: 0,
  },
}));

type RadioOption = 'all' | 'user' | 'trusted' | 'flagged';

export default observer((): JSX.Element => {
  const classes = useStyles();
  const [searchTimeout, setSearchTimeout] = React.useState(undefined as NodeJS.Timeout | undefined);
  const [selectedRadio, setSelectedRadio] = React.useState('all' as RadioOption);

  const onSearchChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    if (searchTimeout) clearTimeout(searchTimeout);

    const { target } = e;
    modulesStore.setSearch(target.value as string);

    setSearchTimeout(setTimeout(() => {
      getModules();
    }, 1500));
  };

  const onFilterChange = (_: React.ChangeEvent<{}>, value: string): void => {
    const val = value as RadioOption;

    if (val !== selectedRadio) {
      if ((!authStore.isAuthed || authStore.isDefault) && val === 'flagged') return;

      setSelectedRadio(val);
      modulesStore.setSearchFilter(val);
      getModules();
    }
  };

  return (
    <Paper
      className={classes.root}
      elevation={4}
    >
      <FormGroup className={classes.searchContainer} row>
        <TextField
          className={classes.search}
          id="search-query"
          label="Search Modules"
          InputLabelProps={{ shrink: true }}
          value={modulesStore.search || ''}
          onChange={onSearchChange}
        />
        <TablePagination className={classes.pagination} />
      </FormGroup>
      <div className={classes.content}>
        <RadioGroup
          name="module-filter"
          value={selectedRadio}
          onChange={onFilterChange}
          row
        >
          <FormControlLabel value="all" label="All Modules" control={<Radio />} />
          <FormControlLabel value="trusted" label="Trusted Modules" control={<Radio />} />
          {authStore.isAuthed && <FormControlLabel value="user" label="My Modules" control={<Radio />} />}
          {authStore.isAuthed && !authStore.isDefault && <FormControlLabel value="flagged" label="Flagged Modules" control={<Radio />} />}
        </RadioGroup>
      </div>
    </Paper>
  );
});
