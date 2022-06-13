import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import darcula from 'react-syntax-highlighter/dist/esm/styles/prism/darcula';

import HeadingBlock from './HeadingBlock';
import ParagraphBlock from './ParagraphBlock';

interface IMarkdownRendererProps {
  source: string;
}

export default ({ source }: IMarkdownRendererProps) => (
  <ReactMarkdown
    components={{
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline ? (
          <SyntaxHighlighter style={darcula} language={match?.[1] ?? ''}>
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
      p: ParagraphBlock,
      h1: HeadingBlock,
      h2: HeadingBlock,
      h3: HeadingBlock,
      h4: HeadingBlock,
      h5: HeadingBlock,
      h6: HeadingBlock,
    }}
  >
    {source}
  </ReactMarkdown>
);
