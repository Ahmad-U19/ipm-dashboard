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
  // Helper to get ISO week number
  const getCurrentWeek = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return (
      1 +
      Math.round(
        ((date.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
        7
      )
    );
  };

  const [currentWeek] = useState(getCurrentWeek());

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGreenhouseData, setNewGreenhouseData] = useState({
    name: "",
    address: "",
  });

  // Menu State
  const [activeMenuId, setActiveMenuId] = useState(null);

  useEffect(() => {
    document.title = "Greenhouses | IPM Scoutek";

    // Close menu when clicking outside
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
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
          return b.id - a.id;
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

  // Handlers
  const handleOpenAddModal = () => {
    setNewGreenhouseData({ name: "", address: "" });
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddGreenhouse = () => {
    if (!newGreenhouseData.name || !newGreenhouseData.address) return;

    const newGreenhouse = {
      id: Date.now(), // Simple unique ID
      name: newGreenhouseData.name,
      address: newGreenhouseData.address,
      lastWeekScouted: 0,
      observations: 0,
      status: "active",
    };

    setGreenhouses([newGreenhouse, ...greenhouses]);
    handleCloseAddModal();
  };

  const handleMenuClick = (e, greenhouseId) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === greenhouseId ? null : greenhouseId);
  };

  const handleArchiveGreenhouse = (id) => {
    setGreenhouses(
      greenhouses.map((gh) =>
        gh.id === id ? { ...gh, status: "archived" } : gh
      )
    );
  };

  const handleUnarchiveGreenhouse = (id) => {
    setGreenhouses(
      greenhouses.map((gh) =>
        gh.id === id ? { ...gh, status: "active" } : gh
      )
    );
  };

  const handleDeleteGreenhouse = (id) => {
    setGreenhouses(greenhouses.filter((gh) => gh.id !== id));
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
              <div className="menu-container">
                <button
                  className="card-menu-btn"
                  onClick={(e) => handleMenuClick(e, greenhouse.id)}
                  aria-label="Menu"
                >
                  ⋮
                </button>
                {activeMenuId === greenhouse.id && (
                  <div className="dropdown-menu">
                    {greenhouse.status === "active" ? (
                      <button
                        className="dropdown-item"
                        onClick={() => handleArchiveGreenhouse(greenhouse.id)}
                      >
                        Archive
                      </button>
                    ) : (
                      <>
                        <button
                          className="dropdown-item"
                          onClick={() => handleUnarchiveGreenhouse(greenhouse.id)}
                        >
                          Unarchive
                        </button>
                        <button
                          className="dropdown-item delete"
                          onClick={() => handleDeleteGreenhouse(greenhouse.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <h3 className="card-title">{greenhouse.name}</h3>
              <p className="card-address">{greenhouse.address}</p>
              <div className="card-info">
                <p className="card-info-item">
                  Last Week Scouted: <span>{greenhouse.lastWeekScouted}</span>
                </p>
                <p className="card-info-item">
                  {greenhouse.observations === 0
                    ? "No observations recorded"
                    : `${greenhouse.observations} observation${greenhouse.observations !== 1 ? "s" : ""
                    } recorded`}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {isAddModalOpen && (
        <div className="modal-overlay" onClick={handleCloseAddModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Greenhouse</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                value={newGreenhouseData.name}
                onChange={(e) =>
                  setNewGreenhouseData({
                    ...newGreenhouseData,
                    name: e.target.value,
                  })
                }
                placeholder="e.g. North Tom Z5 - 2025"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                value={newGreenhouseData.address}
                onChange={(e) =>
                  setNewGreenhouseData({
                    ...newGreenhouseData,
                    address: e.target.value,
                  })
                }
                placeholder="e.g. 1414 Seacliff Drive..."
              />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={handleCloseAddModal}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddGreenhouse}>
                Add Greenhouse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
