import React from 'react';

interface IParagraphBlockProps {
  children: React.ReactChild;
}

export default ({ children }: IParagraphBlockProps): JSX.Element => (
  <p style={{ marginTop: 0, paddingTop: 0 }}>
    {children}
  </p>
);
