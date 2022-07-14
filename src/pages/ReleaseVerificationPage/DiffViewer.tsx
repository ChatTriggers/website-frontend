import { Collapse, IconButton, Paper, Theme, Typography } from '@material-ui/core';
import {
  ChevronRight as ArrowRightIcon,
  ExpandMore as ArrowDownIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import * as monaco from 'monaco-editor';
import React, { useEffect, useRef } from 'react';

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

export default ({ diff }: IDiffViewerProps) => {
  const { path, isBinary, oldText, newText } = diff;

  const classes = useStyles();
  const [shown, setShown] = React.useState(true);

  const wrapperEditorRef = useRef<monaco.editor.IEditor | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      const diffEditor = monaco.editor.createDiffEditor(wrapperRef.current, {
        theme: 'vs-dark',
        readOnly: true,
      });

      const lang = path.endsWith('.json') ? 'json' : 'javascript';

      const oldModel = monaco.editor.createModel(oldText ?? '', lang);
      const newModel = monaco.editor.createModel(newText ?? '', lang);

      diffEditor.setModel({
        original: oldModel,
        modified: newModel,
      });

      diffEditor.onDidUpdateDiff(() => {
        const changes = diffEditor.getLineChanges();
        if (changes !== null) setShown(changes.length !== 0);
      });

      wrapperEditorRef.current = diffEditor;
    }

    return () => {
      wrapperEditorRef.current?.dispose();
      wrapperEditorRef.current = null;
    };
  }, []);

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
      </div>
      <Collapse in={shown}>
        {!isBinary && <div ref={wrapperRef} style={{ width: '100%', height: 460 }} />}
      </Collapse>
    </Paper>
  );
};
