import React from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Collapse,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@material-ui/icons';
import { IRelease } from '~types';
import MarkdownRenderer from '~components/MarkdownRenderer';

const useStyles = makeStyles((theme: Theme) => ({
  releaseTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  releaseTypography: {
    padding: theme.spacing(0, 1),
  },
  descDivider: {
    margin: theme.spacing(0, 4, 1, 4),
  },
  body: {
    padding: theme.spacing(0, 4),
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
    <List component="nav">
      <Divider />
      {releases.slice().sort((a, b) => b.createdAt - a.createdAt).map(release => {
        const releaseChip = <Chip label={`v${release.releaseVersion}`} size="small" />;
        const modChip = <Chip label={`v${release.modVersion}`} size="small" />;

        const label = (
          <div className={classes.releaseTitle}>
            {releaseChip}
            <Typography className={classes.releaseTypography}>for ct</Typography>
            {modChip}
          </div>
        );

        return (
          <div key={release.id}>
            <ListItem button onClick={onReleaseClick(release.id)}>
              <ListItemText primary={label} />
              {openRelease === release.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            <Collapse
              in={openRelease === release.id}
              timeout="auto"
              unmountOnExit
            >
              <Divider className={classes.descDivider} />
              <div className={classes.body}>
                <Typography>
                  Downloads:
                  {` ${release.downloads}`}
                </Typography>
                <br />
                <Typography>Changelog:</Typography>
                <MarkdownRenderer source={release.changelog} />
              </div>
            </Collapse>
            <Divider />
          </div>
        );
      })}
    </List>
  );
};
