export { };

// import React from 'react';
// import { animated, useSpring } from 'react-spring';
// import { Box, Heading, Text } from 'grommet'; 

// interface IInfoCardProps {
//   image: string;
//   title: string;
//   description: string;
// }

// export default (props: IInfoCardProps) => {
//   const AnimatedBox = animated(Box);
//   const [animatedProps, set] = useSpring(() => ({ 
//     scale: 1,
//     config: {
//       mass: 1,
//       tension: 300,
//       friction: 34  
//     }
//    }));

//   const mouseEnter = () => { set({ scale: 1.1 }); };
//   const mouseLeave = () => { set({ scale: 1 }); };
//   const trans = (scale: string | number | undefined) => `scale(${scale})`;

//   return (
//     <AnimatedBox
//       onMouseEnter={mouseEnter}
//       onMouseLeave={mouseLeave}
//       style={{ transform: animatedProps.scale.interpolate(trans) }}
//       background={{ 
//         color: 'light-3',
//         opacity: 0.8
//       }}
//       alignContent="center"
//       justify="center"
//       alignSelf="center"
//       width="33%"
//       height="100%"
//       margin="20px"
//       pad="20px"
//       responsive
//       round="small"
//       elevation="small"
//       border={{
//         color: 'brand',
//         size: 'medium'
//       }}
//     >
//       <Box
//         alignContent="center"
//         justify="center"
//         alignSelf="center"
//       >
//         <img src={props.image} alt="javascript" style={{ height: 150, width: 150 }} />
//       </Box>
//       <Heading level={3} alignSelf="center">
//         {props.title}
//       </Heading>
//       <Text textAlign="center" margin={{ top: '-5%' }} style={{ fontSize: 16 }}>
//         {props.description}
//       </Text>
//     </AnimatedBox>
//   );
// };
