import React from 'react';

interface VerificationButtonProps {
    onClick: () => void;
    isLoading: boolean;
    disabled?: boolean;
}

const VerificationButton: React.FC<VerificationButtonProps> = ({ onClick, isLoading, disabled = false }) => {
    return (
        <button onClick={onClick} disabled={isLoading || disabled} className="verification-button">
            {isLoading ? 'Verifying...' : 'Verify'}
        </button>
    );
};

export default VerificationButton;