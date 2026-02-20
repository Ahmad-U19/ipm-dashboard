import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PlaceholderPage = ({ title }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>{title} Page</h2>
            <p>This page for Greenhouse ID: {id} is currently under development.</p>
            <button
                onClick={() => navigate(-1)}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    background: '#2dc55f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                }}
            >
                Back
            </button>
        </div>
    );
};

export default PlaceholderPage;
