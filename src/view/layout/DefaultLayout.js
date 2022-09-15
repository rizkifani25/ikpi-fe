import React from 'react';
import { Outlet } from 'react-router';

const DefaultLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default DefaultLayout;
