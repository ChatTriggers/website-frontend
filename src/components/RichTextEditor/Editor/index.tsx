import React, { ReactNode } from 'react';
import { Editor, RenderBlockProps, EventHook } from 'slate-react';
import { Value, Editor as EditorType } from 'slate';

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            text: 'Placeholder text'
          }
        ]
      }
    ]
  }
});

const CodeNode = (props: RenderBlockProps) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

interface IState {
  value: Value;
}

export default class extends React.Component<{}, IState> {
  public state = {
    value: initialValue,
  };

  private onChange = ({ value }: { value: Value }) => {
    this.setState({ value });
  }

  // tslint:disable-next-line:no-any
  private onKeyDown: EventHook = (event: any, editor, next) => {
    // Return with no changes if it's not the "`" key with ctrl pressed.
    if (event.key !== '`' || !event.ctrlKey) return next();

    // Prevent the "`" from being inserted by default.
    event.preventDefault();

    // Otherwise, set the currently selected blocks type to "code".
    editor.setBlocks('code');
  }

  public render() {
    return (
      <Editor
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderBlock={this.renderBlock}
      />
    );
  }

  public renderBlock = (props: RenderBlockProps, editor: EditorType, next: () => unknown) => {
    switch (props.node.type) {
      case 'code':
        return <CodeNode {...props} />;
      default:
        return next();
    }
  }
}
