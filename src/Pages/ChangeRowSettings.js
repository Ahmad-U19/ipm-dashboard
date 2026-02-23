import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SAMPLE_GREENHOUSES } from "../Data/greenhouseData";
import { supabase } from "../DataBase/supabaseClient";
import greenhousePIC from "../Data/greenhouse.png";
import "./changeRowSettings.css";

export default function ChangeRowSettings() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [greenhouse, setGreenhouse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeRowsCount, setActiveRowsCount] = useState(45);
    const [inactiveRowsCount, setInactiveRowsCount] = useState(0);

    useEffect(() => {
        fetchGreenhouse();
    }, [id]);

    const fetchGreenhouse = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("greenhouses")
                .select("*")
                .eq("id", (id))
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

    const totalRows = greenhouse?.totalRows || 45;

    const zones = useMemo(() => {
        const rowsPerZone = 11;
        const numZones = Math.ceil(totalRows / rowsPerZone);
        const generatedZones = [];

        for (let i = 1; i <= numZones; i++) {
            const zStartRow = (i - 1) * rowsPerZone + 1;
            const rowsInThisZone = Math.min(rowsPerZone, totalRows - zStartRow + 1);

            if (rowsInThisZone <= 0) continue;

            const rows = [];
            for (let j = 0; j < rowsInThisZone; j++) {
                rows.push({
                    number: zStartRow + j,
                    isActive: true
                });
            }
            generatedZones.push({
                id: i,
                rows: [...rows].reverse()
            });
        }
        return generatedZones.reverse();
    }, [totalRows]);

    const handleSave = () => {
        alert("Row settings saved!");
        navigate(`/greenhouses/${id}/settings`);
    };

    if (!greenhouse) return null;

    return (
        <div className="change-rows-page">
            <div className="rows-sidebar">
                <div className="sidebar-header">
                    <div className="gh-title-box">
                        <img src={greenhousePIC} alt="GH" className="gh-icon-small" />
                        <h2>{greenhouse.name}</h2>
                    </div>
                </div>

                <div className="rows-content-section">
                    <div className="rows-title-row">
                        <h3 className="rows-section-title">Rows</h3>
                        <span className="dropdown-arrow">∨</span>
                    </div>

                    <p className="subtitle-text">Change Row Names or Statuses</p>

                    <div className="status-counter-item">
                        <span className="count-num inactive">{inactiveRowsCount}</span>
                        <span className="count-text">Inactive Rows</span>
                    </div>

                    <div className="status-counter-item">
                        <span className="count-num active">{activeRowsCount}</span>
                        <span className="count-text">Active Rows</span>
                    </div>

                    <div className="info-msg">
                        <span className="info-icon">ⓘ</span>
                        <p>We have automatically numbered your rows, but you can rename them by clicking the row number.</p>
                    </div>

                    <div className="info-msg">
                        <span className="info-icon">ⓘ</span>
                        <p>You can also click a row to switch it between active and inactive.</p>
                    </div>
                </div>

                <div className="sidebar-footer-actions">
                    <button className="back-btn-2" onClick={() => navigate(-1)}>
                        <span>‹</span> BACK
                    </button>
                    <button className="save-btn" onClick={handleSave}>
                        SAVE
                    </button>
                </div>
            </div>

            <div className="rows-main-view">
                <div className="north-arrow-container-side">
                    <div className="north-arrow-v">
                        <span className="arrow-h">▲</span>
                        <span className="arrow-l">N</span>
                    </div>
                </div>

                <div className="rows-map-scroll">
                    {zones.map((zone) => (
                        <div key={zone.id} className="zone-group">
                            <div className="zone-rows">
                                {zone.rows.map((row) => (
                                    <div key={row.number} className="row-item-h">
                                        <div className="row-label-box">{row.number}</div>
                                        <div className={`row-bar-h ${row.isActive ? 'active' : 'inactive'}`}></div>
                                    </div>
                                ))}
                            </div>
                            <div className="zone-indicator">{zone.id}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
