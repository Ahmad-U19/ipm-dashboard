import React, { useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import ObservationStatusReport from "./ObservationStatusReport";
import ScoutingActivity from "./ScoutingActivity";
import AdvancedReport from "./AdvancedReport";
import "./reports.css";

export default function Reports() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to observation status page if on base /reports route
    if (window.location.pathname === "/reports" || window.location.pathname === "/reports/") {
      navigate("/reports/pressure", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="reports-container">
      <div className="reports-sidebar">
        <nav className="reports-nav">
          <NavLink
            to="/reports/pressure"
            className={({ isActive }) =>
              `report-nav-item ${isActive ? "active" : ""}`
            }
          >
            Observation Status
          </NavLink>
          <NavLink
            to="/reports/scouting"
            className={({ isActive }) =>
              `report-nav-item ${isActive ? "active" : ""}`
            }
          >
            Scouting Activity
          </NavLink>
          <NavLink
            to="/reports/advanced"
            className={({ isActive }) =>
              `report-nav-item ${isActive ? "active" : ""}`
            }
          >
            Advanced Report
          </NavLink>
        </nav>
      </div>
      <div className="reports-content">
        <Routes>
          <Route path="pressure" element={<ObservationStatusReport />} />
          <Route path="scouting" element={<ScoutingActivity />} />
          <Route path="advanced" element={<AdvancedReport />} />
          <Route path="" element={<ObservationStatusReport />} />
        </Routes>
      </div>
    </div>
  );
}
