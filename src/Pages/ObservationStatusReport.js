import React, { useState, useEffect } from "react";
import ReportsPIC from "../Data/report.png";
import "./observationStatusReport.css";

export default function ObservationStatusReport() {
  const [selectedWeek, setSelectedWeek] = useState(32);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState("North Tom Z3 - 2025");
  const [pressureFilters, setPressureFilters] = useState({
    low: true,
    medium: true,
    high: true,
  });
  const [libraryFilters, setLibraryFilters] = useState({
    pests: false,
    diseases: false,
    other: false,
    beneficials: false,
  });
  const [typeFilter, setTypeFilter] = useState("Both");

  const greenhouses = [
    "North Tom Z1 - 2025",
    "North Tom Z2 - 2025",
    "North Tom Z3 - 2025",
    "North Tom Z4 - 2025",
  ];

  useEffect(() => {
    document.title = "Observation Status Report | IPM Scoutek";
  }, []);

  const handleWeekChange = (direction) => {
    if (direction === "prev") {
      if (selectedWeek > 1) {
        setSelectedWeek(selectedWeek - 1);
      } else {
        setSelectedWeek(52);
        setSelectedYear(selectedYear - 1);
      }
    } else {
      if (selectedWeek < 52) {
        setSelectedWeek(selectedWeek + 1);
      } else {
        setSelectedWeek(1);
        setSelectedYear(selectedYear + 1);
      }
    }
  };

  const handlePressureChange = (pressure) => {
    setPressureFilters((prev) => ({
      ...prev,
      [pressure]: !prev[pressure],
    }));
  };

  const handleLibraryChange = (library) => {
    setLibraryFilters((prev) => ({
      ...prev,
      [library]: !prev[library],
    }));
  };


  return (
    <div className="observation-status-report">
      <div className="report-header">
        <div className="report-header-left">
          <img className="report-header-icon" src={ReportsPIC} alt="Report" />
          <div>
            <h2 className="report-title">Observation Status Report</h2>
          </div>
        </div>
      </div>

      <p className="report-description">
        This report shows unresolved pressures as of the selected Week and Greenhouse, including those made in previous weeks.
      </p>

      <div className="report-filters">
        <div className="filter-section">
          <label className="filter-label">Week</label>
          <div className="week-selector">
            <button
              type="button"
              className="week-nav-btn"
              onClick={() => handleWeekChange("prev")}
              aria-label="Previous week"
            >
              ←
            </button>
            <select
              className="week-dropdown"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
            >
              {Array.from({ length: 52 }, (_, i) => i + 1).map((week) => {
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const startOfYear = new Date(currentYear, 0, 1);
                const days = Math.floor((currentDate - startOfYear) / (24 * 60 * 60 * 1000));
                const currentWeek = Math.ceil((days + startOfYear.getDay() + 1) / 7);
                const isCurrentWeek = week === currentWeek && selectedYear === currentYear;
                return (
                  <option key={week} value={week}>
                    {isCurrentWeek ? `${week} - Current` : week.toString()}
                  </option>
                );
              })}
            </select>
            <select
              className="year-dropdown"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => 2020 + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="week-nav-btn"
              onClick={() => handleWeekChange("next")}
              aria-label="Next week"
            >
              →
            </button>
          </div>
        </div>

        <div className="filter-section">
          <label className="filter-label">Greenhouse</label>
          <select
            className="filter-dropdown"
            value={selectedGreenhouse}
            onChange={(e) => setSelectedGreenhouse(e.target.value)}
          >
            {greenhouses.map((gh) => (
              <option key={gh} value={gh}>
                {gh}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-section">
          <label className="filter-label">Pressure</label>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={pressureFilters.low}
                onChange={() => handlePressureChange("low")}
              />
              <span>Low</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={pressureFilters.medium}
                onChange={() => handlePressureChange("medium")}
              />
              <span>Medium</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={pressureFilters.high}
                onChange={() => handlePressureChange("high")}
              />
              <span>High</span>
            </label>
          </div>
        </div>

        <div className="filter-section">
          <label className="filter-label">Libraries</label>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={libraryFilters.pests}
                onChange={() => handleLibraryChange("pests")}
              />
              <span>Pests</span>
              <span className="dropdown-arrow">▼</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={libraryFilters.diseases}
                onChange={() => handleLibraryChange("diseases")}
              />
              <span>Diseases</span>
              <span className="dropdown-arrow">▼</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={libraryFilters.other}
                onChange={() => handleLibraryChange("other")}
              />
              <span>Other</span>
              <span className="dropdown-arrow">▼</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={libraryFilters.beneficials}
                onChange={() => handleLibraryChange("beneficials")}
              />
              <span>Beneficials</span>
              <span className="dropdown-arrow">▼</span>
            </label>
          </div>
        </div>

        <div className="filter-section">
          <label className="filter-label">Type</label>
          <select
            className="filter-dropdown"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="Both">Both</option>
            <option value="Observed">Observed</option>
            <option value="Unresolved">Unresolved</option>
          </select>
        </div>
      </div>

      <div className="report-results">
        <div className="no-results-container">
          <div className="no-results-illustration">🔍</div>
          <div className="no-results-box">
            <p className="no-results-text">No Results</p>
          </div>
        </div>
      </div>
    </div>
  );
}

