import React, { useState } from 'react';
import './settings.css';
import suitcaseIcon from '../Data/settings.png';

const Settings = () => {
    const [formData, setFormData] = useState({
        businessName: 'Sunrite Greenhouse',
        address: '1478 Seacliff Drive, Kingsville ON N9Y 2M2',
        city: 'Kingsville',
        province: 'Ontario',
        country: 'Canada',
        postalCode: 'N9Y 2M2',
        email: 'rashidI@delfrescopure.com',
        phone: '(519) 816-2486',
        contactPerson: 'Rashid Idrees'
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
        console.log('Form submitted:', formData);
        // Add logic for saving settings
    };

    return (
        <div className="settings-page">
            <div className="settings-header">
                <div className="header-title-section">
                    <div className="header-icon-container">
                        <img src={suitcaseIcon} alt="Business" className="header-icon-2" />
                    </div>
                    <h2>Edit Business Profile</h2>
                </div>
            </div>

            <div className="settings-content">
                <form className="settings-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label>Business Name: <span className="required">*</span></label>
                            <input
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                placeholder="Business Name"
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
                            <label>City: <span className="required">*</span></label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                                readOnly
                            />
                        </div>

                        <div className="form-group">
                            <label>Province: <span className="required">*</span></label>
                            <input
                                type="text"
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                placeholder="Province"
                                readOnly
                            />
                        </div>

                        <div className="form-group">
                            <label>Country: <span className="required">*</span></label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Country"
                                readOnly
                            />
                        </div>

                        <div className="form-group">
                            <label>Postal Code:</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                placeholder="Postal Code"
                                readOnly
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Email Address: <span className="required">*</span></label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Phone: <span className="required">*</span></label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Contact Person: <span className="required">*</span></label>
                            <input
                                type="text"
                                name="contactPerson"
                                value={formData.contactPerson}
                                onChange={handleChange}
                                placeholder="Contact Person"
                            />
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

export default Settings;
