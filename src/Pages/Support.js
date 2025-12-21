import React from "react";  
import { useEffect } from "react";

function Support() {
  useEffect(() => {
    document.title = "Support | IPM Scoutek";
  }, []);           
  
  return (
    <div>
      <h1>Support Page</h1>
      <p>Get help and support here.</p>
    </div>
  );
}
export default Support;