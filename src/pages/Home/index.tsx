import React from 'react';
import Parallax from 'react-springy-parallax';
import { Button, Box } from 'grommet';
import logo from '../../assets/logo-long.png';
import background from '../../assets/background.jpg';
import './index.scss';

export default () => {
  return (
    <Parallax pages={3}>
      <Parallax.Layer
        offset={0}
        speed={2}
        style={{ zIndex: 5 }}
      >
        <Box 
          direction="row"
          width="100%"
          alignContent="center"
          justify="center"
          margin={{ top: '30vh' }}
        >
          <img className="logo" src={logo} alt="Logo string" />
        </Box>
      </Parallax.Layer>
      <Parallax.Layer
        offset={0}
        speed={1.5}
        style={{ zIndex: 5 }}
      >
        <Box 
          direction="row" 
          width="100%" 
          height="6vh"
          alignContent="center" 
          justify="center"
          margin={{ top: '50vh' }}
        >
          <Button
            label="Downloads"
            margin={{ right: '5vw' }}
          />
          <Button
            label="Modules"
          />
        </Box>
      </Parallax.Layer>
      <Parallax.Layer
        offset={0}
        speed={1}
        style={{ zIndex: 1 }}
      >
        <img className="background" src={background} alt="Background" />
      </Parallax.Layer>

    </Parallax>
  );
};
