import React from 'react';
import {
  Paper,
  Container,
  Typography,
  Theme
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { IModule as IModuleProps } from '../../../api';
// import TagList from './TagList';

// const maxTags = 3;

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    margin: theme.spacing(5),
    padding: `${theme.spacing(2)}px 0`
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingBottom: theme.spacing(2)
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
  }
}));

export default (props: IModuleProps) => {
  const classes = useStyles({});
  const { name, owner, /*tags,*/ description, image } = props;

  return (
    <Paper
      className={classes.root}
      square
      elevation={4}
    >
      <Container className={classes.title}>
        <Typography variant="h5"><strong>{name}</strong></Typography>
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
          {/* <TagList tags={tags} maxTags={maxTags} /> */}
        </Container>
      </Container>
    </Paper>
  );
};
