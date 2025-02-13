import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const FeatureCard = ({ title, description, image, scale }) => {
  return (
    <Card className='flex flex-col items-center justify-between text-center rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105'>
      <div className="flex-shrink-0 h-48 w-full overflow-hidden flex justify-center items-center">
        <img src={image} alt={title} className="object-contain h-full w-full transform" 
          style={{ transform: `scale(${scale})` }}  />
      </div>
      <CardContent className="flex flex-col items-center text-center mt-4 flex-grow">
        <Typography variant="h7" component="div" className="text-xl font-bold">
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary" className="mt-2">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
//* import React from "react";
// /* import { Card, CardContent, Typography } from "@mui/material";
// import { useTheme } from "@mui/material/styles";

// const FeatureCard = ({ title, description, image, scale }) => {
//   const theme = useTheme();

//   return (
//     <Card
//       className="flex flex-col items-center justify-between text-center rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:scale-105"
//       style={{
//         backgroundColor: theme.palette.background.paper,
//         borderColor: theme.palette.primary.main,
//         boxShadow: `0 0 10px ${theme.palette.accent}`,
//         borderWidth: "2px",
//       }}
//     >
//       {/* Feature Image */}
//       <div className="h-32 w-32 flex items-center justify-center">
//         <img
//           src={image}
//           alt={title}
//           className="object-contain"
//           style={{ transform: `scale(${scale})` }}
//         />
//       </div>

//       {/* Feature Content */}
//       <CardContent className="mt-4">
//         <Typography
//           variant="h5"
//           className="text-lg font-bold"
//           style={{ color: theme.palette.primary.main }}
//         >
//           {title}
//         </Typography>
//         <Typography
//           variant="body2"
//           className="mt-2"
//           style={{ color: theme.palette.secondary }}
//         >
//           {description}
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// };

// export default FeatureCard;
