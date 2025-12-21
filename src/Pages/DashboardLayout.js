import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import "./dashboardLayout.css";

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
