import React from 'react'
import Divider from '@mui/material/Divider';



const FachCard = ({fach, durchschnitt, fachrichtung}) => {
  return (

<div className="card w-96 bg-secondary text-secondary-content">
  <div className="card-body">
    <h2 className="card-title">{fach}</h2>
    <Divider/>
    <p>{durchschnitt}</p>
    <div className="card-actions justify-end">
      <button className="btn">+</button>
    </div>
  </div>
</div>
  )
}

export default FachCard
