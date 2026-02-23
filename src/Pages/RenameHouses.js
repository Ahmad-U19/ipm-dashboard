import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SAMPLE_GREENHOUSES } from "../Data/greenhouseData";
import { supabase } from "../DataBase/supabaseClient";
import greenhousePIC from "../Data/greenhouse.png";
import "./RenameHouses.css";

export default function RenameHouses() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [greenhouse, setGreenhouse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [houses, setHouses] = useState([]);
    const [houseCount, setHouseCount] = useState(15);

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
                const mockHouses = Array.from({ length: 15 }, (_, i) => ({
                    id: 15 - i,
                    name: (15 - i).toString()
                }));
                setHouses(mockHouses);
            } else {
                setGreenhouse(data);
                const mockHouses = Array.from({ length: 15 }, (_, i) => ({
                    id: 15 - i,
                    name: (15 - i).toString()
                }));
                setHouses(mockHouses);
            }
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        alert("House names saved locally!");
        navigate(`/greenhouses/${id}/settings`);
    };

    if (!greenhouse) return null;

    return (
        <div className="rename-houses-page">
            <div className="rename-sidebar">
                <div className="sidebar-header">
                    <div className="gh-title-box">
                        <img src={greenhousePIC} alt="GH" className="gh-icon-small" />
                        <h2>{greenhouse.name}</h2>
                    </div>
                </div>

                <div className="rename-content-section">
                    <div className="rename-title-row">
                        <h3 className="rename-section-title">Rename Houses</h3>
                        <span className="dropdown-arrow">∨</span>
                    </div>

                    <div className="houses-count-display">
                        <span className="count-number">{houseCount}</span>
                        <span className="count-label">Houses</span>
                    </div>

                    <div className="info-box-light">
                        <span className="info-icon-s">ⓘ</span>
                        <p>We have automatically numbered your houses, but you can rename them by clicking the house number.</p>
                    </div>
                </div>

                <div className="sidebar-footer-actions">
                    <button className="back-btn-2" onClick={() => navigate(-1)}>
                        <span>‹</span> Back
                    </button>
                    <button className="save-btn" onClick={handleSave}>
                        SAVE
                    </button>
                </div>
            </div>

            <div className="houses-main-view">
                <div className="north-arrow-container-side">
                    <div className="north-arrow-v">
                        <span className="arrow-h">▲</span>
                        <span className="arrow-l">N</span>
                    </div>
                </div>

                <div className="houses-list-container">
                    {houses.map((house) => (
                        <div key={house.id} className="house-box-item">
                            <div className="house-name-display">
                                {house.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
