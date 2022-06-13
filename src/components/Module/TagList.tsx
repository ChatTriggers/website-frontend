import {
  ButtonBase,
  Chip,
  ClickAwayListener,
  Container,
  Fade,
  Popper,
  Theme,
  Typography,
  WithStyles,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { getModules } from '~api';
import { Styles } from '~components';
import { action, apiStore, observer } from '~store';

const styles: Styles = (theme: Theme) => ({
  chip: {
    margin: 4,
  },
  popper: {
    padding: theme.spacing(1),
  },
});

type TagListProps = RouteComponentProps & {
  tags?: string[];
  maxTags: number;
} & WithStyles<typeof styles>;

const TagList = observer(function TagList(props: TagListProps) {
  const [tagExpand, setTagExpand] = React.useState(false);
  const [anchor, setAnchor] = React.useState<HTMLElement | undefined>();

  const handleClick = action((e: React.MouseEvent<HTMLElement>) => {
    setTagExpand(!tagExpand);

    if (!anchor) {
      setAnchor(e.currentTarget);
    }
  });

  const handleClickAway = action(() => {
    setTagExpand(false);
  });

  const onClickTag = action((tag: string) => {
    apiStore.setSearch(`tag:${tag}`);
    getModules();
    props.history.push('/modules');
  });

  if (!props.tags) return null;
  return (
    <Container style={{ margin: 0, padding: 0 }}>
      {props.tags.slice(0, props.maxTags).map(tag => (
        <ButtonBase key={tag} onClick={() => onClickTag(tag)}>
          <Chip label={tag} className={props.classes.chip} />
        </ButtonBase>
      ))}
      {props.tags.length > props.maxTags && (
        <>
          <Chip
            label="..."
            className={props.classes.chip}
            clickable
            onClick={handleClick}
          />
          <Popper open={tagExpand} anchorEl={anchor} transition>
            {({ TransitionProps }) => (
              <ClickAwayListener onClickAway={handleClickAway}>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Fade {...TransitionProps} timeout={350}>
                  <div className={props.classes.popper}>
                    <Typography>
                      {props.tags &&
                        props.tags
                          .slice(props.maxTags)
                          .map(tag => (
                            <Chip key={tag} label={tag} className={props.classes.chip} />
                          ))}
                    </Typography>
                  </div>
                </Fade>
              </ClickAwayListener>
            )}
          </Popper>
        </>
      )}
    </Container>
  );
});

export default withStyles(styles)(withRouter(TagList));
