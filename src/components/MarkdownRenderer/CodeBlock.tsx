import React from 'react';
import { Theme } from '@material-ui/core';
import hljs from 'highlight.js';

interface ICodeBlockProps {
  value: string;
  language: string;
  theme: Theme;
}

export default class CodeBlock extends React.Component<ICodeBlockProps> {
  private el: HTMLElement | undefined;

  private readonly setRef = (ref: HTMLElement) => {
    this.el = ref;
  }

  public componentDidMount = () => {
    this.highlightCode();
  }

  public componentDidUpdate = () => {
    this.highlightCode();
  }

  private readonly highlightCode = () => {
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
