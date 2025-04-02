import React from "react";
import { Outlet } from "react-router-dom";
import "../styles/Content.css"
const Content2 = () => {
  return (
    <div className="content2">
      <Outlet />
    </div>
  );
};

export default Content2;