import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Apple } from 'lucide-react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    eventId: string;
}

// Move outside component to avoid recreating on each render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
};

export default function PaymentModal({ isOpen, onClose, amount, eventId }: PaymentModalProps) {
    const handleStripePayment = async () => {
        try {
            const stripe = await stripePromise;
            if (!stripe) throw new Error('Stripe failed to load');

            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventId,
                    amount,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const session = await response.json();
            
            const result = await stripe.redirectToCheckout({
                sessionId: session.id,
            });

            if (result.error) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Payment error:', error instanceof Error ? error.message : String(error));
            // Consider adding user-facing error handling here
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={overlayVariants}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onClose}
                        aria-hidden="true"
                    />
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={modalVariants}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="payment-modal-title"
                    >
                        <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6">
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                aria-label="Close payment modal"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            
                            <div className="mb-6">
                                <h2 
                                    id="payment-modal-title"
                                    className="text-2xl font-display font-bold text-gray-900 dark:text-white"
                                >
                                    Complete Payment
                                </h2>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    Choose your preferred payment method
                                </p>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleStripePayment}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                                    type="button"
                                >
                                    <CreditCard className="h-5 w-5" aria-hidden="true" />
                                    <span>Pay with Card</span>
                                </button>

                                <button
                                    onClick={handleStripePayment}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
                                    type="button"
                                >
                                    <Apple className="h-5 w-5" aria-hidden="true" />
                                    <span>Pay with Apple Pay</span>
                                </button>

                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-2 bg-white dark:bg-gray-900 text-sm text-gray-500">
                                            Secure payment powered by Stripe
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}