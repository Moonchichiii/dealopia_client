import React, { useState } from 'react';

interface AuthButtonProps {
    isLoggedIn: boolean;
    onSignOut: () => void;
    onSignIn: () => void;
    onSignUp: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ isLoggedIn, onSignOut, onSignIn, onSignUp }) => {
    return (
        <div>
            {isLoggedIn ? (
                <button className="btn btn-secondary" onClick={onSignOut}>
                    Sign Out
                </button>
            ) : (
                <>
                    <button className="btn btn-secondary" onClick={onSignIn}>
                        Sign In
                    </button>
                    <button className="btn btn-primary" onClick={onSignUp}>
                        Sign Up
                    </button>
                </>
            )}
        </div>
    );
};

export default AuthButton;