import React from 'react';
import './LoadingIndicator.css';

const LoadingIndicator = () => (
    <div className="loading-overlay">
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">👇 Protecting your image...</p>
        </div>
    </div>
);

export default LoadingIndicator;