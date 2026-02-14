import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import greenhousePIC from '../Data/greenhouse.png';
import './greenhouse.css';

const GreenhouseApplications = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="greenhouse-page">
            <div className="greenhouse-header">
                <div className="header-left">
                    <div className="header-title-section">
                        <img src={greenhousePIC} alt="Greenhouse" className="header-icon" />
                        <div>
                            <h2>Applications</h2>
                            <p className="muted">Greenhouse ID: {id}</p>
                        </div>
                    </div>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/greenhouses')}>
                    Back to Greenhouses
                </button>
            </div>

            <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                <h3 style={{ color: '#2c323b', marginBottom: '16px' }}>Greenhouse Applications</h3>
                <p style={{ color: '#6b7280', maxWidth: '500px', margin: '0 auto' }}>
                    This section will display all applications, sprays, and treatments scheduled or completed for this greenhouse.
                </p>
                <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="card" style={{ padding: '20px', background: '#f8fafc' }}>
                        <h4>Active Spray Programs</h4>
                        <p className="muted">None scheduled</p>
                    </div>
                    <div className="card" style={{ padding: '20px', background: '#f8fafc' }}>
                        <h4>Completed Applications</h4>
                        <p className="muted">View history</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GreenhouseApplications;
