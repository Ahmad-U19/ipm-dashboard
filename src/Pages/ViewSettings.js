import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SAMPLE_GREENHOUSES } from "../Data/greenhouseData";
import greenhousePIC from "../Data/greenhouse.png";
import "./viewSettings.css";

const QUICK_PESTS = [
    { id: "Sf", name: "Shore Fly", icon: "🪰" },
    { id: "Fg", name: "Fungus Gnat", icon: "🦟" },
    { id: "Aph", name: "Aphids", icon: "🦗" },
    { id: "Wf", name: "Whitefly", icon: "🦋" },
    { id: "Th", name: "Thrips", icon: "🪰" },
    { id: "Bm", name: "Broad Mite", icon: "🕷️" },
];

const QUICK_DISEASES = [
    { id: "Ber", name: "Blossom End", icon: "🍎" },
    { id: "Wi", name: "Wilting", icon: "🥀" },
    { id: "Rr", name: "Pythium", icon: "🌱" },
    { id: "Pm", name: "Powdery", icon: "🍄" },
];

const QUICK_BENEFICIALS = [
    { id: "Pr", name: "Persimilis", icon: "🐞" },
    { id: "Nm", name: "nematode", icon: "🪱" },
    { id: "Ere", name: "Eretmocerus", icon: "🦋" },
    { id: "Ori", name: "Orius", icon: "🪲" },
    { id: "Sm", name: "Swirski", icon: "🕷️" },
];

export default function ViewSettings() {
    const { id } = useParams();
    const navigate = useNavigate();
    const greenhouse = SAMPLE_GREENHOUSES.find((g) => g.id === parseInt(id));

    const totalRows = greenhouse?.totalRows || 45;

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
                    plant: "Beefsteak",
                    hasMarker: (zStartRow + j) % 15 === 0 // Dummy marker every 15 rows
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

    const navigateTo = (path) => {
        navigate(`/greenhouses/${id}/settings/${path}`);
    };

    return (
        <div className="view-settings-page">
            <div className="view-sidebar">
                <div className="sidebar-scroll">
                    <div className="sidebar-header">
                        <div className="gh-title-box">
                            <img src={greenhousePIC} alt="GH" className="gh-icon-small" />
                            <h2>{greenhouse.name}</h2>
                        </div>
                        <span className="edit-icon">✎</span>
                    </div>

                    <div className="settings-section">
                        <span className="section-label">Rows of Plants:</span>
                        <div className="plant-info-display">
                            <span className="plant-icon-large">🍅</span>
                            <div className="plant-details">
                                <h4>100% Beefsteak (BF)</h4>
                                <p>45 Rows (1710 Sections)</p>
                            </div>
                        </div>
                        <span className="settings-link" onClick={() => navigateTo('plants')}>Add/Remove Plants</span>
                    </div>

                    <div className="settings-section">
                        <span className="section-label-green">Sticky Cards</span>
                        <span className="settings-link" onClick={() => navigateTo('sticky-cards')}>Add/Remove Sticky Cards</span>
                    </div>

                    <div className="settings-section">
                        <span className="section-label-green">Quick Access</span>
                        <div className="info-box-small">
                            <span className="info-icon">ⓘ</span>
                            <p className="info-text">Set the most common pests & diseases for quick access in the scouting app.</p>
                        </div>

                        <div className="search-field">
                            <label>Posts:</label>
                            <div className="search-input-container">
                                <input type="text" placeholder="Select..." />
                                <span>▼</span>
                            </div>
                        </div>
                        <div className="icon-grid">
                            {QUICK_PESTS.map(p => (
                                <div key={p.id} className="grid-icon-box">
                                    <span className="icon-small">{p.icon}</span>
                                    <span className="icon-name-tiny">{p.name}</span>
                                </div>
                            ))}
                        </div>

                        <div className="search-field">
                            <label>Diseases:</label>
                            <div className="search-input-container">
                                <input type="text" placeholder="Select..." />
                                <span>▼</span>
                            </div>
                        </div>
                        <div className="icon-grid">
                            {QUICK_DISEASES.map(d => (
                                <div key={d.id} className="grid-icon-box disease">
                                    <span className="icon-small">{d.icon}</span>
                                    <span className="icon-name-tiny">{d.name}</span>
                                </div>
                            ))}
                        </div>

                        <div className="search-field">
                            <label>Beneficials:</label>
                            <div className="search-input-container">
                                <input type="text" placeholder="Select..." />
                                <span>▼</span>
                            </div>
                        </div>
                        <div className="icon-grid">
                            {QUICK_BENEFICIALS.map(b => (
                                <div key={b.id} className="grid-icon-box beneficial">
                                    <span className="icon-small">{b.icon}</span>
                                    <span className="icon-name-tiny">{b.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="settings-section">
                        <span className="section-label-green">Action Thresholds</span>
                        <span className="settings-link" onClick={() => navigateTo('thresholds')}>Add/Edit Thresholds</span>
                    </div>

                    <div className="settings-section">
                        <span className="section-label-green">Structure</span>
                        <span className="settings-link">Edit Area and Address</span>
                        <span className="settings-link">Rename Houses</span>
                        <span className="settings-link">Change Rows Names or Statuses</span>
                        <span className="settings-link">Change Sections Names or Colours</span>
                    </div>

                    <div className="settings-section">
                        <span className="section-label-green">Utility</span>
                        <span className="settings-link">Archive {greenhouse.name}</span>
                        <span className="settings-link">Delete {greenhouse.name}</span>
                    </div>
                </div>

                <div className="sidebar-footer">
                    <button className="done-btn" onClick={() => navigate('/greenhouses')}>DONE</button>
                </div>
            </div>

            <div className="settings-main">
                <div className="north-arrow-fixed">
                    <span className="arrow-tip">▲</span>
                    <span className="arrow-n">N</span>
                </div>

                <div className="map-card-canvas">
                    {zones.map((zone) => (
                        <div key={zone.id} className="map-zone-v">
                            <div className="col-guide-top">
                                <span>1</span>
                                <span>→</span>
                                <span>20</span>
                            </div>
                            <div className="zone-rows-v">
                                {zone.rows.map((row) => (
                                    <div key={row.number} className="row-item-v">
                                        <div className="row-v-num">{row.number}</div>
                                        <div className="row-v-bar">
                                            {row.hasMarker && (
                                                <div
                                                    className="sticky-card-marker"
                                                    style={{
                                                        position: 'absolute',
                                                        width: '12px',
                                                        height: '18px',
                                                        background: 'rgba(255, 255, 255, 0.4)',
                                                        border: '1px solid rgba(255, 255, 255, 0.8)',
                                                        borderRadius: '2px',
                                                        left: '60%',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)'
                                                    }}
                                                ></div>
                                            )}
                                            <div className="plant-label-tag">
                                                <span className="plant-ico-s">🍅</span>
                                                <span>{row.plant}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="col-guide-top" style={{ borderTop: '1px dashed #ced4da', borderBottom: 'none', marginTop: '5px' }}>
                                <span>1</span>
                                <span>→</span>
                                <span>20</span>
                            </div>
                            <div className="zone-v-label">{zone.id}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
