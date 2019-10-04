import React from 'react';
import { withTheme } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import Editor from 'for-editor-dark';

interface IMarkdownEditorProps {
  value?: string;
  handleChange(value?: string): void;
}

class MarkdownEditor extends React.Component<IMarkdownEditorProps> {
  private get theme(): Theme {
    return (this.props as unknown as { theme: Theme }).theme;
  }

  public render(): JSX.Element {
    const { value, handleChange } = this.props;

    return (
      <>
        <Editor
          value={value}
          onChange={handleChange}
          height="300px"
          language="en"
          style={{
            margin: this.theme.spacing(2),
          }}
          placeholder="Module Description"
        />
      </>
    );
  }
}

export default withTheme(MarkdownEditor);
