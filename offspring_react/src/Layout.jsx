import React from 'react';
import { Outlet } from 'react-router-dom';
import DrawerAppBar from './components/Header/DrawerAppBar';

const Layout = () => {
  return (
    <div>
      <DrawerAppBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
