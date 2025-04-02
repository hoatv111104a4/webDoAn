import React from "react";
import "../styles/Content.css";
import { Outlet } from "react-router-dom";
const Content = () => {
  return (
    <article className="content">
      <Outlet />
    </article>
  );
};

export default Content;