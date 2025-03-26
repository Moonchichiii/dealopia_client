// src/contexts/PaymentModalContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import PaymentModal from '../components/PaymentModal';

interface PaymentModalContextType {
    openPaymentModal: (amount: number, eventId: string) => void;
    closePaymentModal: () => void;
}

const PaymentModalContext = createContext<PaymentModalContextType | undefined>(undefined);

export function PaymentModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState(0);
    const [eventId, setEventId] = useState('');

    const openPaymentModal = (amount: number, eventId: string) => {
        setAmount(amount);
        setEventId(eventId);
        setIsOpen(true);
    };

    const closePaymentModal = () => {
        setIsOpen(false);
    };

    return (
        <PaymentModalContext.Provider value={{ openPaymentModal, closePaymentModal }}>
            {children}
            <PaymentModal 
                isOpen={isOpen} 
                onClose={closePaymentModal} 
                amount={amount} 
                eventId={eventId} 
            />
        </PaymentModalContext.Provider>
    );
}

export function usePaymentModal() {
    const context = useContext(PaymentModalContext);
    if (context === undefined) {
        throw new Error('usePaymentModal must be used within a PaymentModalProvider');
    }
    return context;
}
