import React from 'react';

interface LogoButtonProps {
    onClick?: () => void;
}

const LogoButton: React.FC<LogoButtonProps> = ({ onClick }) => {
    return (
        <button className="logo-button" onClick={onClick}>
            <div className="logo-mark">D</div>
        </button>
    );
};

export default LogoButton;