import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../DataBase/supabaseClient";
import { SAMPLE_GREENHOUSES } from "../Data/greenhouseData";
import greenhousePIC from "../Data/greenhouse.png";
import "./editPlants.css";

const PLANTS_LIBRARY = [
    { label: "Beefsteak", icon: "🍅" },
    { label: "Heirloom", icon: "🍅" },
];

export default function EditPlants() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [greenhouse, setGreenhouse] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isPoly, setIsPoly] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState(PLANTS_LIBRARY[0]); // Beefsteak
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectionMode, setSelectionMode] = useState("Section");

    useEffect(() => {
        fetchGreenhouse();
    }, [id]);

    const fetchGreenhouse = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("greenhouses")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                const sample = SAMPLE_GREENHOUSES.find((g) => g.id === parseInt(id));
                setGreenhouse(sample);
            } else {
                setGreenhouse(data);
            }
        } catch (err) {
            console.error("Error fetching greenhouse:", err);
        } finally {
            setLoading(false);
        }
    };

    const totalRows = greenhouse?.totalRows || greenhouse?.total_rows || 45;

    const [searchTerm, setSearchTerm] = useState("");

    const filteredPlants = PLANTS_LIBRARY.filter(plant =>
        plant.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    plant: selectedPlant
                });
            }

            generatedZones.push({
                id: i,
                rows: [...rows].reverse()
            });
        }
        return generatedZones;
    }, [totalRows, selectedPlant]);


    if (!greenhouse) return null;

    const handleSave = () => {
        alert("Plants updated successfully!");
        navigate(-1);
    };

    return (
        <div className="edit-plants-page">
            <div className="edit-sidebar">
                <div className="sidebar-header">
                    <img src={greenhousePIC} alt="Greenhouse" className="gh-icon-small" />
                    <h2>{greenhouse.name}</h2>
                </div>

                <div className="edit-plants-form">
                    <h3 className="title">Settings - Edit Plants</h3>

                    <div className="toggle-group">
                        <span>Monoculture</span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={isPoly}
                                onChange={() => setIsPoly(!isPoly)}
                            />
                            <span className="slider"></span>
                        </label>
                        <span>Polyculture</span>
                    </div>

                    <div className="step-group">
                        <span className="step-label">Step 1:</span>
                        <div className="form-group">
                            <label>Plants:</label>
                            <div className="custom-select" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                <div className="selected-option">
                                    <span>{selectedPlant.icon}</span>
                                    <span>{selectedPlant.label}</span>
                                </div>
                                <span>{isDropdownOpen ? '▲' : '▼'}</span>

                                {isDropdownOpen && (
                                    <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                                        <div className="search-container">
                                            <span className="search-icon">🔍</span>
                                            <input
                                                type="text"
                                                placeholder="Search Plants..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        {filteredPlants.map((plant) => (
                                            <div
                                                key={plant.label}
                                                className={`dropdown-item ${selectedPlant.label === plant.label ? 'active' : ''}`}
                                                onClick={() => {
                                                    setSelectedPlant(plant);
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                <span>{plant.icon}</span>
                                                <span>{plant.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className="cant-find">Can't find the plant you're looking for?</span>
                        </div>
                    </div>

                    {isPoly && (
                        <div className="step-group">
                            <span className="step-label">Step 2:</span>
                            <label style={{ fontSize: '13px', color: '#666', marginBottom: '8px', display: 'block' }}>
                                Add plants to greenhouse:
                            </label>
                            <div className="selection-modes">
                                <button
                                    className={`mode-btn ${selectionMode === "Section" ? "active" : ""}`}
                                    onClick={() => setSelectionMode("Section")}
                                >By Section</button>
                                <button
                                    className={`mode-btn ${selectionMode === "Row" ? "active" : ""}`}
                                    onClick={() => setSelectionMode("Row")}
                                >By Row</button>
                                <button
                                    className={`mode-btn ${selectionMode === "House" ? "active" : ""}`}
                                    onClick={() => setSelectionMode("House")}
                                >By House</button>
                            </div>

                            <label style={{ fontSize: '13px', color: '#666', marginBottom: '10px', display: 'block' }}>
                                Added plants:
                            </label>
                            <div className="added-plants-list">
                                <div className="added-plant-item">
                                    <div className="no-plant-icon">∅</div>
                                    <div className="added-plant-info">
                                        <h4>100% No Plant</h4>
                                        <p>45 Rows (1710 Sections)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="sidebar-footer">
                    <button className="back-btn-outline" onClick={() => navigate(-1)}>‹ BACK</button>
                    <button className="save-btn-green" onClick={handleSave}>SAVE</button>
                </div>
            </div>

            <div className="map-content">
                <div className="north-arrow-container">
                    <div className="north-arrow">
                        <span className="arrow-head">▲</span>
                        <span className="arrow-label">N</span>
                    </div>
                </div>

                <div className="gh-map-canvas">
                    {zones.map((zone) => (
                        <div key={zone.id} className="map-zone">
                            <div className="map-col-markers">
                                <span>1</span>
                                <span>→</span>
                                <span>20</span>
                            </div>

                            <div className="zone-rows">
                                {zone.rows.map((row) => (
                                    <div key={row.number} className="row-item">
                                        <div className="row-num">{row.number}</div>
                                        <div className="row-visual">
                                            {!isPoly && (
                                                <div className="plant-tag">
                                                    <span>{row.plant.icon}</span>
                                                    <span>{row.plant.label}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="map-col-markers" style={{ borderTop: '1px dashed #ccc', borderBottom: 'none', marginTop: '5px' }}>
                                <span>1</span>
                                <span>→</span>
                                <span>20</span>
                            </div>

                            <div className="zone-label">{zone.id}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
