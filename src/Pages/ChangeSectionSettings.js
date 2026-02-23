import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SAMPLE_GREENHOUSES } from "../Data/greenhouseData";
import { supabase } from "../DataBase/supabaseClient";
import greenhousePIC from "../Data/greenhouse.png";
import "./changeSectionSettings.css";

export default function ChangeSectionSettings() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [greenhouse, setGreenhouse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sectionsCount] = useState(20);

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
                    sections: Array.from({ length: 20 }, (_, k) => k + 1)
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
        alert("Section settings saved!");
        navigate(`/greenhouses/${id}/settings`);
    };

    if (!greenhouse) return null;

    return (
        <div className="change-sections-page">
            <div className="sections-sidebar">
                <div className="sidebar-header">
                    <div className="gh-title-box">
                        <img src={greenhousePIC} alt="GH" className="gh-icon-small" />
                        <h2>{greenhouse.name}</h2>
                    </div>
                </div>

                <div className="sections-content-section">
                    <h3 className="sections-section-title">Change Section Names or Colours</h3>

                    <div className="sections-count-display">
                        <span className="count-number">20</span>
                        <span className="count-label">Sections From Aisle to Wall</span>
                    </div>

                    <div className="info-msg">
                        <span className="info-icon">ⓘ</span>
                        <p>We have automatically named your sections, but you can rename them by clicking the letters at the bottom of the screen.</p>
                    </div>

                    <div className="info-msg">
                        <span className="info-icon">ⓘ</span>
                        <p>You can also assign color to a section by clicking the icon.</p>
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

            <div className="sections-main-view">
                <div className="north-arrow-container-side">
                    <div className="north-arrow-v">
                        <span className="arrow-h">▲</span>
                        <span className="arrow-l">N</span>
                    </div>
                </div>

                <div className="sections-map-area">
                    <div className="sections-scroll-canvas">
                        {zones.map((zone) => (
                            <div key={zone.id} className="zone-group-sections">
                                <div className="zone-rows-sections">
                                    {zone.rows.map((row) => (
                                        <div key={row.number} className="row-item-sections">
                                            <div className="row-num-label">{row.number}</div>
                                            <div className="row-segments-container">
                                                <div className="segment-markers-top">
                                                    <span>1</span>
                                                    <span>→</span>
                                                    <span>20</span>
                                                </div>
                                                <div className="row-bar-segments">
                                                    {Array.from({ length: 20 }).map((_, idx) => (
                                                        <div key={idx} className="segment-block"></div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="zone-side-indicator">{zone.id}</div>
                            </div>
                        ))}
                    </div>

                    <div className="sections-bottom-editor">
                        <div className="editor-grid">
                            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                                <div key={num} className="editor-item">
                                    <div className="editor-num-box">{num}</div>
                                    <button className="color-pipette-btn">
                                        <span className="pipette-icon">💉</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="editor-green-underline"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
