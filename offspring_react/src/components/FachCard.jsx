import React from 'react';
import Divider from '@mui/material/Divider';

const FachCard = ({ fach, durchschnitt, fachrichtung, onClick, cardColor }) => {
  return (
    <div className={`card m-4 w-96 ${cardColor} text-secondary-content`} onClick={onClick}>
      <div className="card-body">
        <h2 className="card-title break-words">{fach}</h2>
        <Divider />
        <p>{durchschnitt}</p>
        <div className="card-actions justify-end">
          <button className="btn">+</button>
        </div>
      </div>
    </div>
  );
}

export default FachCard;
