import React from 'react';
import hljs from 'highlight.js';
import { Theme } from '@material-ui/core';

interface ICodeBlockProps {
  value: string;
  language: string;
  theme: Theme;
}

export default class CodeBlock extends React.Component<ICodeBlockProps> {
  private el: HTMLElement | undefined;

  private setRef = (ref: HTMLElement) => {
    this.el = ref;
  }

  public componentDidMount = () => {
    this.highlightCode();
  }

  public componentDidUpdate = () => {
    this.highlightCode();
  }

  private highlightCode = () => {
    if (this.el)
      hljs.highlightBlock(this.el);
  }

  public render() {
    return (
      <pre>
        <code style={{ backgroundColor: '#333', borderRadius: 3 }} ref={this.setRef} className={`language-${this.props.language}`}>
          {this.props.value}
        </code>
      </pre>
    );
  }
}
