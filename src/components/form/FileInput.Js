import React, { useState } from 'react';
import './FileInput.css';

const FileInput = ({ onChange }) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleMouseDown = () => {
        setIsClicked(true);
    };

    const handleMouseUp = () => {
        setIsClicked(false);
    };

    return (
        <label
            className="uploadButton mb-2 shadow-lg rounded-sm"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <input
                type="file"
                accept="image/*"
                onChange={onChange}
                className="hidden"
            />
            <svg
                className={`w-6 h-6 ${isClicked ? 'svg-clicked' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Upload File
        </label>
    );
};

export default FileInput;