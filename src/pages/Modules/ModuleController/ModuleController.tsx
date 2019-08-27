import React from 'react';
import {
  Paper,
  Container,
  Theme,
  FormGroup,
  FormControlLabel,
  TextField,
  Radio,
  RadioGroup
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { view, store } from 'react-easy-state';
import { getModules } from '../../../api';
import { Auth, Modules } from '../../../store';
import TablePagination from './TablePagination';
import ModuleError from '../ModuleList/ModuleError';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    margin: theme.spacing(5),
    padding: theme.spacing(2)
  },
  content: {
    margin: 0,
    padding: 0,
    paddingTop: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center'
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center'
  },
  search: {
    width: '50%'
  },
  pagination: {
    paddingRight: 0
  }
}));

interface IStore {
  timeout: NodeJS.Timeout | undefined;
  selectedRadio: 'all' | 'user' | 'trusted' | 'flagged';
}

export default view(() => {
  const data = store<IStore>({
    timeout: undefined,
    selectedRadio: 'all'
  });

  const classes = useStyles({});

  const onSearchChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    if (data.timeout) {
      clearTimeout(data.timeout);
    }

    const target = e.target;
    Modules.store.viewConfig.search = target.value as string;

    data.timeout = setTimeout(() => {
      getModules();
    }, 1500);
  };

  const onFilterChange = (_: React.ChangeEvent<{}>, value: string) => {
    console.log(value);
    const val = value as ('all' | 'user' | 'trusted' | 'flagged');
    
    if (val !== data.selectedRadio) {
      data.selectedRadio = val;

      Modules.store.viewConfig.onlyFlagged = Auth.isAuthed && !Auth.isDefault && val === 'flagged';
      Modules.store.viewConfig.onlyTrusted = val === 'trusted';
      Modules.store.viewConfig.onlyUserModules = val === 'user';

      getModules();
    }
  };

  return (
    <Paper
      className={classes.root}
      square
      elevation={4}
    >
      <Container>
        <FormGroup className={classes.searchContainer} row>
          <TextField
            className={classes.search}
            id="search-query"
            label="Search Modules"
            InputLabelProps={{ shrink: true }}
            value={Modules.store.viewConfig.search || ''}
            onChange={onSearchChange}
          />
          <TablePagination className={classes.pagination} />
        </FormGroup>
        <Container className={classes.content}>
          <RadioGroup
            name="module-filter"
            value={data.selectedRadio}
            onChange={onFilterChange}
            row
          >
            <FormControlLabel value="all" label="All Modules" control={<Radio />} />
            <FormControlLabel value="trusted" label="Trusted Modules" control={<Radio />} />
            {Auth.isAuthed && (
              <FormControlLabel value="user" label="My Modules" control={<Radio />} />
            )}
            {Auth.isAuthed && !Auth.isDefault && (
              <FormControlLabel value="flagged" label="Flagged Modules" control={<Radio />} />
            )}
          </RadioGroup>
        </Container>
      </Container>
    </Paper>
  );
});
