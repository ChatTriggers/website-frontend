import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import ParagraphBlock from './ParagraphBlock';
import HeadingBlock from './HeadingBlock';

interface IMarkdownRendererProps {
  source: string;
}

export default (props: IMarkdownRendererProps) => (
  <ReactMarkdown
    source={props.source}
    escapeHtml={true}
    renderers={{
      code: CodeBlock,
      paragraph: ParagraphBlock,
      heading: HeadingBlock
    }}
  />
);
