import React, { useState, useEffect } from 'react';
import { supabase } from '../DataBase/supabaseClient';
import './settings.css';
import suitcaseIcon from '../Data/settings.png';

const BusinessSettings = () => {
    const [formData, setFormData] = useState({
        bays: 'Bays',
        rows: 'Rows',
        posts: 'Posts',
        plants: 'Plants',
        actionThresholds: true,
        greenhouseArea: 'Acres',
        coverageArea: 'Square Meters',
        temperature: 'Celcius',
        windSpeed: 'Kilometers per hour'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('global_settings')
                .select('key, value')
                .in('key', [
                    'bays', 'rows', 'posts', 'plants', 'actionThresholds',
                    'greenhouseArea', 'coverageArea', 'temperature', 'windSpeed'
                ]);

            if (error) {
            } else if (data && data.length > 0) {
                const newSettings = { ...formData };
                data.forEach(item => {
                    newSettings[item.key] = item.key === 'actionThresholds'
                        ? (item.value === 'true' || item.value === true)
                        : item.value;
                });
                setFormData(newSettings);
            }
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updates = Object.keys(formData).map(key => ({
                key,
                value: String(formData[key])
            }));

            const { error } = await supabase
                .from('global_settings')
                .upsert(updates, { onConflict: 'key' });

            if (error) throw error;
            alert('Business Settings saved successfully!');
        } catch (err) {
            alert('Error saving settings: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="settings-page">Loading...</div>;

    return (
        <div className="settings-page">
            <div className="settings-header">
                <div className="header-title-section">
                    <div className="header-icon-container">
                        <img src={suitcaseIcon} alt="Business" className="header-icon" />
                    </div>
                    <h2>Edit Business Settings</h2>
                </div>
            </div>

            <div className="settings-content">
                <form className="settings-form" onSubmit={handleSubmit}>
                    <div className="settings-section">
                        <h3 className="section-title">Greenhouse Terminology</h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Bays: <span className="required">*</span></label>
                                <select name="bays" value={formData.bays} onChange={handleChange}>
                                    <option value="Bays">Bays</option>
                                    <option value="Zones">Zones</option>
                                    <option value="Sections">Sections</option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label>Rows: <span className="required">*</span></label>
                                <select name="rows" value={formData.rows} onChange={handleChange}>
                                    <option value="Rows">Rows</option>
                                    <option value="Lines">Lines</option>
                                    <option value="Aisles">Aisles</option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label>Posts: <span className="required">*</span></label>
                                <select name="posts" value={formData.posts} onChange={handleChange}>
                                    <option value="Posts">Posts</option>
                                    <option value="Columns">Columns</option>
                                    <option value="Supports">Supports</option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label>Plants: <span className="required">*</span></label>
                                <select name="plants" value={formData.plants} onChange={handleChange}>
                                    <option value="Plants">Plants</option>
                                    <option value="Crops">Crops</option>
                                    <option value="Items">Items</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="settings-section">
                        <div className="toggle-group">
                            <label className="toggle-label">Enable Action Thresholds</label>
                            <div className="toggle-container">
                                <span className={!formData.actionThresholds ? 'active' : ''}>Off</span>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        name="actionThresholds"
                                        checked={formData.actionThresholds}
                                        onChange={handleChange}
                                    />
                                    <span className="slider round"></span>
                                </label>
                                <span className={formData.actionThresholds ? 'active' : ''}>On</span>
                            </div>
                        </div>
                    </div>

                    <div className="settings-section">
                        <h3 className="section-title">Units Of Measurement</h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Greenhouse Area: <span className="required">*</span></label>
                                <select name="greenhouseArea" value={formData.greenhouseArea} onChange={handleChange}>
                                    <option value="Acres">Acres</option>
                                    <option value="Hectares">Hectares</option>
                                    <option value="Square Meters">Square Meters</option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label>Coverage Area: <span className="required">*</span></label>
                                <select name="coverageArea" value={formData.coverageArea} onChange={handleChange}>
                                    <option value="Square Meters">Square Meters</option>
                                    <option value="Square Feet">Square Feet</option>
                                    <option value="Acres">Acres</option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label>Temperature: <span className="required">*</span></label>
                                <select name="temperature" value={formData.temperature} onChange={handleChange}>
                                    <option value="Celcius">Celcius</option>
                                    <option value="Fahrenheit">Fahrenheit</option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label>Wind Speed: <span className="required">*</span></label>
                                <select name="windSpeed" value={formData.windSpeed} onChange={handleChange}>
                                    <option value="Kilometers per hour">Kilometers per hour</option>
                                    <option value="Miles per hour">Miles per hour</option>
                                    <option value="Meters per second">Meters per second</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn" disabled={saving}>
                            <span> {saving ? 'Saving...' : 'Save Changes'} </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BusinessSettings;
