import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../../services/auth';
import { useMutation } from '@tanstack/react-query';

const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [verificationKey, setVerificationKey] = useState(searchParams.get('key') || '');
    const [error, setError] = useState<string | null>(null);

    const { mutate: verifyEmail, isLoading } = useMutation(authApi.verifyEmail, {
        onSuccess: () => {
            navigate('/login');
        },
        onError: (err: any) => {
            setError(err.response?.data?.detail || 'Verification failed. Please try again.');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (verificationKey) {
            verifyEmail(verificationKey);
        } else {
            setError('Verification key is required.');
        }
    };

    return (
        <div className="verify-email-container">
            <h1>Verify Your Email</h1>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={verificationKey}
                    onChange={(e) => setVerificationKey(e.target.value)}
                    placeholder="Enter verification key"
                    required
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify Email'}
                </button>
            </form>
        </div>
    );
};

export default VerifyEmail;
