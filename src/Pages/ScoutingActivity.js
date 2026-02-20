import React, { useEffect, useState } from "react";
import ReportsPIC from "../Data/report.png";
import "./scoutingActivity.css";

// Checkbox Component for cleaner code
const Checkbox = ({ label, checked, onChange, color = "#2dc55f" }) => (
  <label className="checkbox-option">
    <div style={{ position: 'relative' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="checkbox-custom" style={{ borderColor: checked ? color : '#d1d5db', backgroundColor: checked ? color : 'white' }}>
        {checked && <span style={{ fontSize: '12px' }}>✓</span>}
      </div>
    </div>
    {label}
  </label>
);

export default function ScoutingActivity() {
  useEffect(() => {
    document.title = "Scouting Activity Report | IPM Scoutek";
  }, []);

  // State for filters
  const [fromDate, setFromDate] = useState("2025-08-03");
  const [toDate, setToDate] = useState("2025-08-09");
  const [selectedGreenhouse, setSelectedGreenhouse] = useState("All Active");
  const [selectedScout, setSelectedScout] = useState("All");
  const [pressureFilters, setPressureFilters] = useState({
    Low: true,
    Medium: true,
    High: true
  });
  const [libraryFilters, setLibraryFilters] = useState({
    Pests: true,
    Diseases: true,
    Other: true,
    Beneficials: true
  });
  const [reportType, setReportType] = useState("Both"); // e.g. "Both", "Summary", "Detailed"

  const handlePressureChange = (key) => setPressureFilters(prev => ({ ...prev, [key]: !prev[key] }));
  const handleLibraryChange = (key) => setLibraryFilters(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="scouting-report-container">
      {/* Header */}
      <div className="report-header">
        <img className="report-icon" src={ReportsPIC} alt="Report Icon" />
        <h2 className="report-title">Scouting Activity Report</h2>
      </div>

      <div className="report-info-text">
        <span className="report-info-icon">ℹ️</span>
        This report shows all actions taken by the selected Scouts in the selected Greenhouses in the date range of your choice.
      </div>

      {/* Filters Section */}
      <div className="filters-container">
        {/* Row 1: Date Range, Greenhouses, Scouts */}
        <div className="filters-row">
          <div className="filter-group">
            <label>From</label>
            <div className="filter-input-wrapper">
              <input
                type="date"
                className="filter-input"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
          </div>
          <div className="filter-group">
            <label>To</label>
            <div className="filter-input-wrapper">
              <input
                type="date"
                className="filter-input"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
          <div className="filter-group">
            <label>Greenhouses</label>
            <select
              className="filter-select wide"
              value={selectedGreenhouse}
              onChange={(e) => setSelectedGreenhouse(e.target.value)}
            >
              <option>All Active</option>
              <option>Greenhouse A</option>
              <option>Greenhouse B</option>
            </select>
          </div>
          <div className="filter-group" style={{ flex: 1 }}>
            <label>Scouts</label>
            <select
              className="filter-select wide"
              style={{ width: '100%' }}
              value={selectedScout}
              onChange={(e) => setSelectedScout(e.target.value)}
            >
              <option>All</option>
              <option>Scout 1</option>
              <option>Scout 2</option>
            </select>
          </div>
        </div>

        {/* Row 2: Checkboxes and Apply Button */}
        <div className="filters-row" style={{ alignItems: 'flex-start' }}>
          <div className="filter-group">
            <label>Pressure</label>
            <div className="checkbox-group-wrapper">
              <Checkbox label="Low" checked={pressureFilters.Low} onChange={() => handlePressureChange('Low')} />
              <Checkbox label="Medium" checked={pressureFilters.Medium} onChange={() => handlePressureChange('Medium')} />
              <Checkbox label="High" checked={pressureFilters.High} onChange={() => handlePressureChange('High')} />
            </div>
          </div>

          <div className="filter-group" style={{ marginLeft: '20px' }}>
            <label>Libraries</label>
            <div className="checkbox-group-wrapper">
              <Checkbox label="Pests" checked={libraryFilters.Pests} onChange={() => handleLibraryChange('Pests')} />
              <Checkbox label="Diseases" checked={libraryFilters.Diseases} onChange={() => handleLibraryChange('Diseases')} />
              <Checkbox label="Other" checked={libraryFilters.Other} onChange={() => handleLibraryChange('Other')} />
              <Checkbox label="Beneficials" checked={libraryFilters.Beneficials} onChange={() => handleLibraryChange('Beneficials')} />
            </div>
          </div>

          <div className="filter-group" style={{ marginLeft: '20px' }}>
            <label>Type</label>
            <select
              className="filter-select"
              style={{ minWidth: "120px" }}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option>Both</option>
              <option>Summary</option>
              <option>Detailed</option>
            </select>
          </div>

          <button className="apply-btn" style={{ marginTop: 'auto', marginLeft: 'auto', height: '40px' }}>
            APPLY
          </button>
        </div>
      </div>

      {/* Results Area */}
      <div className="empty-state-container">
        <div className="empty-state-card" style={{ width: 'auto', minWidth: '300px', boxShadow: 'none', background: 'transparent' }}>
          <div className="empty-illustration">
            {/* Simple placeholder illustration or graphic */}
            <div style={{
              width: '200px',
              height: '150px',
              background: '#e5e7eb',
              margin: '0 auto',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
              fontSize: '24px'
            }}>
              No Results
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
