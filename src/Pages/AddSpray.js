import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SAMPLE_GREENHOUSES } from "../Data/greenhouseData";
import greenhousePIC from "../Data/greenhouse.png";
import "./AddSpray.css";

const AddSpray = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const greenhouse = SAMPLE_GREENHOUSES.find((g) => g.id === parseInt(id));

    const [formData, setFormData] = useState({
        date: "2025-07-30",
        time: "12:00pm",
        pests: [],
        plants: [],
        product: "",
        applier: "",
        supplier: "",
        method: "",
        quantity: "",
        rationale: "",
        rate: "",
        cost: "",
        restrictedUntilDate: "",
        restrictedUntilTime: "",
        preHarvestDate: "",
        preHarvestTime: "",
        notes: "",
        equipmentCleaned: false
    });

    const [selectedRows, setSelectedRows] = useState(new Set());
    const [observationFilters, setObservationFilters] = useState({
        pests: true,
        diseases: true,
        other: true,
        beneficials: true,
        stickyCards: true
    });


    const totalRows = greenhouse?.totalRows || 75;

    // Map generation logic
    const zones = useMemo(() => {
        const rowsPerZone = 5;
        const numZones = Math.ceil(totalRows / rowsPerZone);
        const generatedZones = [];

        for (let i = numZones; i >= 1; i--) {
            const zStartRow = (i - 1) * rowsPerZone + 1;
            const rowsInThisZone = Math.min(rowsPerZone, totalRows - zStartRow + 1);

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
                rows: [...rows].reverse()
            });
        }
        return generatedZones;
    }, [totalRows]);

    if (!greenhouse) return null;

    const toggleRowSelection = (rowNum) => {
        const newSelection = new Set(selectedRows);
        if (newSelection.has(rowNum)) {
            newSelection.delete(rowNum);
        } else {
            newSelection.add(rowNum);
        }
        setSelectedRows(newSelection);
    };

    const handleSelectAll = () => {
        const allRows = Array.from({ length: totalRows }, (_, i) => i + 1);
        setSelectedRows(new Set(allRows));
    };

    const handleClearAll = () => {
        setSelectedRows(new Set());
    };

    const handleSave = () => {
        alert("Spray application saved!");
        navigate(`/greenhouses/${id}/applications`);
    };

    const ColumnMarkers = () => (
        <div className="map-column-markers">
            <span className="col-num">1</span>
            <span className="col-arrow">→</span>
            <span className="col-num">20</span>
        </div>
    );

    return (
        <div className="add-spray-page">
            <div className="spray-sidebar">
                <div className="sidebar-header">
                    <img src={greenhousePIC} alt="Greenhouse" className="gh-icon-small" />
                    <h2>{greenhouse.name}</h2>
                </div>

                <h3 className="sidebar-title">Spray Application</h3>

                <div className="spray-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Date: <span className="required">*</span></label>
                            <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Time:</label>
                            <select value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })}>
                                <option>Select Time</option>
                                <option>12:00pm</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Targeting Which Pests & Diseases: <span className="required">*</span></label>
                        <div className="search-select-box">
                            <span className="search-icon">🔍</span>
                            <input type="text" placeholder="Select..." />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Targeting Which Plants: <span className="required">*</span></label>
                        <div className="search-select-box">
                            <span className="search-icon">🔍</span>
                            <input type="text" placeholder="Select..." />
                        </div>
                        <div className="selected-tags">
                            <div className="plant-tag">
                                <span className="tag-icon">🍅</span>
                                <span className="tag-label">Beefsteak</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Product: <span className="required">*</span></label>
                        <div className="search-select-box">
                            <span className="search-icon">🔍</span>
                            <input type="text" placeholder="Select Product" />
                        </div>
                    </div>

                    <div className="spray-location-controls">
                        <label>Spray Locations on Map:</label>
                        <div className="control-btns">
                            <button className="grey-btn" onClick={handleSelectAll}>Select All</button>
                            <button className="grey-btn" onClick={handleClearAll}>Clear All</button>
                        </div>
                        <button className="select-targets-btn">Select Targets</button>
                    </div>

                    <div className="spray-stats">
                        <div className="stat-line">Total Area Selected: <strong>{selectedRows.size * 100} m²</strong></div>
                        <div className="stat-line">Area with Targeted Plants: <strong>0 m²</strong></div>
                        <div className="stat-line">Area with Targeted Plants & Pests: <strong>0 m²</strong></div>
                    </div>

                    <div className="form-group">
                        <label>Applier:</label>
                        <select value={formData.applier} onChange={e => setFormData({ ...formData, applier: e.target.value })}>
                            <option>Select Applier</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Supplier:</label>
                        <input type="text" value={formData.supplier} onChange={e => setFormData({ ...formData, supplier: e.target.value })} />
                    </div>

                    <div className="form-group">
                        <label>Method of Application:</label>
                        <input type="text" value={formData.method} onChange={e => setFormData({ ...formData, method: e.target.value })} />
                    </div>

                    <div className="form-group">
                        <label>Quantity Applied:</label>
                        <input type="text" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                    </div>

                    <div className="form-group">
                        <label>Rationale:</label>
                        <input type="text" value={formData.rationale} onChange={e => setFormData({ ...formData, rationale: e.target.value })} />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Rate:</label>
                            <input type="text" value={formData.rate} onChange={e => setFormData({ ...formData, rate: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Cost of Application:</label>
                            <div className="cost-box">
                                <span className="curr">$</span>
                                <input type="text" value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Entry Restricted Until:</label>
                        <div className="form-row">
                            <input type="date" />
                            <select><option>Select Time</option></select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Pre-Harvest Interval:</label>
                        <div className="form-row">
                            <input type="date" />
                            <select><option>Select Time</option></select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Notes:</label>
                        <textarea rows="3" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}></textarea>
                    </div>

                    <div className="form-group checkbox-group">
                        <input type="checkbox" id="equip-clean" checked={formData.equipmentCleaned} onChange={e => setFormData({ ...formData, equipmentCleaned: e.target.checked })} />
                        <label htmlFor="equip-clean">Equipment Cleaned</label>
                    </div>

                    <div className="info-box">
                        <span className="info-icon">ℹ️</span>
                        <p>You can click an observation to see more information.</p>
                    </div>
                </div>

                <div className="sidebar-footer">
                    <button className="back-btn-outline" onClick={() => navigate(-1)}>‹ BACK</button>
                    <button className="save-btn-green" onClick={handleSave}>SAVE</button>
                </div>
            </div>

            <div className="spray-map-content">
                <div className="map-top-bar">
                    <span className="filter-label">Observation Filters:</span>
                    {Object.keys(observationFilters).map(key => (
                        <label key={key} className="map-filter-checkbox">
                            <input
                                type="checkbox"
                                checked={observationFilters[key]}
                                onChange={() => setObservationFilters({ ...observationFilters, [key]: !observationFilters[key] })}
                            />
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </label>
                    ))}
                </div>

                <div className="map-container-wrapper">
                    <div className="north-arrow-container">
                        <div className="north-arrow">
                            <span className="arrow-head">▲</span>
                            <span className="arrow-label">N</span>
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
                                                    <div
                                                        className={`row-bar ${row.isGreen ? 'green-bar' : 'empty-bar'} ${selectedRows.has(row.number) ? 'selected-row' : ''}`}
                                                        onClick={() => toggleRowSelection(row.number)}
                                                    >
                                                        {/* Optional: Add selection overlay or markers */}
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
            </div>
        </div>
    );
};

export default AddSpray;
