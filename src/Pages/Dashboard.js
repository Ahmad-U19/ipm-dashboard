import React, { useEffect } from "react";

function Dashboard() {
  useEffect(() => {
    document.title = "Dashboard | IPM Scoutek";
  }, []);

  return (
    <div>
      <h1>Dashboard Page</h1>
      <p>Welcome to the dashboard</p>
    </div>
  );
}

export default Dashboard;
