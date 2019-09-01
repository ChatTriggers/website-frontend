import React from 'react';
import { withTheme } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import Editor from 'for-editor-dark';

interface IMarkdownEditorProps {
  value?: string;
  handleChange(value?: string): void;
}

class MarkdownEditor extends React.Component<IMarkdownEditorProps> {
  private get theme() {
    return (this.props as unknown as { theme: Theme }).theme;
  }

  public render() {
    return (
      <>
        <Editor
          value={this.props.value}
          onChange={this.props.handleChange}
          height="300px"
          language="en"
          style={{
            margin: this.theme.spacing(2)
          }}
          placeholder="Module Description"
        />
      </>
    );
  }
}

export default withTheme(MarkdownEditor);
