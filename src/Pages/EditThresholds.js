import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../DataBase/supabaseClient";
import { SAMPLE_GREENHOUSES } from "../Data/greenhouseData";
import greenhousePIC from "../Data/greenhouse.png";
import "./editThresholds.css";

const PESTS = [
    { id: "Bm", name: "Broad Mite", icon: "🕷️", defaultLow: 2, defaultMed: 1, defaultHigh: 0.5 },
    { id: "Th", name: "Thrips", icon: "🪰", defaultLow: 2, defaultMed: 1, defaultHigh: 0.5 },
    { id: "Wf", name: "Whitefly", icon: "🦋", defaultLow: 2, defaultMed: 1, defaultHigh: 0.5 },
    { id: "Aph", name: "Aphids", icon: "🦗", defaultLow: 2, defaultMed: 1, defaultHigh: 0.5 },
    { id: "Fg", name: "Fungus Gnat", icon: "🦟", defaultLow: 2, defaultMed: 1, defaultHigh: 0.5 },
    { id: "Sf", name: "Shore Fly", icon: "🪰", defaultLow: 2, defaultMed: 1, defaultHigh: 0.5 },
];

const DISEASES = [
    { id: "Ber", name: "Blossom End ROT", icon: "🍎", defaultLow: 2, defaultMed: 1, defaultHigh: 0.5 },
    { id: "Wi", name: "Wilting", icon: "🥀", defaultLow: 2, defaultMed: 1, defaultHigh: 0.5 },
    { id: "Rr", name: "Pythium Root Rot", icon: "🌱", defaultLow: 2, defaultMed: 1, defaultHigh: 0.5 },
    { id: "Pm", name: "Powdery Mildew", icon: "🍄", defaultLow: 2, defaultMed: 1, defaultHigh: 0.5 },
    { id: "Blr", name: "Blotchy Rippening", icon: "🍅", defaultLow: 2, defaultMed: 1, defaultHigh: 0.5 },
];

export default function EditThresholds() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [greenhouse, setGreenhouse] = useState(null);
    const [loading, setLoading] = useState(true);

    const [pestSearch, setPestSearch] = useState("");
    const [diseaseSearch, setDiseaseSearch] = useState("");

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

    if (loading) return <div className="edit-thresholds-page">Loading...</div>;
    if (!greenhouse) return <div className="edit-thresholds-page">Greenhouse not found</div>;

    const handleSave = () => {
        alert("Thresholds updated successfully!");
        navigate(-1);
    };

    const ThresholdCard = ({ item, isDisease }) => (
        <div className="threshold-card">
            <div className={`card-header ${isDisease ? 'disease' : ''}`}>
                <div className="card-title-box">
                    <div className={`card-icon-small ${isDisease ? 'disease' : ''}`}>
                        {item.id}
                    </div>
                    <h4>{item.name}</h4>
                </div>
                <div className="toggle-group on">
                    <span>Off</span>
                    <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                    </label>
                    <span>On</span>
                </div>
            </div>

            <div className="threshold-levels">
                {['Low', 'Med', 'High'].map((level, idx) => (
                    <div key={level} className="level-item">
                        <div className="level-header">
                            <div className="toggle-group on">
                                <span>Off</span>
                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                                <span>On</span>
                            </div>
                            <span className="level-name">{level}</span>
                        </div>

                        <div className="warn-box">
                            <span className="warn-label">Warn after</span>
                            <div className={`warn-input-container ${level.toLowerCase()}`}>
                                <input
                                    type="text"
                                    defaultValue={level === 'Low' ? item.defaultLow : level === 'Med' ? item.defaultMed : item.defaultHigh}
                                />
                                <span className="percent-label">%</span>
                            </div>
                            <span className="density-label">Density</span>
                        </div>

                        <div className="level-stats">
                            <span className="stat-val">{level === 'Low' ? 36 : level === 'Med' ? 18 : 9}</span>
                            <span className="stat-obs">Observations</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card-footer">
                Week 31 (Jul 31, '25) by Rashid Idrees
            </div>
        </div>
    );

    return (
        <div className="edit-thresholds-page">
            <div className="thresholds-sidebar">
                <div className="sidebar-content">
                    <div className="gh-info-card">
                        <div className="gh-header-small">
                            <img src={greenhousePIC} alt="Greenhouse" className="gh-icon-small" />
                            <h2>{greenhouse.name}</h2>
                        </div>
                        <div className="gh-details-list">
                            <p><span>Created:</span> Week 31 (Jul 31, '25)</p>
                            <p><span>Area:</span> 45 Rows (1.5 Acres)</p>
                            <p><span>Structure:</span> 20 Sections, 2 Sides per Row</p>
                            <p><span>Observations:</span> 1,800 possible (per pest)</p>
                        </div>
                    </div>

                    <span className="section-title">Settings - Action Thresholds</span>
                    <div className="action-thresholds-info">
                        Action Thresholds help you set a point at which pests pressures trigger a threshold warning.
                        <br /><br />
                        Set the % of greenhouse density (% of pressures observed vs. total possible observations) for each pest. For instance, at 200 Rows and with 8 tables on each side there are 3,200 total observations possible for each pest. A pressure level with a 50% threshold would trigger a warning after 1,600 observations.
                        <br /><br />
                        Entering a value of 0% will cause a threshold warning after only a single observation.
                    </div>

                    <div className="quick-access-section">
                        <span className="quick-access-title">Quick Access</span>
                        <div className="action-thresholds-info">
                            ⓘ Set the most common pests & diseases for quick access in the scouting app.
                        </div>

                        <div className="search-dropdown">
                            <label className="warn-label">Pests:</label>
                            <div className="search-input-box">
                                <input
                                    type="text"
                                    placeholder="Select..."
                                    value={pestSearch}
                                    onChange={(e) => setPestSearch(e.target.value)}
                                />
                                <span>▼</span>
                            </div>
                        </div>

                        <div className="icon-grid">
                            {PESTS.filter(p => p.name.toLowerCase().includes(pestSearch.toLowerCase())).map(pest => (
                                <div key={pest.id} className="pest-icon-box">
                                    <span className="icon-img">{pest.icon}</span>
                                    <span className="icon-label">{pest.name}</span>
                                </div>
                            ))}
                        </div>

                        <div className="search-dropdown">
                            <label className="warn-label">Diseases:</label>
                            <div className="search-input-box">
                                <input
                                    type="text"
                                    placeholder="Select..."
                                    value={diseaseSearch}
                                    onChange={(e) => setDiseaseSearch(e.target.value)}
                                />
                                <span>▼</span>
                            </div>
                        </div>

                        <div className="icon-grid">
                            {DISEASES.filter(d => d.name.toLowerCase().includes(diseaseSearch.toLowerCase())).map(disease => (
                                <div key={disease.id} className="pest-icon-box disease">
                                    <span className="icon-img">{disease.icon}</span>
                                    <span className="icon-label">{disease.name}</span>
                                </div>
                            ))}
                        </div>

                        <div className="action-thresholds-info">
                            ⓘ Pests / Diseases with observations cannot be removed.
                        </div>
                    </div>
                </div>

                <div className="sidebar-footer-2">
                    <button className="back-btn-outline" onClick={() => navigate(-1)}>‹ BACK</button>
                    <button className="save-btn-green" onClick={handleSave}>SAVE</button>
                </div>
            </div>

            <div className="thresholds-main">
                {PESTS.map(pest => (
                    <ThresholdCard key={pest.id} item={pest} isDisease={false} />
                ))}
                {DISEASES.map(disease => (
                    <ThresholdCard key={disease.id} item={disease} isDisease={true} />
                ))}
            </div>
        </div>
    );
}
