import React from 'react';

interface IHeadingBlockProps {
  level: number;
  children: React.ReactChild;
}

const styles = {
  marginTop: 0,
  paddingTop: 0
};

export default (props: IHeadingBlockProps) => {
  return props.level === 1 ? <h1 style={styles}>{props.children}</h1> :
    props.level === 2 ? <h2 style={styles}>{props.children}</h2> :
      props.level === 3 ? <h3 style={styles}>{props.children}</h3> :
        props.level === 4 ? <h4 style={styles}>{props.children}</h4> :
          props.level === 5 ? <h5 style={styles}>{props.children}</h5> :
            // tslint:disable-next-line:no-null-keyword
            props.level === 6 ? <h6 style={styles}>{props.children}</h6> : null;
};
