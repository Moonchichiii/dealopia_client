import React from 'react';
import './DealButton.css';

interface DealButtonProps {
    text: string;
    onClick: () => void;
    primary?: boolean;
}

const DealButton: React.FC<DealButtonProps> = ({ text, onClick, primary = false }) => {
    return (
        <button
            className={`deal-button ${primary ? 'deal-button-primary' : 'deal-button-secondary'}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default DealButton;