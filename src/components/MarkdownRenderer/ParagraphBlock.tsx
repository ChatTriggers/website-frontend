import React from 'react';

interface IParagraphBlockProps {
  children: React.ReactNode & React.ReactNode[];
}

export default ({ children }: IParagraphBlockProps) => (
  <p style={{ marginTop: 0, paddingTop: 0 }}>{children}</p>
);
