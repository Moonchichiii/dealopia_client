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

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      // Prevent scrolling of the body when modal is open
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  // Set browser state on mount
  useEffect(() => {
    setIsBrowser(true);
    
    // Reset closing state when modal opens
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  // Size classes mapping
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  // Position classes mapping
  const positionClasses = {
    center: 'items-center',
    top: 'items-start pt-16',
  };

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      onClose();
    }, 200); // Match this with the transition duration
  };

  if (!isBrowser || !isOpen) {
    return null;
  }

  const modalContent = (
    <div 
      className={cn(
        "fixed inset-0 z-[1001] flex justify-center transition-opacity duration-200 ease-in-out",
        positionClasses[position],
        isClosing ? "opacity-0" : "opacity-100",
        overlayClassName
      )}
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
      />
      
      {/* Modal container */}
      <div 
        className={cn(
          "relative z-10 w-full p-4 md:p-6 transition-all duration-200 transform",
          sizeClasses[size],
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal content */}
        <div className={cn(
          "bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden",
          contentClassName
        )}>
          {/* Modal header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                {title && (
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {description}
                  </p>
                )}
              </div>
              
              {showCloseButton && (
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
          
          {/* Modal body */}
          <div className="px-6 py-4">
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