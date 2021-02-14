import React from 'react';
import {
  FormControl,
  InputLabel,
  NativeSelect,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { apiStore } from '~store';

const useStyles = makeStyles((theme: Theme) => ({
  textField: {
    margin: theme.spacing(0, 4),
    width: 200,
  },
}));

interface IProps {
  setCtVersionHook(version: string): void;
}

export default ({ setCtVersionHook }: IProps): JSX.Element => {
  const classes = useStyles();
  const [ctVersion, _setCtVersion] = React.useState(apiStore.latestVersion);

  const setCtVersion = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    _setCtVersion(e.target.value);
    setCtVersionHook(e.target.value);
  };

  return (
    <FormControl className={classes.textField}>
      <InputLabel htmlFor="ct-version">CT Version</InputLabel>
      <NativeSelect
        value={ctVersion}
        onChange={setCtVersion}
        inputProps={{
          name: 'CT Version',
          id: 'ct-version',
        }}
      >
        {apiStore.ctVersions.map(({ majorMinor, patches }) => (
          <optgroup label={`${majorMinor}.X`} key={majorMinor}>
            {patches.map(patch => (
              <option value={`${majorMinor}.${patch}`} key={majorMinor + patch}>
                {`${majorMinor}.${patch}`}
              </option>
            ))}
          </optgroup>
        ))}
      </NativeSelect>
    </FormControl>
  );
};
