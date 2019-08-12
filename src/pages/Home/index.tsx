export {};

// import React from 'react';
// import { Parallax, ParallaxLayer } from 'react-spring/renderprops-addons';
// import { Button, Box, ResponsiveContext } from 'grommet';
// import { computed, autorun } from 'mobx';
// import { observer } from 'mobx-react';
// import { logoLong, shader1, shader3, js, slate, javadocs } from '../../assets';
// import InfoCard from './InfoCard';
// import './index.scss';

// @observer
// export default class extends React.Component {
//   private landscape = false;

//   constructor(props: {}) {
//     super(props);
//   }

//   public render = () => (
//     <ResponsiveContext.Consumer>
//       {(size: string) => (
//         <Parallax pages={2}>
//           <ParallaxLayer offset={0} speed={0}>
//             <img className="background" src={shader1} alt="Background" />
//           </ParallaxLayer>
//           <ParallaxLayer offset={1} speed={0}>
//             <img className="background blur" src={shader3} alt="Background" />
//           </ParallaxLayer>

//           <ParallaxLayer offset={0} speed={1}>
//             <Box
//               direction="row"
//               width="100%"
//               alignContent="center"
//               justify="center"
//               className="logo"
//               margin={{ 
//                 top: size === 'small' && !this.landscape ? '60vh' : '30vh'
//               }}
//             >
//               {(() => {
//                 console.log(size);
//                 console.log(this.landscape);
//               })()}
//               <img className="logo-img" src={logoLong} alt="Logo string" style={{ backgroundSize: 'auto 100%' }} />
//             </Box>
//           </ParallaxLayer>
//           <ParallaxLayer
//             offset={0}
//             speed={0.5}
//           >
//             <Box
//               direction="row"
//               width="100%"
//               height="6vh"
//               alignContent="center"
//               justify="center"
//               margin={{ top: '50vh' }}
//             >
//               <Button
//                 label="Downloads"
//                 margin={{ right: '5vw' }}
//               />
//               <Button
//                 label="Modules"
//               />
//             </Box>
//           </ParallaxLayer>

//           <ParallaxLayer
//             offset={1}
//             speed={1}
//           >
//             <Box
//               width="100vw"
//               height="100vh"
//               justify="center"
//             >
//               <Box
//                 width="85vw"
//                 height="45vh"
//                 direction="row"
//                 alignSelf="center"
//               >
//                 <InfoCard 
//                   image={js}
//                   title="JavaScript"
//                   description="If you've never used JavaScript, or need some brushing up, this is the best place to do so."
//                 />
//                 <InfoCard 
//                   image={slate}
//                   title="Slate"
//                   description="Learn how to get started using ChatTriggers with the Slate tutorial."
//                 />
//                 <InfoCard 
//                   image={javadocs}
//                   title="Javadocs"
//                   description="Get a complete in-depth look at every method, object, and library provided by ChatTriggers."
//                 />
//               </Box>
//             </Box>
//           </ParallaxLayer>
//         </Parallax>
//       )}
//     </ResponsiveContext.Consumer>
//   )
// }
