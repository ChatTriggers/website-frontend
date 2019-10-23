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
  CircularProgress,
  Theme,
  Chip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Redirect } from 'react-router-dom';
import { History } from 'history';
import clsx from 'clsx';
import {
  modulesStore,
  authStore,
  errorStore,
  observer,
  action,
  runInAction,
  MODULES_PER_PAGE_OPTIONS,
} from '~store';
import { ModuleSearchFilter, ModuleSorting } from '~types';
import { getModules } from '~api';
import { Desktop } from '~components/utils/DeviceUtils';

interface IMobileFilterPageProps {
  history: History;
}

interface IStyleProps {
  searchValue: boolean;
  tagSearchValue: boolean;
}

const useStyles = makeStyles<Theme, IStyleProps>((theme: Theme) => ({
  root: {
    width: '100vw',
    height: `calc(100vh - 56px - ${theme.spacing(2)}px)`,
  },
  paperContainer: {
    margin: 'auto',
    width: '100%',
    maxWidth: 360,
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
  tagSearch: {
    width: '100%',
    marginBottom: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter,
    }),
    marginTop: props => (props.tagSearchValue ? 0 : -25),
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
  searchProgress: {
    margin: theme.spacing(2),
    width: '100%',
    height: '100%',
  },
  tagChip: {
    marginRight: theme.spacing(1),
  },
}));

export default observer(() => {
  const [searching, setSearching] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [tagSearchFocused, setTagSearchFocused] = React.useState(false);
  const [searchTimeout, setSearchTimeout] = React.useState(undefined as NodeJS.Timeout[] | undefined);

  const classes = useStyles({
    searchValue: searchFocused || !!modulesStore.search,
    tagSearchValue: tagSearchFocused || modulesStore.searchTags.length !== 0,
  });

  const { search, searchTags } = modulesStore;

  const onSearchChange = action(({ target }: React.ChangeEvent<HTMLInputElement>) => {
    modulesStore.setSearch(target.value);

    if (errorStore.modulesNotLoaded) {
      runInAction(() => {
        errorStore.modulesNotLoaded = false;
      });
    }

    if (searchTimeout) searchTimeout.forEach(clearTimeout);

    setSearchTimeout([setTimeout(async () => {
      setSearching(true);
      await getModules();
      setSearching(false);
    }, 1500), setTimeout(() => {
      if (modulesStore.modules.length === 0) {
        runInAction(() => {
          errorStore.modulesNotLoaded = true;
        });
      }
    }, 6500)]);
  });

  const onTagSearchChange = action(({ target }: React.ChangeEvent<HTMLInputElement>) => {
    modulesStore.setSearchTags(target.value as unknown as string[]);

    if (errorStore.modulesNotLoaded) {
      runInAction(() => {
        errorStore.modulesNotLoaded = false;
      });
    }

    if (searchTimeout) searchTimeout.forEach(clearTimeout);

    setSearchTimeout([setTimeout(async () => {
      setSearching(true);
      await getModules();
      setSearching(false);
    }, 1500), setTimeout(() => {
      if (modulesStore.modules.length === 0) {
        runInAction(() => {
          errorStore.modulesNotLoaded = true;
        });
      }
    }, 6500)]);
  });

  const onSearchFocus = (): void => {
    setSearchFocused(true);
  };

  const onSearchBlur = (): void => {
    setSearchFocused(false);
  };

  const onTagSearchFocus = (): void => {
    setTagSearchFocused(true);
  };

  const onTagSearchBlur = (): void => {
    setTagSearchFocused(false);
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

  const onChangeModuleSorting = (e: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    const moduleSorting = e.target.value as ModuleSorting;

    if (moduleSorting !== modulesStore.moduleSorting) {
      modulesStore.setModuleSorting(moduleSorting);
      getModules();
    }
  };

  React.useEffect(() => () => {
    // onUnmount
    if (searchTimeout) searchTimeout.forEach(clearTimeout);
  }, []);

  return (
    <>
      <Desktop>
        <Redirect to="/modules" />
      </Desktop>
      <div className={classes.root}>
        <div className={classes.paperContainer}>
          <Paper className={classes.paper}>
            <TextField
              className={classes.search}
              label="Search Modules"
              margin="normal"
              placeholder="Search module names"
              value={search}
              onChange={onSearchChange}
              onFocus={onSearchFocus}
              onBlur={onSearchBlur}
              InputProps={{
                endAdornment: (searching && (
                  <div>
                    <CircularProgress
                      size={15}
                      thickness={7}
                    />
                  </div>
                )) || undefined,
              }}
              multiline
            />
          </Paper>
          <Paper className={classes.paper}>
            <TextField
              className={classes.tagSearch}
              label="Filter by Tags"
              margin="normal"
              select
              value={searchTags}
              onChange={onTagSearchChange}
              onFocus={onTagSearchFocus}
              onBlur={onTagSearchBlur}
              InputProps={{
                endAdornment: (searching && (
                  <div>
                    <CircularProgress
                      size={15}
                      thickness={7}
                      style={{ marginRight: 30 }}
                    />
                  </div>
                )) || undefined,
              }}
              SelectProps={{
                multiple: true,
                renderValue: (selected: unknown) => (selected as string[]).map(tag => (
                  <Chip key={tag} label={tag} size="small" color="primary" style={{ marginRight: 4 }} />
                )),
              }}
            >
              {modulesStore.allowedTags.map(tag => <MenuItem key={tag} value={tag}>{tag}</MenuItem>)}
            </TextField>
          </Paper>
          <Paper className={classes.paper}>
            <FormControl component="fieldset">
              <FormLabel component="legend" focused={false}>Module Search Filters</FormLabel>
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
          <Paper className={classes.paper}>
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
          <Paper className={classes.paper}>
            <TextField
              id="module-sorting-filter"
              label="Module Sorting"
              value={modulesStore.moduleSorting}
              onChange={onChangeModuleSorting}
              select
              fullWidth
            >
              <MenuItem value="DATE_CREATED_DESC">Date (Newest to Oldest)</MenuItem>
              <MenuItem value="DATE_CREATED_ASC">Date (Oldest to Newest)</MenuItem>
              <MenuItem value="DOWNLOADS_DESC">Downloads (High to Low)</MenuItem>
              <MenuItem value="DOWNLOADS_ASC">Downloads (Low to High)</MenuItem>
            </TextField>
          </Paper>
        </div>
      </div>
    </>
  );
});
