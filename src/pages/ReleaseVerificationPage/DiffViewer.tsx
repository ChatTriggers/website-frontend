import React from 'react';
import {
  Paper,
  Theme,
  Typography,
  Collapse,
  IconButton,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import {
  ExpandMore as ArrowDownIcon,
  ChevronRight as ArrowRightIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import ReactDiffViewer from 'react-diff-viewer';

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    margin: theme.spacing(1),
    width: `calc(100% - ${2 * theme.spacing(10)}px)`,
  },
  header: {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingLeft: theme.spacing(3),
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
    minHeight: 48,
  },
  headerLeft: {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing(5),
  },
  fileName: {
    marginLeft: theme.spacing(2),
  },
}));

export interface IDiff {
  path: string;
  isBinary: boolean;
  oldText: string | undefined;
  newText: string | undefined;
}

interface IDiffViewerProps {
  diff: IDiff;
}

export default ({ diff }: IDiffViewerProps): JSX.Element => {
  const {
    path,
    isBinary,
    oldText,
    newText,
  } = diff;
  const splitViewChangable = oldText !== undefined && newText !== undefined;

  const classes = useStyles();
  const [shown, setShown] = React.useState(true);
  const [splitView, setSplitView] = React.useState(true);

  return (
    <Paper className={classes.paper}>
      <div className={classes.header}>
        <div className={classes.headerLeft}>
          {!isBinary && (
            <IconButton onClick={() => setShown(!shown)}>
              {shown ? <ArrowDownIcon /> : <ArrowRightIcon />}
            </IconButton>
          )}
          <Typography className={classes.fileName} variant="h6">
            {path + (isBinary ? ' (Binary)' : '')}
          </Typography>
          {isBinary && (
            <>
              <Typography variant="body1" style={{ marginLeft: 20 }}>
                Old Size:
                {'  '}
                {oldText?.length || 0}
              </Typography>
              <Typography variant="body1" style={{ marginLeft: 20 }}>
                New Size:
                {'  '}
                {newText?.length || 0}
              </Typography>
            </>
          )}
        </div>
        {splitViewChangable && !isBinary && (
          <div className={classes.headerRight}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={splitView}
                  onChange={() => setSplitView(!splitView)}
                />
              )}
              label="Split view"
            />
          </div>
        )}
      </div>
      <Collapse in={shown}>
        {!isBinary && (
          <ReactDiffViewer
            key={path}
            oldValue={oldText}
            newValue={newText}
            splitView={splitViewChangable && splitView}
            useDarkTheme
          />
        )}
      </Collapse>
    </Paper>
  );
};
