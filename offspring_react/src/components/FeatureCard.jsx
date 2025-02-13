import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const FeatureCard = ({ title, description, image, scale }) => {
  return (
    <Card className='flex flex-col items-center justify-between text-center rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105'>
      <div className="flex-shrink-0 h-48 w-full overflow-hidden flex justify-center items-center">
      <img
  src={image}
  alt={title}
  className={`object-contain h-full w-full transform scale-[${scale}]`}
/>

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