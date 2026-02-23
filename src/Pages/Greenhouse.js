import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import greenhousePIC from "../Data/greenhouse.png";
import { supabase } from "../DataBase/supabaseClient";
import "./greenhouse.css";

import { SAMPLE_GREENHOUSES } from "../Data/greenhouseData";

export default function Greenhouse() {
  const navigate = useNavigate();
  const [greenhouses, setGreenhouses] = useState([]);
  const [loading, setLoading] = useState(true);
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
    // Initialize with sample data, then fetch from Supabase
    setGreenhouses(SAMPLE_GREENHOUSES);
    fetchGreenhouses();

    // Close menu when clicking outside
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchGreenhouses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("greenhouses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase fetch failed, sticking with samples:", error.message);
      } else if (data && data.length > 0) {
        // Create a map of DB data for quick lookup
        const dbMap = new Map(data.map(gh => [gh.id, gh]));

        // Merge: Use DB data if available, otherwise use sample data
        const merged = SAMPLE_GREENHOUSES.map(sample => dbMap.get(sample.id) || sample);

        // Also include any greenhouses that are in DB but NOT in samples (newly created ones)
        const sampleIds = new Set(SAMPLE_GREENHOUSES.map(s => s.id));
        const extraDb = data.filter(gh => !sampleIds.has(gh.id));

        setGreenhouses([...merged, ...extraDb]);
      }
    } catch (err) {
      console.error("Fetch exception:", err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddGreenhouse = async () => {
    if (!newGreenhouseData.name || !newGreenhouseData.address) return;

    const newGreenhouse = {
      name: newGreenhouseData.name,
      address: newGreenhouseData.address,
      lastWeekScouted: 0,
      observations: 0,
      status: "active",
      total_rows: 45, // default
    };

    try {
      const { data, error } = await supabase
        .from("greenhouses")
        .insert([newGreenhouse])
        .select();

      if (error) throw error;

      if (data) {
        setGreenhouses([data[0], ...greenhouses]);
      }
      handleCloseAddModal();
    } catch (err) {
      alert("Error adding greenhouse: " + err.message);
      // Fallback update local state if DB fails (not ideal but for dev)
      setGreenhouses([{ ...newGreenhouse, id: Date.now() }, ...greenhouses]);
      handleCloseAddModal();
    }
  };

  const handleMenuClick = (e, greenhouseId) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === greenhouseId ? null : greenhouseId);
  };

  const handleCloneGreenhouse = async (greenhouse) => {
    const clonedGreenhouse = {
      name: `${greenhouse.name} (Clone)`,
      address: greenhouse.address,
      lastWeekScouted: 0,
      observations: 0,
      status: "active",
      total_rows: greenhouse.total_rows || 45,
    };

    try {
      const { data, error } = await supabase
        .from("greenhouses")
        .insert([clonedGreenhouse])
        .select();

      if (error) throw error;
      if (data) {
        setGreenhouses([data[0], ...greenhouses]);
      }
    } catch (err) {
      alert("Error cloning greenhouse: " + err.message);
    }
    setActiveMenuId(null);
  };

  const handleArchiveGreenhouse = async (id) => {
    const greenhouse = greenhouses.find(gh => gh.id === id);
    if (!greenhouse) return;

    try {
      const updatedGreenhouse = { ...greenhouse, status: "archived" };
      // Using upsert ensures that if it's a sample ID not in DB, it gets created.
      // If it is in DB, it gets updated.
      const { error } = await supabase
        .from("greenhouses")
        .upsert(updatedGreenhouse, { onConflict: 'id' });

      if (error) throw error;

      setGreenhouses(
        greenhouses.map((gh) =>
          gh.id === id ? { ...gh, status: "archived" } : gh
        )
      );
    } catch (err) {
      alert("Error archiving greenhouse: " + err.message);
    }
    setActiveMenuId(null);
  };

  const handleUnarchiveGreenhouse = async (id) => {
    const greenhouse = greenhouses.find(gh => gh.id === id);
    if (!greenhouse) return;

    try {
      const updatedGreenhouse = { ...greenhouse, status: "active" };
      const { error } = await supabase
        .from("greenhouses")
        .upsert(updatedGreenhouse, { onConflict: 'id' });

      if (error) throw error;

      setGreenhouses(
        greenhouses.map((gh) =>
          gh.id === id ? { ...gh, status: "active" } : gh
        )
      );
    } catch (err) {
      alert("Error unarchiving greenhouse: " + err.message);
    }
    setActiveMenuId(null);
  };

  const handleDeleteGreenhouse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this greenhouse?")) return;

    try {
      const { error } = await supabase
        .from("greenhouses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setGreenhouses(greenhouses.filter((gh) => gh.id !== id));
    } catch (err) {
      alert("Error deleting greenhouse: " + err.message);
    }
    setActiveMenuId(null);
  };


  return (
    <div className="greenhouse-page">
      <div className="greenhouse-header-1">
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
                  <div className="dropdown-menu-2">
                    {greenhouse.status === "active" ? (
                      <>
                        <button
                          className="dropdown-item"
                          onClick={() => handleCloneGreenhouse(greenhouse)}
                        >
                          Clone greenhouse
                        </button>
                        <button
                          className="dropdown-item"
                          onClick={() => handleArchiveGreenhouse(greenhouse.id)}
                        >
                          Archive greenhouse
                        </button>
                        <button
                          className="dropdown-item"
                          onClick={() => navigate(`/greenhouses/${greenhouse.id}/applications`)}
                        >
                          Applications
                        </button>
                        <button
                          className="dropdown-item"
                          onClick={() => navigate(`/greenhouses/${greenhouse.id}/settings`)}
                        >
                          Settings
                        </button>
                      </>
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
