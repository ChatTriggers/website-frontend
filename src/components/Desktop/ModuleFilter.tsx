import {
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { action, toJS } from 'mobx';
import React from 'react';

import { getModules } from '~api';
import {
  apiStore,
  authStore,
  errorStore,
  MODULES_PER_PAGE_OPTIONS,
  modulesStore,
  observer,
  runInAction,
} from '~store';
import { ModuleSorting } from '~types';

import TablePagination from './TablePagination';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.down('md')]: {
      maxWidth: '100vw',
      margin: theme.spacing(3, 3, 3, 3),
      padding: theme.spacing(2),
    },
    [theme.breakpoints.up('lg')]: {
      width: '100%',
      maxWidth: `calc(1000px - ${theme.spacing(4) * 2}px)`,
      margin: theme.spacing(4, 4, 3, 4),
      padding: theme.spacing(2, 4, 2, 4),
    },
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
  pagination: {
    paddingRight: 0,
  },
  menu: {
    flexGrow: 1,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-around',
  },
}));

type RadioOption = 'all' | 'user' | 'trusted' | 'flagged';

export default observer(() => {
  const classes = useStyles();
  const [searchTimeout, setSearchTimeout] = React.useState<NodeJS.Timeout[]>();
  const [selectedRadio, setSelectedRadio] = React.useState<RadioOption>('all');

  const onSearchChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>,
  ): void => {
    if (searchTimeout) searchTimeout.forEach(clearTimeout);

    if (errorStore.modulesNotLoaded) {
      runInAction(() => {
        errorStore.modulesNotLoaded = false;
      });
    }

    const { target } = e;
    apiStore.setSearch(target.value as string);

    setSearchTimeout([
      setTimeout(getModules, 1500),
      setTimeout(() => {
        if (modulesStore.modules.length === 0) {
          runInAction(() => {
            errorStore.modulesNotLoaded = true;
          });
        }
      }, 6500),
    ]);
  };

  const onSearchTagsChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>,
  ): void => {
    if (searchTimeout) searchTimeout.forEach(clearTimeout);

    if (errorStore.modulesNotLoaded) {
      runInAction(() => {
        errorStore.modulesNotLoaded = false;
      });
    }

    const { target } = e;
    apiStore.setTags(target.value as string[]);

    setSearchTimeout([
      setTimeout(getModules, 1500),
      setTimeout(() => {
        if (modulesStore.modules.length === 0) {
          runInAction(() => {
            errorStore.modulesNotLoaded = true;
          });
        }
      }, 6500),
    ]);
  };

  const onFilterChange = action((_: React.ChangeEvent, value: string) => {
    const val = value as RadioOption;

    if (val !== selectedRadio) {
      if ((!authStore.isAuthed || authStore.isDefault) && val === 'flagged') return;

      setSelectedRadio(val);
      apiStore.setFilter(val);
      getModules();
    }
  });

  const onChangeModuleSorting = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>,
  ): void => {
    const moduleSorting = e.target.value as ModuleSorting;

    if (moduleSorting !== apiStore.sorting) {
      apiStore.setSorting(moduleSorting);
      getModules();
    }
  };

  const handleChangeModulesPerPage = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>,
  ): void => {
    const newModulesPerPage = parseInt(e.target.value as string, 10);
    if (newModulesPerPage === apiStore.modulesPerPage) return;

    apiStore.setModulesPerPage(newModulesPerPage);
    getModules();
  };

  return (
    <Paper className={classes.root} square>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            id="search-query"
            label="Search Modules"
            value={apiStore.search || ''}
            onChange={onSearchChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            id="modules-per-page-select"
            select
            label="Modules per page"
            value={apiStore.modulesPerPage}
            onChange={handleChangeModulesPerPage}
            fullWidth
            InputLabelProps={{ shrink: true }}
            SelectProps={{
              margin: 'dense',
              MenuProps: {
                style: {
                  maxHeight: 400,
                },
              },
            }}
          >
            {MODULES_PER_PAGE_OPTIONS.map(num => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            id="search-tags"
            label="Filter Modules by Tags"
            value={toJS(apiStore.tags)}
            onChange={onSearchTagsChange}
            fullWidth
            select
            InputLabelProps={{ shrink: true }}
            SelectProps={{
              multiple: true,
              renderValue: selected =>
                (selected as string[]).map(tag => <Chip key={tag} label={tag} />),
              margin: 'dense',
              MenuProps: {
                style: {
                  maxHeight: 400,
                },
              },
            }}
          >
            {apiStore.allowedTags.map(tag => (
              <MenuItem key={tag} value={tag}>
                {tag}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            id="module-sorting-filter"
            label="Module Sorting"
            value={apiStore.sorting}
            onChange={onChangeModuleSorting}
            select
            fullWidth
          >
            <MenuItem value="DATE_CREATED_DESC">Date (Newest to Oldest)</MenuItem>
            <MenuItem value="DATE_CREATED_ASC">Date (Oldest to Newest)</MenuItem>
            <MenuItem value="DOWNLOADS_DESC">Downloads (High to Low)</MenuItem>
            <MenuItem value="DOWNLOADS_ASC">Downloads (Low to High)</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.buttons}>
            <FormControl>
              <RadioGroup
                name="module-filter"
                value={selectedRadio}
                onChange={onFilterChange}
                row
              >
                <FormControlLabel value="all" label="All Modules" control={<Radio />} />
                <FormControlLabel
                  value="trusted"
                  label="Trusted Modules"
                  control={<Radio />}
                />
                {authStore.isAuthed && (
                  <FormControlLabel value="user" label="My Modules" control={<Radio />} />
                )}
                {authStore.isAuthed && !authStore.isDefault && (
                  <FormControlLabel
                    value="flagged"
                    label="Flagged Modules"
                    control={<Radio />}
                  />
                )}
              </RadioGroup>
            </FormControl>
            <TablePagination />
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
});
