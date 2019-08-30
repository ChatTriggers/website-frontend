import React from 'react';
import {
  Paper,
  Container,
  Typography,
  Chip,
  Theme
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { IModule as IModuleProps } from '~api';
import { authStore } from '~store';
import TagList from './TagList';
import ModuleActions from './ModuleActions';

const maxTags = 3;

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    margin: theme.spacing(5),
    maxWidth: 1250,
    padding: `${theme.spacing(2)}px 0`
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingBottom: theme.spacing(2)
  },
  title: {
    marginRight: theme.spacing(3)
  },
  titleChip: {
    display: 'flex'
  },
  versionChip: {
    marginRight: theme.spacing(1)
  },
  body: {
    display: 'flex'
  },
  bodyMiddle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  imageOuter: {
    border: '3px solid gray',
    width: '300px',
    height: '200px',
    paddingLeft: 0
  },
  image: {
    width: '300px',
    height: '100%',
    objectFit: 'cover'
  },
  actions: {
    width: '300px'
  }
}));

export default (props: IModuleProps) => {
  const classes = useStyles({});
  const { id, name, owner, tags, description, image, releases } = props;

  return (
    <Paper
      className={classes.root}
      square
      elevation={4}
    >
      <Container className={classes.titleContainer}>
        <div className={classes.titleChip}>
          <Typography className={classes.title} variant="h5"><strong>{name}</strong></Typography>
          {releases.map(release => (
            <Chip
              className={classes.versionChip}
              key={release.id}
              color="secondary"
              size="small"
              label={<Typography variant="body2">{release.modVersion}</Typography>}
            />
          ))}
        </div>
        <Typography variant="h6">By <strong>{owner.name}</strong></Typography>
      </Container>
      <Container className={classes.body}>
        <div className={classes.imageOuter}>
          <img className={classes.image} src={image || 'https://www.chattriggers.com/default.png'} alt="Module" />
        </div>
        <Container className={classes.bodyMiddle}>
          <Typography>
            {description}
          </Typography>
          <TagList tags={tags} maxTags={maxTags} />
        </Container>
        <ModuleActions
          className={classes.actions}
          authed={(authStore.user && authStore.user.id === owner.id) || false}
          moduleId={id}
          description={description}
          image={image}
          tags={tags}
        />
      </Container>
    </Paper>
  );
};
