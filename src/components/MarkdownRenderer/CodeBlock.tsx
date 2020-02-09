import React from 'react';
import { Theme, withStyles } from '@material-ui/core';
import hljs from 'highlight.js';
import clsx from 'clsx';
import { StyledComponent, Styles } from '~components';

interface ICodeBlockProps {
  value: string;
  language: string;
  theme: Theme;
}

const styles: Styles = (theme: Theme) => ({
  code: {
    backgroundColor: '#333',
    width: `calc(100% - ${theme.spacing(2) * 2})`,
    borderRadius: 3,
    whiteSpace: 'pre-wrap',
    padding: theme.spacing(2),
  },
});

class CodeBlock extends StyledComponent<typeof styles, ICodeBlockProps> {
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
    if (this.el) {
      hljs.highlightBlock(this.el);
    }
  }

  private addIndent = (source: string): JSX.Element => (
    <>
      {source && source.split(/(\(|\)|,)/g).reduce((prev, curr) => (
        <>
          {prev}
          <wbr />
          {curr}
        </>
      ), <></>)}
    </>
  )

  public render(): JSX.Element {
    const { value, language } = this.props;

    return (
      <pre>
        <code
          ref={this.setRef}
          className={clsx(`language-${language}`, this.classes.code)}
        >
          {this.addIndent(value)}
        </code>
      </pre>
    );
  }
}

export default withStyles(styles)(CodeBlock);
