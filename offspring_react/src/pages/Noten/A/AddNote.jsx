import React from 'react';
import { Button } from '@mui/material';
import AddNoteForm from './AddNoteForm';

const onClickedAdd = () => {
  // Add your logic here
  console.log("Circle icon clicked");
};

/**
 * Note hinufügen "+" soll bei Klick auslösen, dass (links fächerspalte rechts durchschnitt) die fächerspalte ersetzt wird durch die komponente fürs add note form.
 * 
 * ABER
 * 
 *  1. "+"
 * 2. Fach aus Fachspalte anklicken - interaktiv, indem die Fächer in den Spalten nun farbige Rähmen bekommen und ein Roter Hinweistext darüber erscheint "Bitte Fach wählen"
 * 3. Fachspalten-komponente wird ersetzt durch AddNoteForm
 * @returns Note 
 */
const AddNote = () => {
  return (
    <div>
      <div className="flex flex-col min-h-screen full-w justify-center gap-9 bg-white px-9">
      {/* Basic Button */}
      <div className="flex justify-center items-center flex-col gap-3">
        <h2 className="text-2xl font-bold">Basic Button</h2>
        <div className="flex gap-2">
          <button className="btn btn-neutral">Neutral</button>
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-secondary">Secondary</button>
          <button className="btn btn-accent">Accent</button>
        </div>
      </div>

      {/* Sizes Button */}
      <div className="flex items-center flex-col gap-3">
        <h2 className="text-2xl font-bold">Sizes Button</h2>
        <div className="flex items-center flex-col sm:flex-row justify-center gap-3">
          <button className="btn btn-lg">Large</button>
          <button className="btn">Normal</button>
          <button className="btn btn-sm">Small</button>
          <button className="btn btn-xs">Tiny</button>
        </div>
      </div>
      {/* Button with loading spinner and text */}
      <div className="flex items-center flex-col gap-3">
        <h2 className="text-2xl font-bold">
          Button with loading spinner and text
        </h2>
        <div className="flex items-center flex-col sm:flex-row justify-center gap-3">
          <button className="btn">
            <span className="loading loading-spinner"></span>
            loading
          </button>
        </div>
      </div>

      {/* Outline Button */}
      <div className="flex justify-center items-center flex-col gap-3">
        <h2 className="text-2xl font-bold">Outline Button</h2>
        <div className="flex gap-2">
          <button className="btn btn-outline">Default</button>
          <button className="btn btn-outline btn-primary">Primary</button>
          <button className="btn btn-outline btn-secondary">Secondary</button>
          <button className="btn btn-outline btn-accent">Accent</button>
        </div>
      </div>

      {/* Block Button */}
      <div className="flex items-center w-full flex-col gap-3">
        <h2 className="text-2xl font-bold">Block Button</h2>
        <button className="btn btn-block">block</button>
      </div>
    </div>
      <div className="flex flex-col min-h-screen justify-center gap-9 bg-white px-9">
      <div className="flex justify-center items-center flex-col gap-3">
        <h2 className="text-2xl font-bold">Basic Input</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered input-primary w-full max-w-xs"
          />
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered input-warning w-full max-w-xs"
          />
        </div>
      </div>

      <div className="flex items-center flex-col gap-3">
        <h2 className="text-2xl font-bold">File Input</h2>
        <input
          type="file"
          className="file-input file-input-bordered file-input-primary w-full max-w-xs"
        />
      </div>
      {/* Button with loading spinner and text */}
      <div className="flex items-center flex-col gap-3">
        <h2 className="text-2xl font-bold">Select</h2>
        <select className="select select-primary w-full max-w-xs">
          <option disabled selected>
            What is the best TV show?
          </option>
          <option>Game of Thrones</option>
          <option>Lost</option>
          <option>Breaking Bad</option>
          <option>Walking Dead</option>
        </select>
      </div>
      {/* Outline Button */}
      <div className="flex justify-center items-center flex-col gap-3">
        <h2 className="text-2xl font-bold">Checkbox</h2>
        <div className="flex gap-2">
          <div className="form-control">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary mr-1"
              />
              <span className="label-text">React Js</span>
            </label>
          </div>
          <div className="form-control">
            <label className="cursor-pointer label">
              <input
                type="checkbox"
                className="checkbox checkbox-secondary mr-1"
              />
              <span className="label-text">Next Js</span>
            </label>
          </div>
        </div>
      </div>
    </div>
        <AddNoteForm/>
      <Button variant="outlined" onClick={onClickedAdd}>+</Button>
    </div>
  );
}

export default AddNote;
