import React from 'react';
import { Paper, Container, Typography, Chip, Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';

interface IModuleProps {
  name: string;
  author: string;
  downloads: number;
  tags?: string[];
  description?: string;
  url?: string;
}

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
  },
  chip: {
    margin: '0 4px'
  }
}));

export default (props: IModuleProps) => {
  const classes = useStyles({});
  const { name, author, tags, description, url } = props;

  return (
    <Paper className={classes.root}>
      <Container className={classes.title}>
        <Typography variant="h5"><strong>{name}</strong></Typography>
        <Typography variant="h6">By <strong>{author}</strong></Typography>
      </Container>
      <Container className={classes.body}>
        <div className={classes.imageOuter}>
          <img className={classes.image} src={url || 'https://www.chattriggers.com/default.png'} alt="Module" />
        </div>
        <Container className={classes.bodyMiddle}>
          <Typography>
            {description}
          </Typography>
          <Container style={{ margin: 0, padding: 0 }}>
            {tags && tags.map(tag => (
              <Chip
                key={tag}
                label={tag}
                className={classes.chip}
              />
            ))}
          </Container>
        </Container>
      </Container>
    </Paper>
  );
};
