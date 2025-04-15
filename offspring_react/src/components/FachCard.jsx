import React from 'react';
import Divider from '@mui/material/Divider';

// Wir gehen davon aus, dass der Prop "fach" ein Objekt ist, das neben dem Namen auch die Eigenschaft "isFachlichesFach" enthält.
const FachCard = ({ fach, durchschnitt, fachrichtung, onClick, cardColor, isFachlichesFach }) => {
  // Wenn isFachlichesFach false ist, heben wir den Eintrag hervor – hier mit einem grünen Rahmen.
  const highlightClasses = !isFachlichesFach ? "border-2 border-green-500" : "";

  return (
    <div
      className={`bg-accent card m-4 h-min w-full ${cardColor} text-base-content ${highlightClasses}`}
      onClick={onClick}
    >
      <div className="card-body">
        <h2 className="text-base font-light card-title break-words">{fach}</h2>
        <Divider />
        <p>{durchschnitt}</p>
        <div className="card-actions justify-end"></div>
      </div>
    </div>
  );
};

export default FachCard;
