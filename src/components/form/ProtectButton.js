import React, { useEffect, useRef, useState } from 'react';
import './ProtectButton.css';

const ProtectButton = ({ onClick }) => {
    const buttonRef = useRef(null);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        const button = buttonRef.current;
        let intervalId;

        const addHoverEffect = () => {
            button.classList.add('hover-effect');
            setTimeout(() => {
                if (!hover) {
                    button.classList.remove('hover-effect');
                }
            }, 1200); // Match the animation duration
        };

        addHoverEffect(); // Initial effect on render

        intervalId = setInterval(addHoverEffect, 3000);

        return () => {
            clearInterval(intervalId);
        };
    }, [hover]);

    const handleMouseEnter = () => {
        setHover(true);
        buttonRef.current.classList.add('hover-effect');
    };

    const handleMouseLeave = () => {
        setHover(false);
        buttonRef.current.classList.remove('hover-effect');
    };

    const handleMouseDown = () => {
        buttonRef.current.classList.add('click-effect');
    };

    const handleMouseUp = () => {
        buttonRef.current.classList.remove('click-effect');
    };

    return (
        <button
            ref={buttonRef}
            className="ui-btn"
            onClick={onClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <span>Protect</span>
        </button>
    );
};

export default ProtectButton;