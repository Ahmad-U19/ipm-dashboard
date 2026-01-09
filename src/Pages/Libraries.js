import React, { useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import PlantLibrary from "./PlantLibrary";
import "./libraries.css";

export default function Libraries() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to plants page if on base /libraries route
    if (window.location.pathname === "/libraries" || window.location.pathname === "/libraries/") {
      navigate("/libraries/plants", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="libraries-container">
      <div className="libraries-sidebar">
        <nav className="libraries-nav">
          <NavLink
            to="/libraries/plants"
            className={({ isActive }) =>
              `library-nav-item ${isActive ? "active" : ""}`
            }
          >
            Plants
          </NavLink>
          <NavLink
            to="/libraries/pests"
            className={({ isActive }) =>
              `library-nav-item ${isActive ? "active" : ""}`
            }
          >
            Pests
          </NavLink>
          <NavLink
            to="/libraries/diseases"
            className={({ isActive }) =>
              `library-nav-item ${isActive ? "active" : ""}`
            }
          >
            Diseases
          </NavLink>
          <NavLink
            to="/libraries/other-observations"
            className={({ isActive }) =>
              `library-nav-item ${isActive ? "active" : ""}`
            }
          >
            Other Observations
          </NavLink>
          <NavLink
            to="/libraries/beneficials"
            className={({ isActive }) =>
              `library-nav-item ${isActive ? "active" : ""}`
            }
          >
            Beneficials
          </NavLink>
          <NavLink
            to="/libraries/sprays"
            className={({ isActive }) =>
              `library-nav-item ${isActive ? "active" : ""}`
            }
          >
            Sprays
          </NavLink>
        </nav>
      </div>
      <div className="libraries-content">
        <Routes>
          <Route path="plants" element={<PlantLibrary />} />
          <Route path="pests" element={<div className="coming-soon">Pests Library - Coming Soon</div>} />
          <Route
            path="diseases"
            element={<div className="coming-soon">Diseases Library - Coming Soon</div>}
          />
          <Route
            path="other-observations"
            element={<div className="coming-soon">Other Observations Library - Coming Soon</div>}
          />
          <Route
            path="beneficials"
            element={<div className="coming-soon">Beneficials Library - Coming Soon</div>}
          />
          <Route path="sprays" element={<div className="coming-soon">Sprays Library - Coming Soon</div>} />
          <Route path="" element={<PlantLibrary />} />
        </Routes>
      </div>
    </div>
  );
}
