import { FormControl, InputLabel, NativeSelect, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

import { apiStore } from '~store';

const useStyles = makeStyles((theme: Theme) => ({
  textField: {
    margin: theme.spacing(0, 4),
    width: 200,
  },
}));

interface IProps {
  ctVersion: string;
  setCtVersion(version: string): void;
}

export default ({ ctVersion, setCtVersion }: IProps) => {
  const classes = useStyles();

  const setCtVersion2 = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setCtVersion(e.target.value);
  };

  return (
    <FormControl className={classes.textField}>
      <InputLabel htmlFor="ct-version">CT Version</InputLabel>
      <NativeSelect
        value={ctVersion}
        onChange={setCtVersion2}
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
