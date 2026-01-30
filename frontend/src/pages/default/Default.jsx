import React from "react";
import { Outlet } from "react-router-dom";
import AppShell from "../../layout/AppShell/AppShell";

const Default = () => {
  return (
    <>
      <AppShell>
        <Outlet />
      </AppShell>
    </>
  )
}

export default Default