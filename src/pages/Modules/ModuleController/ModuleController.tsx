import React from 'react';
import {
  Paper,
  Container,
  Theme,
  FormGroup,
  FormControlLabel,
  TextField,
  Checkbox
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { inject, observer } from 'mobx-react';
import TablePagination from './TablePagination';
import { AuthStore, ModulesStore } from '../../../store';

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
  }
}));

interface IInjectedProps {
  authStore: AuthStore;
  modulesStore: ModulesStore;
}

export default inject('authStore', 'modulesStore')(observer((props: {}) => {
  const { authStore, modulesStore } = props as IInjectedProps;

  const classes = useStyles({});

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    modulesStore.viewConfig.search = e.target.value;
  };

  const onCheckFlagged = () => {
    modulesStore.viewConfig.flagged = !modulesStore.viewConfig.flagged;
  };

  const onCheckTrusted = () => {
    modulesStore.viewConfig.trusted = !modulesStore.viewConfig.trusted;
  };

  const onCheckUserModules = () => {
    modulesStore.viewConfig.userModules = !modulesStore.viewConfig.userModules;
  };

  /*
  search textbox
  checkbox for:
    my modules
    trusted modules
    flagged modules
  dropdown for modules per page
  page select
  */

  return (
    <Paper
      className={classes.root}
      square
      elevation={4}
    >
      <Container>
        <TextField
          id="search-query"
          placeholder="Search Modules"
          InputLabelProps={{ shrink: true }}
          value={modulesStore.viewConfig.search}
          onChange={onSearchChange}
          fullWidth
        />
        <Container className={classes.content}>
          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={modulesStore.viewConfig.userModules} onChange={onCheckUserModules} />}
              label="My Modules"
            />
            <FormControlLabel
              control={<Checkbox checked={modulesStore.viewConfig.trusted} onChange={onCheckTrusted} />}
              label="Trusted Modules"
            />
            {authStore.userIsTrusted && (
              <FormControlLabel
                control={<Checkbox checked={modulesStore.viewConfig.flagged} onChange={onCheckFlagged} />}
                label="Flagged Modules"
              />
            )}
          </FormGroup>
          <TablePagination />
        </Container>
      </Container>
    </Paper>
  );
}));
