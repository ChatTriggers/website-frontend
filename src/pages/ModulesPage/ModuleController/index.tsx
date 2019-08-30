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
import { withStyles } from '@material-ui/styles';
import { getModules } from '~api';
import { authStore, modulesStore, observer, observable, action } from '~store';
import TablePagination from './TablePagination';
import { StyledComponent } from '~components';

const styles = (theme: Theme) => ({
  root: {
    margin: theme.spacing(5),
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    maxWidth: 1215
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
});

@observer
class ModuleController extends StyledComponent<typeof styles> {
  @observable
  private timeout: NodeJS.Timeout | undefined;

  @observable
  private selectedRadio: 'all' | 'user' | 'trusted' | 'flagged' = 'all';

  @action
  private readonly onSearchChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    const target = e.target;
    modulesStore.setSearch(target.value as string);

    this.timeout = setTimeout(() => {
      getModules();
    }, 1500);
  }

  @action
  private readonly onFilterChange = (_: React.ChangeEvent<{}>, value: string) => {
    const val = value as ('all' | 'user' | 'trusted' | 'flagged');

    if (val !== this.selectedRadio) {
      this.selectedRadio = val;

      modulesStore
        .setOnlyFlagged(authStore.isAuthed && !authStore.isDefault && val === 'flagged')
        .setOnlyTrusted(val === 'trusted')
        .setOnlyUserModules(val === 'user');

      getModules();
    }
  }

  public render() {
    return (
      <Paper
        className={this.classes.root}
        square
        elevation={4}
      >
        <Container>
          <FormGroup className={this.classes.searchContainer} row>
            <TextField
              className={this.classes.search}
              id="search-query"
              label="Search Modules"
              InputLabelProps={{ shrink: true }}
              value={modulesStore.search || ''}
              onChange={this.onSearchChange}
            />
            <TablePagination className={this.classes.pagination} />
          </FormGroup>
          <Container className={this.classes.content}>
            <RadioGroup
              name="module-filter"
              value={this.selectedRadio}
              onChange={this.onFilterChange}
              row
            >
              <FormControlLabel value="all" label="All Modules" control={<Radio />} />
              <FormControlLabel value="trusted" label="Trusted Modules" control={<Radio />} />
              {authStore.isAuthed && (
                <FormControlLabel value="user" label="My Modules" control={<Radio />} />
              )}
              {authStore.isAuthed && !authStore.isDefault && (
                <FormControlLabel value="flagged" label="Flagged Modules" control={<Radio />} />
              )}
            </RadioGroup>
          </Container>
        </Container>
      </Paper>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ModuleController);
