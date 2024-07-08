// components/FileInput.js
import React from 'react';
import './FileInput.css';

const FileInput = ({ onChange }) => {
    return (
        <label className="uploadButton mb-2 shadow-lg rounded-sm">
            <input
                type="file"
                accept="image/*"
                onChange={onChange}
                className="hidden"
            />
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            </svg>
        </label>
    );
};

export default FileInput;