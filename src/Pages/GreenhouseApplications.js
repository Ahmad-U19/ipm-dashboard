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

// Sample Data for Applications
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

const MapView = () => {
    // Generate some dummy rows
    const rows = Array.from({ length: 20 }, (_, i) => i + 1);

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
                    {/* Add functionality later */}
                </div>
            </div>

            <div className="greenhouse-map-visual">
                <div className="compass">
                    <span>N</span>
                    <div className="arrow-up"></div>
                </div>
                <div className="rows-container">
                    {rows.map(row => (
                        <div key={row} className="map-row">
                            <span className="row-number">{row}</span>
                            <div className="row-visual"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const NotesView = () => {
    return (
        <div className="notes-view">
            <div className="filters-bar">
                <div className="filter-group"><span className="filter-label">Filters ▼</span></div>
                <div className="filter-group"><span className="filter-label">Plants:</span> <span className="filter-value">All</span></div>
                <div className="filter-group"><span className="filter-label">Pests:</span> <span className="filter-value">All</span></div>
                <div className="filter-group"><span className="filter-label">Diseases:</span> <span className="filter-value">All</span></div>
                <div className="filter-group"><span className="filter-label">Other:</span> <span className="filter-value">All</span></div>
                <div className="filter-group"><span className="filter-label">Beneficials:</span> <span className="filter-value">All</span></div>
                <button className="apply-btn">APPLY</button>
            </div>
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
                    {SAMPLE_NOTES.map(note => (
                        <tr key={note.id}>
                            <td>{note.scout}</td>
                            <td>{note.pressure}</td>
                            <td>{note.observation}</td>
                            <td>{note.type}</td>
                            <td>{note.location}</td>
                            <td>{note.date}</td>
                            <td>{note.content}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="empty-state-small">No more notes</div>
        </div>
    );
};

const OtherObservationsView = () => {
    return (
        <div className="other-observations-view">
            <div className="filters-bar">
                <div className="filter-group"><span className="filter-label">Filters ▼</span></div>
                <div className="filter-group"><span className="filter-label">Observations:</span><span className="filter-value">None</span></div>
                <div className="filter-group"><span className="filter-label">Scouts:</span><span className="filter-value">All</span></div>
            </div>
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
                    {SAMPLE_OTHER_OBSERVATIONS.map(obs => (
                        <tr key={obs.id}>
                            <td>{obs.scout}</td>
                            <td>{obs.count}</td>
                            <td>{obs.observation}</td>
                            <td>{obs.location}</td>
                            <td>{obs.date}</td>
                            <td>{obs.notes}</td>
                        </tr>
                    ))}
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

const GreenhouseApplications = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Overview"); // Default to Overview (first tab)
    const [currentWeek] = useState(32);
    const [year] = useState(2025);

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
        return SAMPLE_APPLICATIONS.filter(app => {
            const matchPest = filters.pests.length === 0 || app.pests.some(p => filters.pests.includes(p));
            const matchDisease = filters.diseases.length === 0 || app.diseases.some(d => filters.diseases.includes(d));
            const matchPlant = filters.plants.length === 0 || app.plants.some(p => filters.plants.includes(p));
            const matchSpray = filters.sprays.length === 0 || app.sprays.some(s => filters.sprays.includes(s));
            const matchBeneficial = filters.beneficials.length === 0 || app.beneficials.some(b => filters.beneficials.includes(b));

            return matchPest && matchDisease && matchPlant && matchSpray && matchBeneficial;
        });
    }, [filters]);


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
                <div className="header-actions">
                    <button className="text-btn">
                        <span className="icon">🏁</span> Applications ▼
                    </button>
                    <button className="text-btn">
                        <span className="icon">📋</span> Assignments
                    </button>
                    <button className="text-btn">
                        <span className="icon">⚙️</span> Settings ▼
                    </button>
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
                {activeTab === "Map" && <MapView />}
                {activeTab === "Notes" && <NotesView />}
                {activeTab === "Applications" && (
                    <div className="applications-view">
                        <div className="filters-bar">
                            <div className="filter-group">
                                <span className="filter-label">Filters ▼</span>
                            </div>

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

                            <button className="add-btn-circle">+</button>
                        </div>

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
        </div>
    );
};

export default GreenhouseApplications;
