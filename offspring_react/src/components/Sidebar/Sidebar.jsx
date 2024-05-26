import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out bg-gray-800 text-white`}>
      <button className="m-4 text-white" onClick={toggleSidebar}>
        {isOpen ? 'Close' : 'Menu'}
      </button>
      <nav className="p-4">
        <ul>
          <li><Link to="/" className="block py-2 px-4">Home</Link></li>
          <li><Link to="/ausbildung" className="block py-2 px-4">Ausbildung</Link></li>
          <li><Link to="/berichtshefte" className="block py-2 px-4">Berichtshefte</Link></li>
          <li><Link to="/noten" className="block py-2 px-4">Noten</Link></li>
          <li><Link to="/profil" className="block py-2 px-4">Profil</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
