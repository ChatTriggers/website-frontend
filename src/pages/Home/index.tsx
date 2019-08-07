import React from 'react';
import Parallax from 'react-springy-parallax';
import FlexView from 'react-flexview';
import logo from '../../assets/logo-long.png';
import background from '../../assets/background.jpg';
import './index.scss';

export default () => {
  return (
    <Parallax pages={3}>
      <Parallax.Layer
        offset={0}
        speed={1}
        style={{ zIndex: 5 }}
      >
        <FlexView 
          marginTop="35vh"
          vAlignContent="center"
          hAlignContent="center"
        >
          <img className="logo" src={logo} alt="Logo string" />
        </FlexView>
      </Parallax.Layer>
      <Parallax.Layer
        offset={0}
        speed={0.5}
        style={{ zIndex: 1 }}
      >
        <img className="background" src={background} alt="Background" />
      </Parallax.Layer>
    </Parallax>
  );
};
