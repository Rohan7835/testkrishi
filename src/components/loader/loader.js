import React, { useState, useEffect } from "react";
import loader from "../../images/loader.gif";

const Loader = () => {
  return (
    <div className="loader">
        <img src={loader}></img>
    </div>
  );
};
export default Loader;
