import React from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Collapse,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@material-ui/icons';
import { IRelease } from '~types';
import MarkdownRenderer from '~components/MarkdownRenderer';

const useStyles = makeStyles((theme: Theme) => ({
  collapse: {
    padding: theme.spacing(2, 2, 2, 4),
  },
}));

interface IReleasesTableProps {
  releases: IRelease[];
}

export default ({ releases }: IReleasesTableProps): JSX.Element => {
  const classes = useStyles();
  const [openRelease, setOpenRelease] = React.useState('');

  const onReleaseClick = (id: string) => () => {
    if (openRelease === id) {
      setOpenRelease('');
    } else {
      setOpenRelease(id);
    }
  };

  return (
    <List
      component="nav"
    >
      <Divider />
      {releases.map(release => (
        <div key={release.id}>
          <ListItem
            button
            onClick={onReleaseClick(release.id)}
          >
            <ListItemText primary={`v${release.releaseVersion} for ct v${release.modVersion}`} />
            {openRelease === release.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse
            in={openRelease === release.id}
            timeout="auto"
            unmountOnExit
            className={classes.collapse}
          >
            <Typography>
              Downloads:
              {` ${release.downloads}`}
            </Typography>
            <br />
            <Typography>
              Changelog:
            </Typography>
            <MarkdownRenderer source={release.changelog} />
          </Collapse>
          <Divider />
        </div>
      ))}
    </List>
  );
};
