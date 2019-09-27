import React from 'react';
import {
  Paper,
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  IconButton,
  Theme
} from '@material-ui/core';
import { KeyboardArrowLeft as KeyboardArrowLeftIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import { History } from 'history';
import Drawer from '~components/Drawer';
import { modulesStore, authStore } from '~store';
import clsx from 'clsx';

interface IMobileFilterPageProps {
  history: History;
}

interface IStyleProps {
  searchValue: boolean;
}

const useStyles = makeStyles<Theme, IStyleProps>((theme: Theme) => ({
  root: {
    width: '100vw',
    height: '100vh'
  },
  paper: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center'
  },
  search: {
    width: '100%',
    marginBottom: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter,
    }),
    marginTop: props => props.searchValue ? 0 : -25
  },
  radio: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center'
  },
  hidden: {
    display: 'none'
  }
}));

type Filter = 'all' | 'trusted' | 'user' | 'flagged';

export default withRouter(({ history }: IMobileFilterPageProps) => {
  const [search, setSearch] = React.useState('');
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [filter, setFilter] = React.useState('all' as Filter);

  const classes = useStyles({ searchValue: searchFocused || search !== '' });

  const onClick = () => {
    history.push('/modules');
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    modulesStore.setSearch(e.target.value);
  };

  const onSearchFocus = () => {
    setSearchFocused(true);
  };

  const onSearchBlur = () => {
    setSearchFocused(false);
  };

  const onFilterChange = (e: React.ChangeEvent<{}>) => {
    setFilter((e.target as HTMLInputElement).value as Filter);
  };

  const button = (
    <IconButton
      edge="start"
      onClick={onClick}
    >
      <KeyboardArrowLeftIcon />
    </IconButton>
  );

  return (
    <Drawer title="Module Filters" button={button}>
      <div className={classes.root}>
        <Paper
          elevation={4}
          className={classes.paper}
        >
          <TextField
            className={classes.search}
            label="Search"
            margin="normal"
            placeholder="Search module names"
            value={search}
            onChange={onSearchChange}
            onFocus={onSearchFocus}
            onBlur={onSearchBlur}
          />
        </Paper>
        <Paper
          elevation={4}
          className={classes.paper}
        >
          <FormControl component="fieldset">
            <FormLabel component="legend">Module Search Filters</FormLabel>
            <RadioGroup
              className={classes.radio}
              value={filter}
              onChange={onFilterChange}
            >
              <FormControlLabel
                control={<Radio />}
                label="All Modules"
                value="all"
              />
              <FormControlLabel
                control={<Radio />}
                label="Trusted Modules"
                value="trusted"
              />
              <FormControlLabel
                control={<Radio />}
                label="My Modules"
                value="user"
                disabled
              />
              <FormControlLabel
                className={clsx(!authStore.isAdmin && classes.hidden)}
                control={<Radio />}
                label="Flagged Modules"
                value="flagged"
                hidden
              />
            </RadioGroup>
          </FormControl>
        </Paper>
      </div>
    </Drawer>
  );
});
