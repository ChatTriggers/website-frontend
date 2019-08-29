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
import { withStyles } from '@material-ui/styles';
import { observer, observable, action } from '~store';

interface ITagListProps {
  tags?: string[];
  maxTags: number;
}

const styles = (theme: Theme) => ({
  chip: {
    margin: '0 4px'
  },
  popper: {
    padding: theme.spacing(1)
  }
});

@observer
class TagList extends React.Component<ITagListProps> {
  @observable
  private tagExpand = false;

  @observable
  private anchor: HTMLElement | undefined;

  @action
  private readonly handleClick = (e: React.MouseEvent<HTMLElement>) => {
    this.tagExpand = !this.tagExpand;

    if (!this.anchor) {
      this.anchor = e.currentTarget;
    }
  }

  @action
  private readonly handleClickAway = () => {
    this.tagExpand = false;
  }

  private get classes() {
    return (this.props as unknown as {
      classes: {
        [K in keyof ReturnType<typeof styles>]: string;
      }
    }).classes;
  }

  public render() {
    return (
      <>
        {this.props.tags && (
          <Container style={{ margin: 0, padding: 0 }}>
            {this.props.tags.slice(0, this.props.maxTags).map(tag => (
              <Chip
                key={tag}
                label={tag}
                className={this.classes.chip}
              />
            ))}
            {this.props.tags.length >= this.props.maxTags && (
              <>
                <Chip
                  label="..."
                  className={this.classes.chip}
                  clickable={true}
                  onClick={this.handleClick}
                />
                <Popper
                  open={this.tagExpand}
                  anchorEl={this.anchor}
                  transition
                >
                  {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={this.handleClickAway}>
                      <Fade {...TransitionProps} timeout={350}>
                        <div className={this.classes.popper}>
                          <Typography>
                            {this.props.tags && this.props.tags.slice(this.props.maxTags).map(tag => (
                              <Chip
                                key={tag}
                                label={tag}
                                className={this.classes.chip}
                              />
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
        )}
      </>
    );
  }
}

export default withStyles(styles, { withTheme: true })(TagList);
