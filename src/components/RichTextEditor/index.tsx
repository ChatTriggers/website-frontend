import React from 'react';
import { Paper, FormGroup, Button, ButtonGroup, Theme } from '@material-ui/core';
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
import { withStyles, WithStyles } from '@material-ui/styles';
import Editor from './Editor';

const styles = (theme: Theme) => ({
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
});

class RichTextEditor extends React.Component {
  private get classes() {
    return (this.props as WithStyles<ReturnType<typeof styles>>).classes;
  }

  public render() {
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <FormGroup
            className={this.classes.buttonContainer}
            row
          >
            <ButtonGroup variant="contained" color="secondary" size="large">
              <Button className={this.classes.button}>
                <FormatBoldIcon />
              </Button>
              <Button className={this.classes.button}>
                <FormatItalicIcon />
              </Button>
              <Button className={this.classes.button}>
                <FormatUnderlinedIcon />
              </Button>
              <Button className={this.classes.button}>
                <FormatStrikethroughIcon />
              </Button>
            </ButtonGroup>
            <ButtonGroup variant="contained" color="secondary" size="large">
              <Button className={this.classes.button}>
                <LinkIcon />
              </Button>
              <Button className={this.classes.button}>
                <CodeIcon />
              </Button>
              <Button className={this.classes.button}>
                <FormatListBulletedIcon />
              </Button>
              <Button className={this.classes.button}>
                <FormatListNumberedIcon />
              </Button>
            </ButtonGroup>
          </FormGroup>
        </div>
        <div className={this.classes.editor}>
          <Editor />
        </div>
      </>
    );
  }
}

export default withStyles(styles, { withTheme: true })(RichTextEditor);
