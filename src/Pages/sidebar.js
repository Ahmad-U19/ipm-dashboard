import { NavLink } from "react-router-dom";
import "./sidebar.css";
import ImgNww from "../Data/bag-removebg-preview.png"
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <img src={ImgNww} alt="Logo" />

      <nav>
        <NavLink to="/dashboard">Greenhouses</NavLink>
        <NavLink to="/reports">Reports</NavLink>
        <NavLink to="/assignments">Assignments</NavLink>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/libraries">Libraries</NavLink>
        <NavLink to="/support">Support</NavLink>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/settings" className="nav-item">Settings</NavLink>
        <NavLink to="/login">Logout</NavLink>
      </div>

    </aside>
  );
}
