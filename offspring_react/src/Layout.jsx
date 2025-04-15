import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    // Mapping von Pfaden zu Titeln
    const pathTitleMap = {
      // Azubi View
      '/azubi-dashboard': 'Dashboard – OFFSPRING',
      '/noten': 'Noten – OFFSPRING',
      '/berichtshefte': 'Berichtshefte - OFFSPRING',
       // Chef-View
      '/chef-dashboard': 'Dashboard – OFFSPRING',
      '/profile': 'Profile – OFFSPRING',
      '/ranking': 'Ranking – OFFSPRING',
      // beide Views
      '/': 'Dashboard - OFFSPRING',
      '/login': 'Login – OFFSPRING',
      '/logout': 'Logout – OFFSPRING',
    };

    // Hole den aktuellen Pfad und setze den Dokumenttitel
    const currentPath = location.pathname;
    document.title = pathTitleMap[currentPath] || 'OFFSPRING';
  }, [location]);

  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
