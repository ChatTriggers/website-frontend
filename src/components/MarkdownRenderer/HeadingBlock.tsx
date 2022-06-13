import React from 'react';

interface IHeadingBlockProps {
  level: number;
  children: React.ReactNode & React.ReactNode[];
}

const styles = {
  marginTop: 0,
  paddingTop: 0,
};

export default ({ level, children }: IHeadingBlockProps) => {
  let el: JSX.Element | undefined | null;

  switch (level) {
    case 1:
      el = <h1 style={styles}>{children}</h1>;
      break;
    case 2:
      el = <h2 style={styles}>{children}</h2>;
      break;
    case 3:
      el = <h3 style={styles}>{children}</h3>;
      break;
    case 4:
      el = <h4 style={styles}>{children}</h4>;
      break;
    case 5:
      el = <h5 style={styles}>{children}</h5>;
      break;
    case 6:
      el = <h6 style={styles}>{children}</h6>;
      break;
    default:
      el = null;
  }

  return el;
};
