import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../DataBase/supabaseClient";
import { SAMPLE_GREENHOUSES } from "../Data/greenhouseData";
import greenhousePIC from "../Data/greenhouse.png";
import "./editStickyCards.css";

export default function EditStickyCards() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [greenhouse, setGreenhouse] = useState(null);
    const [loading, setLoading] = useState(true);

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

    // Dummy data for sidebar rows as seen in screenshot
    const stickyData = [
        { row: 92, count: 19 },
        { row: 94, count: 10 },
        { row: 96, count: 2 },
    ];

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
                    hasMarker: (zStartRow + j) === 15 || (zStartRow + j) === 32 // Add some dummy markers
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

    const handleSave = () => {
        alert("Sticky cards updated successfully!");
        navigate(-1);
    };

    return (
        <div className="edit-sticky-cards-page">
            <div className="sticky-sidebar">
                <div className="sidebar-header">
                    <img src={greenhousePIC} alt="Greenhouse" className="gh-icon-small" />
                    <h2>{greenhouse.name}</h2>
                </div>

                <div className="sticky-cards-form">
                    <h3 className="title">Settings - Edit Sticky Cards</h3>

                    <div className="info-message">
                        <span className="info-icon">ⓘ</span>
                        <div className="info-text">
                            Add empty Sticky Cards to Rows by hovering over the Row and clicking the appropriate area.
                        </div>
                    </div>

                    <div className="bay-section">
                        <span className="bay-title">Bay 1</span>
                        <div className="card-list">
                            {stickyData.map((item) => (
                                <div key={item.row} className="card-item">
                                    <span className="row-label">Row {item.row}</span>
                                    <div className="sticky-card-box">
                                        <span className="card-icon">📇</span>
                                    </div>
                                    <span className="card-count">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
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
                                            {row.hasMarker && (
                                                <div
                                                    className="sticky-card-marker"
                                                    style={{ left: '60%' }}
                                                ></div>
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
