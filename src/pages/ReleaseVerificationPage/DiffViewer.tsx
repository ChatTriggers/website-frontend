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

interface IDiffViewerProps {
  path: string;
  oldText: string | undefined;
  newText: string | undefined;
}

export default ({ path, oldText, newText }: IDiffViewerProps): JSX.Element => {
  const splitViewChangable = oldText !== undefined && newText !== undefined;

  const classes = useStyles();
  const [shown, setShown] = React.useState(true);
  const [splitView, setSplitView] = React.useState(true);

  return (
    <Paper className={classes.paper}>
      <div className={classes.header}>
        <div className={classes.headerLeft}>
          <IconButton onClick={() => setShown(!shown)}>
            {shown ? <ArrowDownIcon /> : <ArrowRightIcon />}
          </IconButton>
          <Typography className={classes.fileName} variant="h6">
            {path}
          </Typography>
        </div>
        {splitViewChangable ? (
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
        ) : null}
      </div>
      <Collapse in={shown}>
        <ReactDiffViewer
          key={path}
          oldValue={oldText}
          newValue={newText}
          splitView={splitViewChangable && splitView}
          useDarkTheme
        />
      </Collapse>
    </Paper>
  );
};
