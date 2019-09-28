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

  private readonly setRef = (ref: HTMLElement): void => {
    this.el = ref;
  }

  public componentDidMount = (): void => {
    this.highlightCode();
  }

  public componentDidUpdate = (): void => {
    this.highlightCode();
  }

  private readonly highlightCode = (): void => {
    if (this.el) hljs.highlightBlock(this.el);
  }

  public render(): JSX.Element {
    const { value, language } = this.props;

    return (
      <pre>
        <code
          style={{
            backgroundColor: '#333', width: '100%', borderRadius: 3,
          }}
          ref={this.setRef}
          className={`language-${language}`}
        >
          {value}
        </code>
      </pre>
    );
  }
}
