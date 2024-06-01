import React from 'react';
import Divider from '@mui/material/Divider';

const FachCard = ({ fach, durchschnitt, fachrichtung, onClick, cardColor }) => {
  return (
    <div className={`bg-accent card m-4 h-min w-full ${cardColor} text-base-content`} onClick={onClick}>
      <div className="card-body color-">
        <h2 className="text-base font-light card-title break-words">{fach}</h2>
        <Divider />
        <p>{durchschnitt}</p>
        <div className="card-actions justify-end">
        </div>
      </div>
    </div>
  );
}

export default FachCard;
