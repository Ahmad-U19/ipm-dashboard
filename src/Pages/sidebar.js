import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./sidebar.css";
import ImgNww from "../Data/bag-removebg-preview.png"
import greenhousePIC from "../Data/greenhouse.png"
import imgSupport from "../Data/maintenance.png"
import assignmentPIC from "../Data/assignment.png"
import ReportsPIC from "../Data/report.png"
import USERPIC from "../Data/group.png"
import librarypic from "../Data/book.png"
import setting from "../Data/settings.png"
import logout from "../Data/turn-off.png"

export default function Sidebar({ isMobileOpen, onClose }) {
  const location = useLocation();
  const isLibrariesActive = location.pathname.startsWith('/libraries');
  const isReportsActive = location.pathname.startsWith('/reports');
  const [isReportsExpanded, setIsReportsExpanded] = useState(isReportsActive);

  useEffect(() => {
    setIsReportsExpanded(isReportsActive);
  }, [isReportsActive]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (onClose) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const toggleReports = () => {
    setIsReportsExpanded(!isReportsExpanded);
  };

  return (
    <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Mobile Close Button */}
      <button className="mobile-close-btn" onClick={onClose}>
        ×
      </button>

      <img src={ImgNww} alt="Logo" />

      <nav>
        <NavLink to="/greenhouses" className="nav-item">
          <img className="img-nav" src={greenhousePIC} alt="" />
          Greenhouses
        </NavLink>

        <div className="nav-item-with-dropdown">
          <div
            className={`nav-item ${isReportsActive ? 'active' : ''}`}
            onClick={toggleReports}
            style={{ cursor: 'pointer' }}
          >
            <img className="img-nav" src={ReportsPIC} alt="" />
            Reports
            <span className={`dropdown-arrow ${isReportsExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          {isReportsExpanded && (
            <div className="nav-dropdown">
              <NavLink
                to="/reports/pressure"
                className={({ isActive }) =>
                  `nav-dropdown-item ${isActive ? 'active' : ''}`
                }
              >
                Observation Status
              </NavLink>
              <NavLink
                to="/reports/scouting"
                className={({ isActive }) =>
                  `nav-dropdown-item ${isActive ? 'active' : ''}`
                }
              >
                Scouting Activity
              </NavLink>
              <NavLink
                to="/reports/advanced"
                className={({ isActive }) =>
                  `nav-dropdown-item ${isActive ? 'active' : ''}`
                }
              >
                Advanced Report
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/assignments" className="nav-item">
          <img className="img-nav" src={assignmentPIC} alt="" />
          Assignments
        </NavLink>

        <NavLink to="/user" className="nav-item">
          <img className="img-nav" src={USERPIC} alt="" />
          Users
        </NavLink>

        <NavLink
          to="/libraries/plants"
          className={`nav-item ${isLibrariesActive ? 'active' : ''}`}
        >
          <img className="img-nav" src={librarypic} alt="" />
          Libraries
        </NavLink>

        <NavLink to="/support" className="nav-item">
          <img className="img-nav" src={imgSupport} alt="" />
          Support
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/settings" className="nav-item">
          <img className="img-nav" src={setting} alt="" />
          Settings
        </NavLink>
        <NavLink to="/" className="nav-item">
          <img className="img-nav" src={logout} alt="" />
          Logout
        </NavLink>
      </div>

    </aside>
  );
}
