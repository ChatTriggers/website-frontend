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
import { AuthStore } from '../../../store';

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
}

export default inject('authStore')(observer((props: {}) => {
  const { authStore } = props as IInjectedProps;

  const [search, setSearch] = React.useState('');
  const [flagged, setFlagged] = React.useState(false);
  const [trusted, setTrusted] = React.useState(true);
  const [userModules, setUserModules] = React.useState(true);

  const classes = useStyles({});

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onCheckFlagged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlagged(isFlagged => !isFlagged);
  };

  const onCheckTrusted = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrusted(isTrusted => !isTrusted);
  };

  const onCheckUserModules = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserModules(isUserModules => !isUserModules);
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
          value={search}
          onChange={onSearchChange}
          fullWidth
        />
        <Container className={classes.content}>
          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={userModules} onChange={onCheckUserModules} />}
              label="My Modules"
            />
            <FormControlLabel
              control={<Checkbox checked={trusted} onChange={onCheckTrusted} />}
              label="Trusted Modules"
            />
            {authStore.userIsTrusted && (
              <FormControlLabel
                control={<Checkbox checked={flagged} onChange={onCheckFlagged} />}
                label="Flagged Modules"
              />
            )}
          </FormGroup>
          <TablePagination
            modulesPerPageOptions={[10, 25, 50]}
            offset={0}
            totalModules={10}
            onChangePage={() => {/** */ }}
            onChangeModulesPerPageOption={() => {/** */ }}
          />
        </Container>
      </Container>
    </Paper>
  );
}));
