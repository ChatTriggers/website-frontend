import React from 'react';
import {
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  IconButton,
  Theme,
} from '@material-ui/core';
import { KeyboardArrowLeft as KeyboardArrowLeftIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import { History } from 'history';
import clsx from 'clsx';
import Drawer from '~components/Drawer';
import {
  modulesStore,
  authStore,
  observer,
  action,
  MODULES_PER_PAGE_OPTIONS,
} from '~store';
import { ModuleSearchFilter } from '~types';
import { getModules } from '~api';

interface IMobileFilterPageProps {
  history: History;
}

interface IStyleProps {
  searchValue: boolean;
}

const useStyles = makeStyles<Theme, IStyleProps>((theme: Theme) => ({
  root: {
    width: '100vw',
    height: `calc(100vh - 56px - ${theme.spacing(2)}px)`,
  },
  paperContainer: {
    margin: 'auto',
    width: '100%',
    maxWidth: 320,
  },
  paper: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  search: {
    width: '100%',
    marginBottom: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter,
    }),
    marginTop: props => (props.searchValue ? 0 : -25),
  },
  radio: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  hidden: {
    display: 'none',
  },
  modulesPerPage: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  select: {
    marginLeft: theme.spacing(2),
  },
}));

export default withRouter(observer(({ history }: IMobileFilterPageProps) => {
  const [search, setSearch] = React.useState('');
  const [searchFocused, setSearchFocused] = React.useState(false);

  const classes = useStyles({ searchValue: searchFocused || search !== '' });

  const onClick = (): void => {
    history.push('/modules');
  };

  const onSearchChange = action((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    modulesStore.setSearch(e.target.value);
  });

  const onSearchFocus = (): void => {
    setSearchFocused(true);
  };

  const onSearchBlur = (): void => {
    setSearchFocused(false);
  };

  const onFilterChange = action((e: React.ChangeEvent<{}>) => {
    const filter = (e.target as HTMLInputElement).value as ModuleSearchFilter;

    if (filter !== modulesStore.searchFilter) {
      modulesStore.setSearchFilter(filter);
      getModules();
    }
  });

  const onChangeModulesPerPage = (e: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    const modulesPerPage = e.target.value as number;

    if (modulesPerPage !== modulesStore.modulesPerPage) {
      if (modulesPerPage < modulesStore.modulesPerPage) {
        modulesStore.setModules(modulesStore.modules.slice(0, modulesPerPage));
      } else {
        getModules();
      }

      modulesStore.setModulesPerPage(modulesPerPage);
    }
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
        <div className={classes.paperContainer}>
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
              multiline
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
                value={modulesStore.searchFilter}
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
          <Paper
            className={classes.paper}
            elevation={4}
          >
            <div className={classes.modulesPerPage}>
              <Typography>
                Modules per page:
              </Typography>
              <Select
                className={classes.select}
                value={modulesStore.modulesPerPage}
                onChange={onChangeModulesPerPage}
              >
                {MODULES_PER_PAGE_OPTIONS.map(n => (
                  <MenuItem key={n} value={n}>{n}</MenuItem>
                ))}
              </Select>
            </div>
          </Paper>
        </div>
      </div>
    </Drawer>
  );
}));
