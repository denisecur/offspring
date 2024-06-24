import React from 'react'
import Input from '../lib/own/Input'

const NeuesBerichtsheft = () => {
  return (
    <div>
      <menu>
        <li>
            <button>Abbrechen</button>
            <button>Speichern</button>
        </li>
      </menu>
      <div>
        <Input label="Title" />
        <Input label="Description" textarea/>
        <Input label="Due Date" />

      </div>
    </div>
  )
}

export default NeuesBerichtsheft
