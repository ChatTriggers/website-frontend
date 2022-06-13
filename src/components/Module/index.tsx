import {
  Button,
  IconButton,
  Paper,
  Theme,
  Typography,
  WithStyles,
} from '@material-ui/core';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { Styles } from '~components';
import MarkdownRenderer from '~components/MarkdownRenderer';
import { action, observer } from '~store';
import { IModule } from '~types';

const styles: Styles = (theme: Theme) => ({
  root: {
    [theme.breakpoints.only('xs')]: {
      margin: theme.spacing(2),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      margin: theme.spacing(3),
    },
    [theme.breakpoints.up('lg')]: {
      margin: theme.spacing(2, 4),
      padding: theme.spacing(1),
      width: '100%',
      maxWidth: `calc(1000px - ${theme.spacing(1) * 2}px)`,
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    padding: theme.spacing(2, 0, 0, 2),
    width: `calc(100% - 64px - ${theme.spacing(2) * 3}px)`,
  },
  title: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  titleChip: {
    display: 'flex',
  },
  versionChip: {
    marginRight: theme.spacing(1),
  },
  body: {
    display: 'flex',
    width: '90%',
    padding: theme.spacing(2, 2, 0, 2),
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  imageOuter: {
    alignSelf: 'center',
    justifySelf: 'center',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      maxWidth: 320,
      padding: theme.spacing(0, 2, 0, 0),
    },
    [theme.breakpoints.down('sm')]: {
      flexGrow: 1,
      paddingLeft: 0,
    },
  },
  image: {
    maxHeight: '180px',
    objectFit: 'contain',
    maxWidth: 320,
  },
  actions: {
    width: '300px',
  },
  viewButton: {
    margin: theme.spacing(4, 2, 2, 0),
  },
  expandButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});

type ModuleProps = RouteComponentProps & { module: IModule } & WithStyles<typeof styles>;

const Module = observer((props: ModuleProps) => {
  const [height, setHeight] = React.useState<number | undefined>(300);
  const [collapsible, setCollapsible] = React.useState(false);
  const markdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(
    action(() => {
      setCollapsible(
        (markdownRef.current && markdownRef.current.clientHeight === height) || false,
      );
    }),
    [],
  );

  const onClickModule = action((): void => {
    const { history, module } = props;
    history.push(`/modules/v/${module.name}`);
  });

  const toggleExpand = action(() => {
    if (height) {
      setHeight(undefined);
    } else {
      setHeight(300);
    }
  });

  const { module, classes } = props;

  return (
    <Paper className={classes.root} square>
      <div className={classes.header}>
        <div className={classes.titleContainer}>
          <div className={classes.titleChip}>
            <Typography className={classes.title} variant="h5">
              {module.name}
            </Typography>
          </div>
          <Typography className={classes.title} variant="h6">
            By {module.owner.name}
          </Typography>
        </div>
        {/* <Link to={`/modules/v/${props.module.name}`}> */}
        <Button
          className={classes.viewButton}
          color="primary"
          variant="contained"
          onClick={onClickModule}
        >
          View
        </Button>
        {/* </Link> */}
      </div>
      <div className={classes.body}>
        {module.image && (
          <div className={classes.imageOuter}>
            <img className={classes.image} src={module.image} alt="Module" />
          </div>
        )}
        <div
          ref={markdownRef}
          style={{
            maxHeight: height,
            overflow: 'hidden',
            marginBottom: collapsible ? 12 : 0,
          }}
        >
          <MarkdownRenderer source={module.description} />
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        {collapsible && (
          <IconButton
            onClick={toggleExpand}
            color="primary"
            className={`${clsx(
              classes.viewButton,
              classes.expandButton,
            )} MuiButton-containedPrimary MuiButton-contained MuiButton-root`}
          >
            {height ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
          </IconButton>
        )}
      </div>
    </Paper>
  );
});

export default withStyles(styles)(withRouter(Module));
