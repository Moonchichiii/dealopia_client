import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    position?: 'center' | 'top';
    showCloseButton?: boolean;
    className?: string;
    contentClassName?: string;
    overlayClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'md',
    position = 'center',
    showCloseButton = true,
    className = '',
    contentClassName = '',
    overlayClassName = '',
}) => {
    const [isBrowser, setIsBrowser] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen]);

    useEffect(() => {
        setIsBrowser(true);
        
        if (isOpen) {
            setIsClosing(false);
        }
    }, [isOpen]);

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'w-[calc(100%-2rem)] sm:max-w-[calc(100%-4rem)]',
    };

    const positionClasses = {
        center: 'items-center',
        top: 'items-start pt-10 sm:pt-16',
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 250); 
    };

    if (!isBrowser || !isOpen) {
        return null;
    }

    const modalContent = (
        <div
            className={cn(
                "fixed inset-0 z-[1001] flex justify-center transition-all duration-250",
                positionClasses[position],
                isClosing ? "opacity-0" : "opacity-100",
                overlayClassName
            )}
            onClick={handleClose}
            aria-modal="true"
            role="dialog"
        >
            {/* Overlay backdrop with improved blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-[3px] transition-opacity duration-300"
                aria-hidden="true"
            />
            
            {/* Modal container with improved animation */}
            <div
                className={cn(
                    "relative z-10 w-full transition-all duration-250",
                    sizeClasses[size],
                    isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100",
                    position === 'center' ? "my-auto mx-4 sm:mx-auto" : "mt-4 mx-4 sm:mx-auto",
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal content with improved shadows and rounded corners */}
                <div className={cn(
                    "bg-white dark:bg-gray-800 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.12)] overflow-hidden border border-gray-100 dark:border-gray-700",
                    contentClassName
                )}>
                    {/* Close button positioned at the top right corner for better UX */}
                    {showCloseButton && (
                        <button
                            type="button"
                            onClick={handleClose}
                            className="absolute right-4 top-4 z-[2] p-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors shadow-sm"
                            aria-label="Close"
                        >
                            <X className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                    )}
                    
                    {/* Modal header with improved spacing */}
                    {(title || description) && (
                        <div className="px-5 sm:px-6 pt-6 pb-2">
                            {title && (
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {title}
                                </h3>
                            )}
                            {description && (
                                <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}
                    
                    {/* Modal body with improved padding */}
                    <div className="px-5 sm:px-6 py-4 sm:py-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        modalContent,
        document.getElementById('modal-root') as HTMLElement
    );
};

export default Modal;
