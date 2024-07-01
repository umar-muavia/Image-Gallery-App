import React from "react";
import { NavLink } from "react-router-dom";

function UploadButton() {
  return (
    <>
      <NavLink to="/upload">
        <button className="btn btn-secondary">Upload Image</button>
      </NavLink>
    </>
  );
}

export default UploadButton;
