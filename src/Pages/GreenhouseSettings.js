import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import greenhousePIC from '../Data/greenhouse.png';
import './settings.css';

const GreenhouseSettings = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: 'North Tom Z4 - 2025',
        address: '1414 Seacliff Drive, Kingsville, ON, Canada',
        size: '10',
        sizeUnit: 'Acres',
        status: 'Active'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Greenhouse Settings saved:', formData);
        navigate('/greenhouses');
    };

    return (
        <div className="settings-page">
            <div className="settings-header">
                <div className="header-title-section">
                    <div className="header-icon-container">
                        <img src={greenhousePIC} alt="Greenhouse" className="header-icon-2" />
                    </div>
                    <div>
                        <h2>Greenhouse Settings</h2>
                        <p className="muted">ID: {id}</p>
                    </div>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/greenhouses')}>
                    Back to Greenhouses
                </button>
            </div>

            <div className="settings-content">
                <form className="settings-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label>Greenhouse Name: <span className="required">*</span></label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Greenhouse Name"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Address: <span className="required">*</span></label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Address"
                            />
                        </div>

                        <div className="form-group">
                            <label>Size: <span className="required">*</span></label>
                            <input
                                type="number"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                placeholder="Size"
                            />
                        </div>

                        <div className="form-group">
                            <label>Unit: <span className="required">*</span></label>
                            <select name="sizeUnit" value={formData.sizeUnit} onChange={handleChange}>
                                <option value="Acres">Acres</option>
                                <option value="Hectares">Hectares</option>
                                <option value="Square Meters">Square Meters</option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label>Status: <span className="required">*</span></label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">
                            <span> Save Changes </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GreenhouseSettings;
