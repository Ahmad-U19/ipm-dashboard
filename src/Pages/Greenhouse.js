import React, { useEffect, useState, useMemo } from "react";
import greenhousePIC from "../Data/greenhouse.png";
import "./greenhouse.css";

// Sample greenhouse data
const SAMPLE_GREENHOUSES = [
  {
    id: 1,
    name: "North Tom Z4 - 2025",
    address: "1414 Seacliff Drive, Kingsville, ON, Canada",
    lastWeekScouted: 31,
    observations: 0,
    status: "active",
  },
  {
    id: 2,
    name: "North Tom Z3 - 2025",
    address: "1414 Seacliff Drive, Kingsville, ON, Canada",
    lastWeekScouted: 31,
    observations: 0,
    status: "active",
  },
  {
    id: 3,
    name: "North Tom Z2 - 2025",
    address: "1414 Seacliff Drive, Kingsville, ON, Canada",
    lastWeekScouted: 31,
    observations: 0,
    status: "active",
  },
  {
    id: 4,
    name: "North Tom Z1 - 2025",
    address: "1414 Seacliff Drive, Kingsville, ON, Canada",
    lastWeekScouted: 31,
    observations: 0,
    status: "active",
  },
];

export default function Greenhouse() {
  const [greenhouses, setGreenhouses] = useState(SAMPLE_GREENHOUSES);
  const [activeTab, setActiveTab] = useState("active");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-newest");
  const [currentWeek, setCurrentWeek] = useState(32);

  useEffect(() => {
    document.title = "Greenhouses | IPM Scoutek";
  }, []);

  // Filter greenhouses based on tab and search
  const filteredGreenhouses = useMemo(() => {
    let filtered = greenhouses.filter((gh) => {
      if (activeTab === "active") {
        return gh.status === "active";
      } else {
        return gh.status === "archived";
      }
    });

    // Filter by search
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      filtered = filtered.filter(
        (gh) =>
          gh.name.toLowerCase().includes(term) ||
          gh.address.toLowerCase().includes(term)
      );
    }

    // Sort greenhouses
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date-newest":
          return b.id - a.id; // Assuming higher ID = newer
        case "date-oldest":
          return a.id - b.id;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [greenhouses, activeTab, search, sortBy]);

  const activeCount = greenhouses.filter((gh) => gh.status === "active").length;
  const archivedCount = greenhouses.filter(
    (gh) => gh.status === "archived"
  ).length;

  const handleOpenAddModal = () => {
    // TODO: Implement add greenhouse modal
    console.log("Add greenhouse clicked");
  };

  const handleMenuClick = (e, greenhouseId) => {
    e.stopPropagation();
    // TODO: Implement context menu
    console.log("Menu clicked for greenhouse:", greenhouseId);
  };

  return (
    <div className="greenhouse-page">
      <div className="greenhouse-header">
        <div className="header-left">
          <div className="header-title-section">
            <img className="header-icon" src={greenhousePIC} alt="Greenhouses" />
            <div>
              <h2>Greenhouses</h2>
              <p className="week-subtitle">Week {currentWeek}</p>
            </div>
          </div>
        </div>
        <button
          className="primary-circle-btn"
          aria-label="Add greenhouse"
          onClick={handleOpenAddModal}
        >
          +
        </button>
      </div>

      <div className="greenhouse-controls">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            Active
            <span className="tab-badge">{activeCount}</span>
          </button>
          <button
            className={`tab ${activeTab === "archived" ? "active" : ""}`}
            onClick={() => setActiveTab("archived")}
          >
            Archived
            <span className="tab-badge">{archivedCount}</span>
          </button>
        </div>

        <div className="controls-right">
          <div className="sort-wrapper">
            <label htmlFor="sort-select">Sort By:</label>
            <select
              id="sort-select"
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-newest">Date Added (Newest - Oldest)</option>
              <option value="date-oldest">Date Added (Oldest - Newest)</option>
              <option value="name-asc">Name (A - Z)</option>
              <option value="name-desc">Name (Z - A)</option>
            </select>
          </div>

          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="greenhouse-grid">
        {filteredGreenhouses.length === 0 ? (
          <div className="empty-state">
            <p>No greenhouses found.</p>
          </div>
        ) : (
          filteredGreenhouses.map((greenhouse) => (
            <div key={greenhouse.id} className="greenhouse-card">
              <button
                className="card-menu-btn"
                onClick={(e) => handleMenuClick(e, greenhouse.id)}
                aria-label="Menu"
              >
                ⋮
              </button>
              <h3 className="card-title">{greenhouse.name}</h3>
              <p className="card-address">{greenhouse.address}</p>
              <div className="card-info">
                <p className="card-info-item">
                  Last Week Scouted: <span>{greenhouse.lastWeekScouted}</span>
                </p>
                <p className="card-info-item">
                  {greenhouse.observations === 0
                    ? "No observations recorded"
                    : `${greenhouse.observations} observation${
                        greenhouse.observations !== 1 ? "s" : ""
                      } recorded`}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

