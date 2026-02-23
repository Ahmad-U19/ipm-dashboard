import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SAMPLE_GREENHOUSES } from "../Data/greenhouseData";
import { supabase } from "../DataBase/supabaseClient";
import greenhousePIC from "../Data/greenhouse.png";
import "./EditAreaAddress.css";

export default function EditAreaAddress() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [greenhouse, setGreenhouse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [area, setArea] = useState("1.5");
    const [address, setAddress] = useState("1414 Seacliff Drive, Kingsville, ON, Canada");

    useEffect(() => {
        fetchGreenhouse();
    }, [id]);

    const fetchGreenhouse = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("greenhouses")
                .select("id, name, address, status, total_rows")
                .eq("id", id)
                .single();

            if (error) {
                const sample = SAMPLE_GREENHOUSES.find((g) => g.id === parseInt(id));
                setGreenhouse(sample);
                if (sample) {
                    setAddress(sample.address || "");
                    setArea("1.5");
                }
            } else {
                setGreenhouse(data);
                setAddress(data.address || "");
                setArea(data.area ? parseFloat(data.area) : "1.5");
            }
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        alert("Changes saved locally! (Supabase update restricted in this demo)");
        navigate(`/greenhouses/${id}/settings`);
    };

    if (!greenhouse) return null;

    return (
        <div className="edit-area-address-page">
            <div className="edit-sidebar">
                <div className="sidebar-header">
                    <div className="gh-title-box">
                        <img src={greenhousePIC} alt="GH" className="gh-icon-small" />
                        <h2>{greenhouse.name}</h2>
                    </div>
                </div>

                <div className="details-form-section">
                    <h3 className="section-title">Greenhouse Details</h3>

                    <div className="form-group">
                        <label>Area (Acres) <span className="required">*</span></label>
                        <input
                            type="text"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Address <span className="required">*</span></label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter address..."
                        />
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

            <div className="map-view-container">
                <div className="google-map-mock">
                    <div className="map-controls-top">
                        <button className="map-type-btn active">Map</button>
                        <button className="map-type-btn">Satellite</button>
                    </div>

                    <div className="map-placeholder-bg">
                        <iframe
                            title="Google Map"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight="0"
                            marginWidth="0"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        ></iframe>
                    </div>

                    <div className="map-controls-bottom">
                        <div className="zoom-controls">
                            <button>+</button>
                            <button>−</button>
                        </div>
                        <div className="street-view-icon">
                            👤
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
