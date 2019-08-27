import React from 'react';
import { FormGroup, Button, ButtonGroup, Theme } from '@material-ui/core';
import {
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  StrikethroughS as FormatStrikethroughIcon,
  FormatListBulleted as FormatListBulletedIcon,
  FormatListNumbered as FormatListNumberedIcon,
  Link as LinkIcon,
  Code as CodeIcon
} from '@material-ui/icons';
import { makeStyles, createStyles } from '@material-ui/styles';
import Editor from './Editor';

const useStyles = makeStyles((theme: Theme) => createStyles({
  buttonContainerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  },
  buttonContainer: {
    display: 'flex',
    width: '500px',
    justifyContent: 'space-around',
    alignContent: 'center'
  },
  button: {
    padding: '0 4px'
  },
  editor: {
    margin: theme.spacing(2),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2),
    backgroundColor: '#616161'
  }
}));

interface IRichTextEditorProps {
  className?: string;
}

export default (props: IRichTextEditorProps) => {
  const classes = useStyles();

  return (
    <div className={props.className}>
      <div className={classes.buttonContainerWrapper}>
        <FormGroup
          className={classes.buttonContainer}
          row
        >
          <ButtonGroup variant="contained" color="secondary" size="large">
            <Button className={classes.button}>
              <FormatBoldIcon />
            </Button>
            <Button className={classes.button}>
              <FormatItalicIcon />
            </Button>
            <Button className={classes.button}>
              <FormatUnderlinedIcon />
            </Button>
            <Button className={classes.button}>
              <FormatStrikethroughIcon />
            </Button>
          </ButtonGroup>
          <ButtonGroup variant="contained" color="secondary" size="large">
            <Button className={classes.button}>
              <LinkIcon />
            </Button>
            <Button className={classes.button}>
              <CodeIcon />
            </Button>
            <Button className={classes.button}>
              <FormatListBulletedIcon />
            </Button>
            <Button className={classes.button}>
              <FormatListNumberedIcon />
            </Button>
          </ButtonGroup>
        </FormGroup>
      </div>
      <div className={classes.editor}>
        <Editor />
      </div>
    </div>
  );
};
