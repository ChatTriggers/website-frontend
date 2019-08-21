import React from 'react';
import {
  Container,
  Paper,
  Chip,
  Popper,
  Fade,
  Typography,
  ClickAwayListener,
  Theme
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { view } from 'react-easy-state';

interface ITagListProps {
  tags?: string[];
  maxTags: number;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  chip: {
    margin: '0 4px'
  },
  popper: {
    padding: theme.spacing(1)
  }
}));

export default view((props: ITagListProps) => {
  const classes = useStyles();
  const { tags, maxTags } = props;
  const [tagExpand, setTagExpand] = React.useState(false);
  const [anchor, setAnchor] = React.useState<undefined | HTMLElement>();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setTagExpand(expand => !expand);

    if (!anchor)
      setAnchor(event.currentTarget);
  };

  const handleClickAway = () => {
    setTagExpand(false);
  };

  return (
    <>
      {tags && (
        <Container style={{ margin: 0, padding: 0 }}>
          {tags.slice(0, maxTags).map(tag => (
            <Chip
              key={tag}
              label={tag}
              className={classes.chip}
            />
          ))}
          {tags.length >= maxTags && (
            <>
              <Chip
                label="..."
                className={classes.chip}
                clickable={true}
                onClick={handleClick}
              />
              <Popper
                open={tagExpand}
                anchorEl={anchor}
                transition
              >
                {({ TransitionProps }) => (
                  <ClickAwayListener onClickAway={handleClickAway}>
                    <Fade {...TransitionProps} timeout={350}>
                      <Paper className={classes.popper}>
                        <Typography>
                          {tags.slice(maxTags).map(tag => (
                            <Chip
                              key={tag}
                              label={tag}
                              className={classes.chip}
                            />
                          ))}
                        </Typography>
                      </Paper>
                    </Fade>
                  </ClickAwayListener>
                )}
              </Popper>
            </>
          )}
        </Container>
      )}
    </>
  );
});
