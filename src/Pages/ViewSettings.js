import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SAMPLE_GREENHOUSES } from "../Data/greenhouseData";
import { supabase } from "../DataBase/supabaseClient";
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
    const [greenhouse, setGreenhouse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmAction, setConfirmAction] = useState(null);

    useEffect(() => {
        fetchGreenhouse();
    }, [id]);

    const fetchGreenhouse = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("greenhouses")
                .select("id, name, address, status, total_rows, lastWeekScouted, observations")
                .eq("id", id)
                .single();

            if (error) {
                const sample = SAMPLE_GREENHOUSES.find((g) => g.id === parseInt(id));
                setGreenhouse(sample);
            } else {
                setGreenhouse(data);
            }
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    const handleArchive = async () => {
        try {
            const { error } = await supabase
                .from("greenhouses")
                .update({ status: 'archived' })
                .eq("id", id)
                .select('id');

            if (error) throw error;
            alert(`${greenhouse.name} has been archived.`);
            navigate('/greenhouses');
        } catch (err) {
            alert("Failed to archive greenhouse. Please try again.");
        }
    };

    const handleDelete = async () => {
        try {
            const { error } = await supabase
                .from("greenhouses")
                .delete()
                .eq("id", id);

            if (error) throw error;
            alert(`${greenhouse.name} has been deleted.`);
            navigate('/greenhouses');
        } catch (err) {
            alert("Failed to delete greenhouse. Please try again.");
        }
    };

    const totalRows = greenhouse?.totalRows || greenhouse?.total_rows || 45;

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
                    hasMarker: (zStartRow + j) % 15 === 0
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
                        <span className="settings-link" onClick={() => navigateTo('area')}>Edit Area and Address</span>
                        <span className="settings-link" onClick={() => navigateTo('houses')}>Rename Houses</span>
                        <span className="settings-link" onClick={() => navigateTo('rows')}>Change Rows Names or Statuses</span>
                        <span className="settings-link" onClick={() => navigateTo('sections')}>Change Sections Names or Colours</span>
                    </div>

                    <div className="settings-section">
                        <span className="section-label-green">Utility</span>
                        <span className="settings-link" onClick={() => setConfirmAction('archive')}>Archive {greenhouse.name}</span>
                        <span className="settings-link delete-link" onClick={() => setConfirmAction('delete')}>Delete {greenhouse.name}</span>
                    </div>

                    {confirmAction && (
                        <div className="confirm-modal-overlay">
                            <div className="confirm-modal">
                                <h3>{confirmAction === 'archive' ? 'Archive' : 'Delete'} Greenhouse?</h3>
                                <p>
                                    Are you sure you want to {confirmAction} <strong>{greenhouse.name}</strong>?
                                    {confirmAction === 'delete' ? ' This action cannot be undone.' : ' You can still access archived greenhouses from the settings.'}
                                </p>
                                <div className="modal-actions">
                                    <button className="cancel-btn" onClick={() => setConfirmAction(null)}>Cancel</button>
                                    <button
                                        className={`confirm-btn ${confirmAction === 'delete' ? 'delete' : 'archive'}`}
                                        onClick={confirmAction === 'archive' ? handleArchive : handleDelete}
                                    >
                                        {confirmAction === 'archive' ? 'Archive' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="sidebar-footer-settings">
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
