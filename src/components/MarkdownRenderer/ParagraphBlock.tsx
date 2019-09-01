import React from 'react';

interface IParagraphBlockProps {
  children: React.ReactChild;
}

export default (props: IParagraphBlockProps) => (
  <p style={{ marginTop: 0, paddingTop: 0 }}>
    {props.children}
  </p>
);
