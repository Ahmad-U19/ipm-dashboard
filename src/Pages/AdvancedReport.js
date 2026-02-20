import React, { useEffect, useState } from "react";
import ReportsPIC from "../Data/report.png";
import "./scoutingActivity.css";
import "./advancedReport.css";
// Reusing some styles from scoutingActivity.css if needed, or define in advancedReport.css

// Checkbox Component (reused or redefined)
const Checkbox = ({ label, checked, onChange, color = "#2dc55f" }) => (
  <label className="checkbox-option" style={{ fontSize: '13px' }}>
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ display: 'none' }}
      />
      <div className="checkbox-custom" style={{
        borderColor: checked ? color : '#d1d5db',
        backgroundColor: checked ? color : 'white',
        width: '16px', height: '16px', marginRight: '6px'
      }}>
        {checked && <span style={{ fontSize: '10px', color: 'white' }}>✓</span>}
      </div>
    </div>
    {label}
  </label>
);

export default function AdvancedReport() {
  useEffect(() => {
    document.title = "Advanced Report | IPM Scoutek";
  }, []);

  // State
  const [comparisonMode, setComparisonMode] = useState(false); // Default Off
  const [selectedGreenhouse, setSelectedGreenhouse] = useState(""); // Default empty "Select Greenhouse"
  const [fromWeek, setFromWeek] = useState("32 - Current");
  const [fromYear, setFromYear] = useState("2025");
  const [toWeek, setToWeek] = useState("32 - Current");
  const [toYear, setToYear] = useState("2025");

  // Checkboxes
  const [pressureFilters, setPressureFilters] = useState({
    Low: true, Medium: true, High: true
  });
  const [displayOptions, setDisplayOptions] = useState({
    ActionThresholds: true, Weather: true, Spray: true, Beneficial: true
  });

  const handlePressureChange = (key) => setPressureFilters(prev => ({ ...prev, [key]: !prev[key] }));
  const handleDisplayChange = (key) => setDisplayOptions(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="advanced-report-container">
      {/* Header */}
      <div className="report-header" style={{ marginBottom: '30px' }}>
        <img className="report-icon" src={ReportsPIC} alt="Report Icon" />
        <h2 className="report-title">Advanced Report</h2>
      </div>

      {/* Filters Section */}
      <div className="filters-container">
        {/* Top Row: Comparison Mode, Greenhouse, Weeks */}
        <div className="filters-row" style={{ alignItems: 'center' }}>

          <div className="filter-group">
            <label>Comparison Mode</label>
            <div className="toggle-wrapper">
              <span className={`toggle-label ${!comparisonMode ? 'active' : 'inactive'}`} style={{ color: !comparisonMode ? '#ef4444' : '#9ca3af' }}>Off</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={comparisonMode}
                  onChange={() => setComparisonMode(!comparisonMode)}
                />
                <span className="slider round"></span>
              </label>
              <span className={`toggle-label ${comparisonMode ? 'active' : 'inactive'}`}>On</span>
            </div>
          </div>

          <div className="filter-group" style={{ minWidth: '250px' }}>
            <label>Greenhouse</label>
            <select
              className="filter-select" style={{ width: '100%' }}
              value={selectedGreenhouse}
              onChange={(e) => setSelectedGreenhouse(e.target.value)}
            >
              <option value="">Select Greenhouse</option>
              <option value="GH1">Greenhouse 1</option>
              <option value="GH2">Greenhouse 2</option>
            </select>
          </div>

          <div className="filter-group">
            <label>From Week</label>
            <div className="week-range-selector">
              <select className="filter-select" value={fromWeek} onChange={(e) => setFromWeek(e.target.value)} style={{ width: '140px' }}>
                <option>32 - Current</option>
                <option>Week 31</option>
              </select>
              <select className="filter-select" value={fromYear} onChange={(e) => setFromYear(e.target.value)} style={{ width: '80px' }}>
                <option>2025</option>
                <option>2024</option>
              </select>
            </div>
          </div>

          <div className="filter-group">
            <label>To Week</label>
            <div className="week-range-selector">
              <select className="filter-select" value={toWeek} onChange={(e) => setToWeek(e.target.value)} style={{ width: '140px' }}>
                <option>32 - Current</option>
                <option>Week 31</option>
              </select>
              <select className="filter-select" value={toYear} onChange={(e) => setToYear(e.target.value)} style={{ width: '80px' }}>
                <option>2025</option>
                <option>2024</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Row: Pest Search, Pressure, Display, Apply */}
        <div className="filters-row" style={{ marginTop: '20px', alignItems: 'flex-end' }}>

          <div className="filter-group" style={{ flex: 1 }}>
            <label>Select Pest or Disease</label>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input type="text" className="search-input" placeholder="Select..." />
            </div>
          </div>

          <div className="filter-group">
            <label>Pressure</label>
            <div className="checkbox-group-wrapper" style={{ gap: '15px' }}>
              <Checkbox label="Low" checked={pressureFilters.Low} onChange={() => handlePressureChange('Low')} />
              <Checkbox label="Medium" checked={pressureFilters.Medium} onChange={() => handlePressureChange('Medium')} />
              <Checkbox label="High" checked={pressureFilters.High} onChange={() => handlePressureChange('High')} />
            </div>
          </div>

          <div className="filter-group" style={{ flex: 2 }}>
            <label>Display</label>
            <div className="checkbox-group-wrapper" style={{ gap: '15px' }}>
              <Checkbox label="Action Thresholds" checked={displayOptions.ActionThresholds} onChange={() => handleDisplayChange('ActionThresholds')} />
              <Checkbox label="Weather" checked={displayOptions.Weather} onChange={() => handleDisplayChange('Weather')} />
              <Checkbox label="Spray" checked={displayOptions.Spray} onChange={() => handleDisplayChange('Spray')} />
              <Checkbox label="Beneficial" checked={displayOptions.Beneficial} onChange={() => handleDisplayChange('Beneficial')} />
            </div>
          </div>

          <button className="apply-btn" style={{ marginLeft: 'auto' }}>
            APPLY
          </button>
        </div>
      </div>

      {/* Results Area */}
      <div className="empty-state-container">
        <div className="empty-state-card" style={{ width: 'auto', minWidth: '300px', boxShadow: 'none', background: 'transparent' }}>
          <div className="empty-illustration">
            <div style={{
              width: '300px',
              height: '200px',
              background: '#e5e7eb',
              margin: '0 auto',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              fontWeight: 'bold',
              fontSize: '18px'
            }}>
              Select Greenhouse
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
