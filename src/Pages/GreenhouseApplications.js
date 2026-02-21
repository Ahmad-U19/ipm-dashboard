import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SAMPLE_GREENHOUSES } from "../Data/greenhouseData";
import { SAMPLE_PESTS } from "./PestLibrary";
import { SAMPLE_DISEASES } from "./DiseaseLibrary";
import { SAMPLE_PLANTS } from "./PlantLibrary";
import { SAMPLE_BENEFICIALS } from "./BeneficialLibrary";
import { SAMPLE_SPRAYS } from "./SprayLibrary";
import greenhousePIC from "../Data/greenhouse.png";
import "./greenhouse.css";

const SAMPLE_APPLICATIONS = [
    {
        id: 1,
        name: "Application 1",
        pests: ["Aphids"],
        diseases: [],
        plants: ["Beefsteak"],
        sprays: ["Abode essential oil"],
        beneficials: [],
        rate: "10 ml/L",
        cost: "$12.50",
        date: "2025-07-30",
    },
    {
        id: 2,
        name: "Application 2",
        pests: ["Ants", "Armyworm"],
        diseases: ["Bacteria"],
        plants: ["Tomato"],
        sprays: ["Acari Out 70 EC"],
        beneficials: ["Andersoni"],
        rate: "5 ml/L",
        cost: "$8.00",
        date: "2025-07-28",
    },
    {
        id: 3,
        name: "Application 3",
        pests: [],
        diseases: ["Bacterial Wilt"],
        plants: ["Cucumber"],
        sprays: ["Acrobat"],
        beneficials: [],
        rate: "15 ml/L",
        cost: "$22.00",
        date: "2025-07-25",
    },
    {
        id: 4,
        name: "Application 4",
        pests: ["Whitefly"],
        diseases: [],
        plants: ["Pepper"],
        sprays: ["Actara"],
        beneficials: [],
        rate: "8 ml/L",
        cost: "$15.00",
        date: "2025-07-20",
    },
    {
        id: 5,
        name: "Application 5",
        pests: [],
        diseases: ["Powdery Mildew"],
        plants: ["Strawberry"],
        sprays: ["Pristine"],
        beneficials: [],
        rate: "12 ml/L",
        cost: "$18.00",
        date: "2025-07-15",
    }
];

// Sample Data for Notes
const SAMPLE_NOTES = [
    { id: 1, scout: "John Doe", pressure: "Low", observation: "Aphids found on lower leaves", type: "Pest", location: "Row 5", date: "2025-07-31", content: "Monitor closely next week." },
    { id: 2, scout: "Jane Smith", pressure: "Medium", observation: "Powdery Mildew spots", type: "Disease", location: "Row 12", date: "2025-07-30", content: "Applied fungicide in affected area." },
    { id: 3, scout: "Mike Johnson", pressure: "-", observation: "Sticky trap replaced", type: "General", location: "Row 1", date: "2025-07-29", content: "Routine maintenance." },
];

// Sample Data for Other Observations
const SAMPLE_OTHER_OBSERVATIONS = [
    { id: 1, scout: "John Doe", count: 15, observation: "Broken irrigation line", location: "Row 3", date: "2025-07-31", notes: "Maintenance team notified." },
    { id: 2, scout: "Jane Smith", count: 5, observation: "Beneficials active", location: "Row 8", date: "2025-07-28", notes: "Good population of ladybugs." },
];

const FilterBar = ({ children, rightActions, className }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`filters-bar ${className || ""}`}>
            <div
                className="filter-group"
                onClick={() => setIsOpen(!isOpen)}
                style={{ cursor: "pointer", minWidth: "60px" }}
            >
                <span className="filter-label">Filters {isOpen ? "▲" : "▼"}</span>
            </div>
            {isOpen && children}
            {rightActions && <div style={{ marginLeft: "auto" }}>{rightActions}</div>}
        </div>
    );
};

const FilterDropdown = ({ label, options, selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleSelection = (option) => {
        const newSelected = selected.includes(option)
            ? selected.filter((item) => item !== option)
            : [...selected, option];
        onChange(newSelected);
    };

    return (
        <div className="filter-group" ref={dropdownRef}>
            <span className="filter-label" onClick={() => setIsOpen(!isOpen)}>
                {label}:
            </span>
            <span className="filter-value" onClick={() => setIsOpen(!isOpen)}>
                {selected.length === 0 ? "None" : selected.join(", ")}
            </span>
            {isOpen && (
                <div className="filter-dropdown-menu">
                    {options.length === 0 ? (
                        <div className="dropdown-item">No options available</div>
                    ) : (
                        options.map((option) => (
                            <div
                                key={option}
                                className="dropdown-item checkbox-item"
                                onClick={() => toggleSelection(option)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selected.includes(option)}
                                    readOnly
                                />
                                <span>{option}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

// --- Sub-Components for Tabs ---

const OverviewView = ({ greenhouse }) => {
    return (
        <div className="overview-container">
            <div className="overview-grid">
                <div className="overview-card">
                    <h4>Pressure Distribution</h4>
                    <div className="chart-placeholder">
                        <p>No pest or disease data to display.</p>
                        {/* Placeholder for a chart */}
                        <div style={{ height: '150px', background: '#f3f4f6', borderRadius: '4px', marginTop: '10px' }}></div>
                    </div>
                </div>
                <div className="overview-card">
                    <h4>Threshold Warnings as of Week 32</h4>
                    <div className="chart-placeholder center-content">
                        <p>No pest or disease above threshold. 🎉</p>
                    </div>
                </div>
                <div className="overview-card">
                    <h4>Scouting Activity for Week 32</h4>
                    <div className="stats-list">
                        <div className="stat-row"><span className="label">Scouted:</span> <span className="value">0% (0 of 45)</span></div>
                        <div className="stat-row"><span className="label">Area Scouted:</span> <span className="value">0% (0 m² of 6,070.5 m²)</span></div>
                        <div className="stat-row"><span className="label">Active Scouts:</span> <span className="value">0</span></div>
                        <div className="stat-row"><span className="label">Sticky Cards Counted:</span> <span className="value">0</span></div>
                        <div className="stat-row header">Observations</div>
                        <div className="stat-row"><span className="label">Created:</span> <span className="value">0</span></div>
                        <div className="stat-row"><span className="label">Updated:</span> <span className="value">0</span></div>
                        <div className="stat-row"><span className="label">Resolved:</span> <span className="value">0</span></div>
                    </div>
                </div>
                <div className="overview-card">
                    <h4>Application Costs</h4>
                    <table className="costs-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Week 32</th>
                                <th>31 - 32</th>
                                <th>To Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td className="row-label">Sprays</td><td>$0</td><td>$0</td><td>$0</td></tr>
                            <tr><td className="row-label">Beneficials</td><td>$0</td><td>$0</td><td>$0</td></tr>
                            <tr><td className="row-label">Other</td><td>$0</td><td>$0</td><td>$0</td></tr>
                            <tr className="total-row"><td></td><td>$0</td><td>$0</td><td>$0<br /><span className="sub-text">$0.00 / m²</span></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const MapView = ({ applications, filters, totalRows }) => {
    // Generate zones based on totalRows, each with 5 rows
    const zones = useMemo(() => {
        const rowsPerZone = 5;
        const numZones = Math.ceil((totalRows || 75) / rowsPerZone);
        const generatedZones = [];

        for (let i = numZones; i >= 1; i--) {
            const zStartRow = (i - 1) * rowsPerZone + 1;
            const rowsInThisZone = Math.min(rowsPerZone, (totalRows || 75) - zStartRow + 1);

            if (rowsInThisZone <= 0) continue;

            const rows = [];
            for (let j = 0; j < rowsInThisZone; j++) {
                rows.push({
                    number: zStartRow + j,
                    isGreen: true
                });
            }

            generatedZones.push({
                id: i,
                rows: [...rows].reverse() // Higher numbers at top of zone
            });
        }
        return generatedZones;
    }, [totalRows]);

    const [mapFilters, setMapFilters] = useState({
        pressure: []
    });

    const pressureOptions = ["Low", "Medium", "High"];

    const handleFilterChange = (category, val) => {
        setMapFilters(prev => ({ ...prev, [category]: val }));
    };

    const ColumnMarkers = () => (
        <div className="map-column-markers">
            <span className="col-num">1</span>
            <span className="col-arrow">→</span>
            <span className="col-num">20</span>
        </div>
    );

    // Filter applications based on map filters and location data
    const visibleMarkers = useMemo(() => {
        return applications.filter(app => {
            // Must have location data
            if (!app.row || !app.col) return false;

            // Check if matches the global filters (passed from parent)
            const matchPest = filters.pests.length === 0 || app.pests.some(p => filters.pests.includes(p));
            const matchDisease = filters.diseases.length === 0 || app.diseases.some(d => filters.diseases.includes(d));
            const matchPlant = filters.plants.length === 0 || app.plants.some(p => filters.plants.includes(p));
            const matchSpray = filters.sprays.length === 0 || app.sprays.some(s => filters.sprays.includes(s));
            const matchBeneficial = filters.beneficials.length === 0 || app.beneficials.some(b => filters.beneficials.includes(b));

            return matchPest && matchDisease && matchPlant && matchSpray && matchBeneficial;
        });
    }, [applications, filters]);

    return (
        <div className="map-view-container">
            <div className="map-controls">
                <div className="map-legend">
                    <h4>Pressures as of Week 32</h4>
                    <div className="legend-items">
                        <span className="legend-item"><span className="dot low"></span> Low</span>
                        <span className="legend-item"><span className="dot med"></span> Med</span>
                        <span className="legend-item"><span className="dot high"></span> High</span>
                    </div>
                </div>
                <div className="map-filters">
                    <FilterBar className="map-filter-bar">
                        <FilterDropdown
                            label="Pressure"
                            options={pressureOptions}
                            selected={mapFilters.pressure}
                            onChange={(val) => handleFilterChange('pressure', val)}
                        />
                    </FilterBar>
                </div>
            </div>

            <div className="greenhouse-map-canvas">
                <div className="map-scroll-area">
                    {zones.map((zone, zoneIdx) => (
                        <div key={zone.id} className="map-zone-section">
                            <ColumnMarkers />

                            <div className="zone-rows-container">
                                <div className="rows-list">
                                    {zone.rows.map((row) => (
                                        <div key={row.number} className="map-row-horizontal">
                                            <div className="row-label-left">{row.number}</div>
                                            <div className={`row-bar ${row.isGreen ? 'green-bar' : 'empty-bar'}`}>
                                                {visibleMarkers
                                                    .filter(m => m.row === row.number)
                                                    .map(marker => (
                                                        <div
                                                            key={marker.id}
                                                            className="map-marker"
                                                            style={{ left: `${(marker.col / 20) * 100}%` }}
                                                            title={marker.name}
                                                        >
                                                            <div className="marker-icon">👣</div>
                                                            <div className="marker-id">{marker.id}</div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="zone-side-label">
                                    <span>{zone.id}</span>
                                </div>
                            </div>

                            <ColumnMarkers />
                            {zoneIdx < zones.length - 1 && <div className="zone-divider"></div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const NotesView = () => {
    const [filters, setFilters] = useState({
        pests: [],
        diseases: [],
        plants: [],
        other: [],
        beneficials: [],
    });

    const pestOptions = useMemo(() => SAMPLE_PESTS.map(p => p.name), []);
    const diseaseOptions = useMemo(() => SAMPLE_DISEASES.map(d => d.name), []);
    const plantOptions = useMemo(() => SAMPLE_PLANTS.map(p => p.name), []);
    const beneficialOptions = useMemo(() => SAMPLE_BENEFICIALS.map(b => b.name), []);
    const otherOptions = ["General", "Maintenance", "Irrigation"];

    const handleFilterChange = (category, selectedValues) => {
        setFilters((prev) => ({
            ...prev,
            [category]: selectedValues,
        }));
    };

    const filteredNotes = useMemo(() => {
        return SAMPLE_NOTES.filter(note => {
            const matchesCategory = (category, options) => {
                if (options.length === 0) return true;
                // Simple textual match since data is inconsistent
                const text = (note.observation + " " + note.content + " " + note.type).toLowerCase();
                return options.some(opt => text.includes(opt.toLowerCase()));
            };

            return matchesCategory('pests', filters.pests) &&
                matchesCategory('diseases', filters.diseases) &&
                matchesCategory('plants', filters.plants) &&
                matchesCategory('other', filters.other) &&
                matchesCategory('beneficials', filters.beneficials);
        });
    }, [filters]);

    return (
        <div className="notes-view">
            <FilterBar
                rightActions={<button className="apply-btn">APPLY</button>} // Keeping button for visual consistency with previous design, though filtering is instant
            >
                <FilterDropdown label="Plants" options={plantOptions} selected={filters.plants} onChange={(val) => handleFilterChange('plants', val)} />
                <FilterDropdown label="Pests" options={pestOptions} selected={filters.pests} onChange={(val) => handleFilterChange('pests', val)} />
                <FilterDropdown label="Diseases" options={diseaseOptions} selected={filters.diseases} onChange={(val) => handleFilterChange('diseases', val)} />
                <FilterDropdown label="Other" options={otherOptions} selected={filters.other} onChange={(val) => handleFilterChange('other', val)} />
                <FilterDropdown label="Beneficials" options={beneficialOptions} selected={filters.beneficials} onChange={(val) => handleFilterChange('beneficials', val)} />
            </FilterBar>

            <div className="search-bar-row">
                <div className="note-info">Notes in week 32</div>
                <input type="text" placeholder="Search Notes" className="search-input-small" />
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Scout ↕</th>
                        <th>Pressure/Count ↕</th>
                        <th>Observation ↕</th>
                        <th>Type ↕</th>
                        <th>Location ↕</th>
                        <th>Date ↕</th>
                        <th>Notes in week 32 ↕</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredNotes.length === 0 ? (
                        <tr><td colSpan="7" className="empty-table-message">No notes match filters</td></tr>
                    ) : (
                        filteredNotes.map(note => (
                            <tr key={note.id}>
                                <td>{note.scout}</td>
                                <td>{note.pressure}</td>
                                <td>{note.observation}</td>
                                <td>{note.type}</td>
                                <td>{note.location}</td>
                                <td>{note.date}</td>
                                <td>{note.content}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className="empty-state-small">{filteredNotes.length === 0 ? "No results" : "No more notes"}</div>
        </div>
    );
};

const OtherObservationsView = () => {
    const [filters, setFilters] = useState({
        observations: [],
        scouts: []
    });

    const observationOptions = useMemo(() => [...new Set(SAMPLE_OTHER_OBSERVATIONS.map(o => o.observation))], []);
    const scoutOptions = useMemo(() => [...new Set(SAMPLE_OTHER_OBSERVATIONS.map(o => o.scout))], []);

    const handleFilterChange = (category, val) => {
        setFilters(prev => ({ ...prev, [category]: val }));
    };

    const filteredObs = useMemo(() => {
        return SAMPLE_OTHER_OBSERVATIONS.filter(obs => {
            const matchObs = filters.observations.length === 0 || filters.observations.includes(obs.observation);
            const matchScout = filters.scouts.length === 0 || filters.scouts.includes(obs.scout);
            return matchObs && matchScout;
        });
    }, [filters]);

    return (
        <div className="other-observations-view">
            <FilterBar>
                <FilterDropdown label="Observations" options={observationOptions} selected={filters.observations} onChange={(val) => handleFilterChange('observations', val)} />
                <FilterDropdown label="Scouts" options={scoutOptions} selected={filters.scouts} onChange={(val) => handleFilterChange('scouts', val)} />
            </FilterBar>

            <div className="search-bar-row">
                <div className="note-info">Other Observations in Week 32</div>
                <input type="text" placeholder="Search Notes" className="search-input-small" />
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Scout ↕</th>
                        <th>Count ↕</th>
                        <th>Observation ↕</th>
                        <th>Location ↕</th>
                        <th>Date ↕</th>
                        <th>Notes ↕</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredObs.length === 0 ? (
                        <tr><td colSpan="6" className="empty-table-message">No matches</td></tr>
                    ) : (
                        filteredObs.map(obs => (
                            <tr key={obs.id}>
                                <td>{obs.scout}</td>
                                <td>{obs.count}</td>
                                <td>{obs.observation}</td>
                                <td>{obs.location}</td>
                                <td>{obs.date}</td>
                                <td>{obs.notes}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className="empty-state-small">No other observations</div>
            <div className="pagination-bar">
                <span>Page 1 of 1</span>
                <button className="download-csv-btn">DOWNLOAD CSV</button>
            </div>
        </div>
    );
};

// --- Main Component ---

const AssignmentsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content large" onClick={e => e.stopPropagation()}>
                <div className="modal-header-row">
                    <h3>Message to ALL Users</h3>
                    <span className="timestamp">6 days ago at 9:06 PM by Rashid Idrees</span>
                </div>

                <textarea className="assignment-textarea" placeholder=""></textarea>

                <div className="assignment-section-title">Full Access</div>

                <div className="user-assignment-block">
                    <div className="user-header">
                        <span className="user-name">Fouad Charafeddine</span>
                    </div>
                    <textarea className="assignment-textarea"></textarea>
                </div>

                <div className="user-assignment-block">
                    <div className="user-header">
                        <span className="user-name">Muhammad Javed</span>
                    </div>
                    <textarea className="assignment-textarea"></textarea>
                </div>

                <div className="assignment-section-title">Owners</div>

                <div className="user-assignment-block">
                    <div className="user-header">
                        <span className="user-name">Rashid Idrees</span>
                        <span className="timestamp">6 days ago at 9:06 PM by Rashid Idrees</span>
                    </div>
                    <textarea
                        className="assignment-textarea"
                        defaultValue="Please check row 2 zone 2 house 1"
                    ></textarea>
                </div>

                <div className="user-assignment-block">
                    <div className="user-header">
                        <span className="user-name">Jamie D'alimonte</span>
                    </div>
                    <textarea className="assignment-textarea"></textarea>
                </div>

                <div className="save-btn-container">
                    <button className="save-btn" onClick={onClose}>SAVE</button>
                </div>
            </div>
        </div>
    );
};


const AddApplicationModal = ({ isOpen, onClose, onSave, totalRows }) => {
    const [formData, setFormData] = useState({
        date: "2025-07-30",
        time: "12:00pm (12:00)",
        title: "",
        cost: "",
        notes: "",
        row: "1",
        col: "10"
    });

    if (!isOpen) return null;

    const handleSave = () => {
        if (!formData.title) {
            alert("Please enter a title");
            return;
        }
        onSave({
            ...formData,
            id: Date.now(),
            name: formData.title,
            pests: ["Aphids"], // Default sample data
            diseases: [],
            plants: ["Tomato"],
            sprays: ["Actara"],
            beneficials: [],
            rate: "10 ml/L",
            cost: `$${formData.cost || "0"}`,
            row: parseInt(formData.row),
            col: parseInt(formData.col)
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content add-app-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="back-btn" onClick={onClose}>
                        <span className="arrow-left">‹</span>
                    </button>
                    <h3>Add Application</h3>
                </div>

                <div className="modal-body">
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Date: <span className="required">*</span></label>
                            <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Time: <span className="required">*</span></label>
                            <select className="form-select" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })}>
                                <option>12:00pm (12:00)</option>
                                <option>01:00pm (13:00)</option>
                                <option>02:00pm (14:00)</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Title: <span className="required">*</span></label>
                        <input type="text" placeholder="e.g. Pest Control" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    </div>

                    <div className="form-group-row" style={{ display: 'flex', gap: '15px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Row (1-{totalRows || 75}):</label>
                            <input type="number" min="1" max={totalRows || 75} value={formData.row} onChange={e => setFormData({ ...formData, row: e.target.value })} />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Column (1-20):</label>
                            <input type="number" min="1" max="20" value={formData.col} onChange={e => setFormData({ ...formData, col: e.target.value })} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Cost</label>
                        <div className="cost-input-wrapper">
                            <span className="currency-symbol">$</span>
                            <input type="text" value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Notes:</label>
                        <textarea className="form-textarea" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}></textarea>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="save-btn-green" onClick={handleSave}>SAVE</button>
                </div>
            </div>
        </div>
    );
};


const GreenhouseApplications = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Overview"); // Default to Overview (first tab)
    const [currentWeek] = useState(32);
    const [year] = useState(2025);
    const [isAssignmentsOpen, setIsAssignmentsOpen] = useState(false);
    const [isAddOtherOpen, setIsAddOtherOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Applications State
    const [applications, setApplications] = useState(() => {
        // Add some row/col to initial data for demo
        return SAMPLE_APPLICATIONS.map((app, idx) => ({
            ...app,
            row: 90 + idx, // Just random spread
            col: 5 + (idx * 3)
        }));
    });

    const handleAddApplication = (newApp) => {
        setApplications([newApp, ...applications]);
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.header-actions') && !event.target.closest('.mobile-actions-btn')) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleDropdown = (name) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    const greenhouse = SAMPLE_GREENHOUSES.find((g) => g.id === parseInt(id));

    // Redirect if greenhouse not found
    useEffect(() => {
        if (!greenhouse && SAMPLE_GREENHOUSES.length > 0) {
            navigate("/greenhouses");
        }
    }, [id, greenhouse, navigate]);

    // Filters State for Applications Tab
    const [filters, setFilters] = useState({
        pests: [],
        diseases: [],
        plants: [],
        sprays: [],
        beneficials: [],
        other: [],
    });

    const handleFilterChange = (category, selectedValues) => {
        setFilters((prev) => ({
            ...prev,
            [category]: selectedValues,
        }));
    };

    // Derived Data for Filters
    const pestOptions = useMemo(() => SAMPLE_PESTS.map(p => p.name), []);
    const diseaseOptions = useMemo(() => SAMPLE_DISEASES.map(d => d.name), []);
    const plantOptions = useMemo(() => SAMPLE_PLANTS.map(p => p.name), []);
    const sprayOptions = useMemo(() => SAMPLE_SPRAYS.map(s => s.productName), []);
    const beneficialOptions = useMemo(() => SAMPLE_BENEFICIALS.map(b => b.name), []);
    const otherOptions = ["Sticky Cards", "Traps"];

    const filteredApplications = useMemo(() => {
        return applications.filter(app => {
            const matchPest = filters.pests.length === 0 || app.pests.some(p => filters.pests.includes(p));
            const matchDisease = filters.diseases.length === 0 || app.diseases.some(d => filters.diseases.includes(d));
            const matchPlant = filters.plants.length === 0 || app.plants.some(p => filters.plants.includes(p));
            const matchSpray = filters.sprays.length === 0 || app.sprays.some(s => filters.sprays.includes(s));
            const matchBeneficial = filters.beneficials.length === 0 || app.beneficials.some(b => filters.beneficials.includes(b));

            return matchPest && matchDisease && matchPlant && matchSpray && matchBeneficial;
        });
    }, [filters, applications]);


    const handleDownloadCSV = () => {
        const headers = ["ID,Name,Pests,Diseases,Plants,Sprays,Beneficials,Rate,Cost,Date"];
        const rows = filteredApplications.map(app => [
            app.id,
            `"${app.name}"`,
            `"${app.pests.join("; ")}"`,
            `"${app.diseases.join("; ")}"`,
            `"${app.plants.join("; ")}"`,
            `"${app.sprays.join("; ")}"`,
            `"${app.beneficials.join("; ")}"`,
            app.rate,
            app.cost,
            app.date
        ].join(","));

        const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${greenhouse.name}_applications.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!greenhouse) return null;

    const handleGreenhouseChange = (e) => {
        const newId = e.target.value;
        navigate(`/greenhouses/${newId}/applications`);
    };

    const tabs = [
        "Overview",
        "Map",
        "Notes",
        "Applications",
        "Other Observations",
    ];

    return (
        <div className="greenhouse-page">
            {/* Header Section */}
            <div className="greenhouse-header props-header">
                <div className="header-left">
                    <div className="header-title-section">
                        <img src={greenhousePIC} alt="Greenhouse" className="header-icon" />
                        <div>
                            <div className="greenhouse-select-wrapper">
                                <select
                                    className="greenhouse-select"
                                    value={greenhouse.id}
                                    onChange={handleGreenhouseChange}
                                    style={{ fontSize: '12px' }}
                                >
                                    {SAMPLE_GREENHOUSES.map((gh) => (
                                        <option key={gh.id} value={gh.id}>
                                            {gh.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="header-stats">
                        <div className="stat-item">
                            <span className="stat-label">Area:</span>
                            <span className="stat-value">{greenhouse.area || "N/A"}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Created:</span>
                            <span className="stat-value">{greenhouse.created || "N/A"}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">First Observation:</span>
                            <span className="stat-value">
                                {greenhouse.firstObservation || "N/A"}
                            </span>
                        </div>
                    </div>
                </div>
                <button className="mobile-actions-btn" onClick={() => toggleDropdown('mobile-more')}>
                    <span className="icon">☰</span> Actions ▼
                </button>

                {activeDropdown === 'mobile-more' && (
                    <div className="dropdown-menu" style={{
                        display: 'block',
                        width: '200px',
                        top: '40px',
                        right: '0',
                        zIndex: 1001
                    }}>
                        <div className="dropdown-item" style={{ fontWeight: 'bold', color: '#2dc55f' }}>Applications</div>
                        <div className="dropdown-item" onClick={() => navigate(`/greenhouses/${id}/add-spray`)} style={{ paddingLeft: '20px' }}>• Add spray</div>
                        <div className="dropdown-item" onClick={() => navigate(`/greenhouses/${id}/add-beneficial`)} style={{ paddingLeft: '20px' }}>• Add beneficial</div>
                        <div className="dropdown-item" onClick={() => { setIsAddOtherOpen(true); setActiveDropdown(null); }} style={{ paddingLeft: '20px' }}>• Add other</div>

                        <div className="dropdown-item" onClick={() => { setIsAssignmentsOpen(true); setActiveDropdown(null); }} style={{ fontWeight: 'bold' }}>📋 Assignments</div>

                        <div className="dropdown-item" style={{ fontWeight: 'bold', color: '#2dc55f' }}>Settings</div>
                        <div className="dropdown-item" onClick={() => navigate(`/greenhouses/${id}/settings/plants`)} style={{ paddingLeft: '20px' }}>• Add/remove plants</div>
                        <div className="dropdown-item" onClick={() => navigate(`/greenhouses/${id}/settings/sticky-cards`)} style={{ paddingLeft: '20px' }}>• Add/remove sticky cards</div>
                        <div className="dropdown-item" onClick={() => navigate(`/greenhouses/${id}/settings/thresholds`)} style={{ paddingLeft: '20px' }}>• Add/remove Thresholds</div>
                        <div className="dropdown-item" onClick={() => navigate(`/greenhouses/${id}/settings`)} style={{ paddingLeft: '20px' }}>• View Settings</div>
                    </div>
                )}

                <div className="header-actions desktop-only">
                    <div className="action-wrapper" style={{ position: 'relative' }}>
                        <button className="text-btn" onClick={() => toggleDropdown('applications')}>
                            <span className="icon">🏁</span> Applications ▼
                        </button>
                        {activeDropdown === 'applications' && (
                            <div className="dropdown-menu" style={{
                                display: 'block',
                                width: '180px',
                                top: '100%',
                                left: '0'
                            }}>
                                <div className="dropdown-item" onClick={() => navigate(`/greenhouses/${id}/add-spray`)}>Add spray</div>
                                <div className="dropdown-item" onClick={() => navigate(`/greenhouses/${id}/add-beneficial`)}>Add benificial</div>
                                <div className="dropdown-item" onClick={() => setIsAddOtherOpen(true)}>Add other</div>
                            </div>
                        )}
                    </div>

                    <button className="text-btn" onClick={() => setIsAssignmentsOpen(true)}>
                        <span className="icon">📋</span> Assignments
                    </button>

                    <div className="action-wrapper" style={{ position: 'relative' }}>
                        <button className="text-btn" onClick={() => toggleDropdown('settings')}>
                            <span className="icon">⚙️</span> Settings ▼
                        </button>
                        {activeDropdown === 'settings' && (
                            <div className="dropdown-menu" style={{
                                display: 'block',
                                width: '220px',
                                top: '100%',
                                right: '0'
                            }}>
                                <div className="dropdown-item" onClick={() => navigate(`/greenhouses/${id}/settings/plants`)}>Add/ remove plants</div>
                                <div className="dropdown-item" onClick={() => navigate(`/greenhouses/${id}/settings/sticky-cards`)}>Add/ remove sticky cards</div>
                                <div className="dropdown-item" onClick={() => navigate(`/greenhouses/${id}/settings/thresholds`)}>Add/remove Thresholds</div>
                                <div className="dropdown-item" onClick={() => navigate(`/greenhouses/${id}/settings`)}>View Settings</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="greenhouse-tabs-container">
                <div className="greenhouse-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`greenhouse-tab ${activeTab === tab ? "active" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="week-selector">
                    <span className="week-label">Week</span>
                    <button className="week-nav-btn">{"<"}</button>
                    <div className="week-display">
                        {currentWeek} - Current ▼ {year} ▼
                    </div>
                    <button className="week-nav-btn">{">"}</button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="greenhouse-content">
                {activeTab === "Overview" && <OverviewView greenhouse={greenhouse} />}
                {activeTab === "Map" && <MapView applications={applications} filters={filters} totalRows={greenhouse.totalRows} />}
                {activeTab === "Notes" && <NotesView />}
                {activeTab === "Applications" && (
                    <div className="applications-view">
                        <FilterBar
                            rightActions={<button className="add-btn-circle">+</button>}
                        >
                            <FilterDropdown
                                label="Pests"
                                options={pestOptions}
                                selected={filters.pests}
                                onChange={(val) => handleFilterChange('pests', val)}
                            />
                            <FilterDropdown
                                label="Diseases"
                                options={diseaseOptions}
                                selected={filters.diseases}
                                onChange={(val) => handleFilterChange('diseases', val)}
                            />
                            <FilterDropdown
                                label="Other"
                                options={otherOptions}
                                selected={filters.other}
                                onChange={(val) => handleFilterChange('other', val)}
                            />
                            <FilterDropdown
                                label="Plants"
                                options={plantOptions}
                                selected={filters.plants}
                                onChange={(val) => handleFilterChange('plants', val)}
                            />
                            <FilterDropdown
                                label="Sprays"
                                options={sprayOptions}
                                selected={filters.sprays}
                                onChange={(val) => handleFilterChange('sprays', val)}
                            />
                            <FilterDropdown
                                label="Beneficials"
                                options={beneficialOptions}
                                selected={filters.beneficials}
                                onChange={(val) => handleFilterChange('beneficials', val)}
                            />
                        </FilterBar>

                        <div className="applications-table-container">
                            <table className="applications-table">
                                <thead>
                                    <tr>
                                        <th>Application ↕</th>
                                        <th>Name ↕</th>
                                        <th>Targeting Which Pests & Diseases ↕</th>
                                        <th>Targeting Which Plant ↕</th>
                                        <th>Rate ↕</th>
                                        <th>Cost ↕</th>
                                        <th>Date of Application ↕</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredApplications.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="empty-table-message">
                                                No applications match your filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredApplications.map((app) => (
                                            <tr key={app.id}>
                                                <td>{app.name}</td>
                                                <td>{app.name}</td>
                                                <td>
                                                    {[...app.pests, ...app.diseases].join(", ") || "None"}
                                                </td>
                                                <td>{app.plants.join(", ") || "None"}</td>
                                                <td>{app.rate}</td>
                                                <td>{app.cost}</td>
                                                <td>{app.date}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="pagination-bar">
                            <span>Page 1 of 1</span>
                            <div className="pagination-controls">
                                <button disabled>{"<"}</button>
                                <span>Go To Page: <input type="text" className="page-input" defaultValue="1" /></span>
                                <button disabled>{">"}</button>
                            </div>
                            <button className="download-csv-btn" onClick={handleDownloadCSV}>DOWNLOAD CSV</button>
                        </div>
                    </div>
                )}
                {activeTab === "Other Observations" && <OtherObservationsView />}
            </div>

            {/* Assignments Modal */}
            <AssignmentsModal
                isOpen={isAssignmentsOpen}
                onClose={() => setIsAssignmentsOpen(false)}
            />

            <AddApplicationModal
                isOpen={isAddOtherOpen}
                onClose={() => setIsAddOtherOpen(false)}
                onSave={handleAddApplication}
                totalRows={greenhouse.totalRows}
            />
        </div>
    );
};

export default GreenhouseApplications;
