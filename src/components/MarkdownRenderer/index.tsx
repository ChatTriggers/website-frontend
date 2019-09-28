import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import ParagraphBlock from './ParagraphBlock';
import HeadingBlock from './HeadingBlock';

interface IMarkdownRendererProps {
  source: string;
}

export default ({ source }: IMarkdownRendererProps): JSX.Element => (
  <ReactMarkdown
    source={source}
    escapeHtml
    renderers={{
      code: CodeBlock,
      paragraph: ParagraphBlock,
      heading: HeadingBlock,
    }}
  />
);
