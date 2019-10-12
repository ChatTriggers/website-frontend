import React from 'react';
import {
  Typography,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ModuleActions from '~components/Module/ModuleActions';
import { modulesStore } from '~store';

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    width: '100%',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  actions: {
    width: 180,
  },
  imageOuter: {
    alignSelf: 'center',
    justifySelf: 'center',
    flexGrow: 1,
    paddingLeft: 0,
  },
  image: {
    // height: '100%',
    maxWidth: `calc(100vw - ${theme.spacing(2) * 4}px)`,
    maxHeight: '180px',
    objectFit: 'contain',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2, 2, 0, 2),
  },
}));

interface IModulePageHeaderProps {
  editing: boolean;
  setEditing(editing: boolean): void;
}

export default (props: IModulePageHeaderProps): JSX.Element => {
  const classes = useStyles();

  const { editing, setEditing } = props;

  return (
    <>
      <div className={classes.header}>
        <div>
          <Typography
            className={classes.title}
            variant="h5"
          >
            {modulesStore.activeModule.name}
          </Typography>
          <Typography
            className={classes.title}
            variant="h6"
          >
            {`By ${modulesStore.activeModule.owner.name}`}
          </Typography>
        </div>
        <ModuleActions
          className={classes.actions}
          editing={editing}
          setEditing={setEditing}
        />
      </div>
      {modulesStore.activeModule.image && (
        <div className={classes.body}>
          <div className={classes.imageOuter}>
            <img
              className={classes.image}
              src={modulesStore.activeModule.image}
              alt="Module"
            />
          </div>
        </div>
      )}
    </>
  );
};
