import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import "./dashboardLayout.css";
import logo from "../Data/IPMScoutek-logo-white-480x97.webp";

export default function DashboardLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      {/* Mobile Header / Toggle */}
      <div className="mobile-header">
        <img src={logo} alt="IPM Logo" className="mobile-logo-img" />
        <button
          className="mobile-toggle-btn"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle Menu"
        >
          ☰
        </button>
      </div>

      <Sidebar
        isMobileOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
