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

export default function Sidebar() {
  const location = useLocation();
  const isLibrariesActive = location.pathname.startsWith('/libraries');

  return (
    <aside className="sidebar">
      <img src={ImgNww} alt="Logo" />

      <nav>
        <NavLink to="/greenhouses" className="nav-item">
          <img className="img-nav" src={greenhousePIC} alt="" />
          Greenhouses
        </NavLink>

        <NavLink to="/reports" className="nav-item">
          <img className="img-nav" src={ReportsPIC} alt="" />
          Reports
        </NavLink>

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
