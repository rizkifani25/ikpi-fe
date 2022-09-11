import React from 'react';
import { Outlet } from 'react-router';
import TopBar from './components/TopBar';

const DefaultLayout = () => {
  return (
    <>
      <TopBar />
      <Outlet />
    </>
  );
};

export default DefaultLayout;
