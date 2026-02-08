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
import settingPic from "../Data/settings.png"
import logout from "../Data/turn-off.png"

export default function Sidebar({ isMobileOpen, onClose }) {
  const location = useLocation();
  const isLibrariesActive = location.pathname.startsWith('/libraries');
  const isReportsActive = location.pathname.startsWith('/reports');
  const isSettingsActive = location.pathname.startsWith('/settings') || location.pathname.startsWith('/business-settings');
  const [isReportsExpanded, setIsReportsExpanded] = useState(isReportsActive);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(isSettingsActive);

  useEffect(() => {
    setIsReportsExpanded(isReportsActive);
  }, [isReportsActive]);

  useEffect(() => {
    setIsSettingsExpanded(isSettingsActive);
  }, [isSettingsActive]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (onClose) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const toggleReports = () => {
    setIsReportsExpanded(!isReportsExpanded);
  };

  const toggleSettings = () => {
    setIsSettingsExpanded(!isSettingsExpanded);
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
          <h4>Greenhouses</h4>
        </NavLink>

        <div className="nav-item-with-dropdown">
          <div
            className={`nav-item ${isReportsActive ? 'active' : ''}`}
            onClick={toggleReports}
            style={{ cursor: 'pointer' }}
          >
            <img className="img-nav" src={ReportsPIC} alt="" />
            <h4>Reports</h4>
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
                <h4>Observation Status</h4>
              </NavLink>
              <NavLink
                to="/reports/scouting"
                className={({ isActive }) =>
                  `nav-dropdown-item ${isActive ? 'active' : ''}`
                }
              >
                <h4>Scouting Activity</h4>
              </NavLink>
              <NavLink
                to="/reports/advanced"
                className={({ isActive }) =>
                  `nav-dropdown-item ${isActive ? 'active' : ''}`
                }
              >
                <h4>Advanced Report</h4>
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/assignments" className="nav-item">
          <img className="img-nav" src={assignmentPIC} alt="" />
          <h4>Assignments</h4>
        </NavLink>

        <NavLink to="/user" className="nav-item">
          <img className="img-nav" src={USERPIC} alt="" />
          <h4>Users</h4>
        </NavLink>

        <NavLink
          to="/libraries/plants"
          className={`nav-item ${isLibrariesActive ? 'active' : ''}`}
        >
          <img className="img-nav" src={librarypic} alt="" />
          <h4>Libraries</h4>
        </NavLink>

        <NavLink to="/support" className="nav-item">
          <img className="img-nav" src={imgSupport} alt="" />
          <h4>Support</h4>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="nav-item-with-dropdown">
          <div
            className={`nav-item ${isSettingsActive ? 'active' : ''}`}
            onClick={toggleSettings}
            style={{ cursor: 'pointer' }}
          >
            <img className="img-nav" src={settingPic} alt="" />
            <h4>Settings</h4>
            <span className={`dropdown-arrow ${isSettingsExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          {isSettingsExpanded && (
            <div className="nav-dropdown">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `nav-dropdown-item ${isActive ? 'active' : ''}`
                }
              >
                <h4>Business Profile</h4>
              </NavLink>
              <NavLink
                to="/business-settings"
                className={({ isActive }) =>
                  `nav-dropdown-item ${isActive ? 'active' : ''}`
                }
              >
                <h4>Business Settings</h4>
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/" className="nav-item">
          <img className="img-nav" src={logout} alt="" />
            <h4>Logout</h4>
        </NavLink>
      </div>

    </aside>
  );
}
