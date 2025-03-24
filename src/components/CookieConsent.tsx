import { FC, useState, useEffect } from 'react';
import CookieConsentBanner from 'react-cookie-consent';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const CookieConsent: FC = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update isMobile state when window resizes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AnimatePresence>
      <CookieConsentBanner
        location={isMobile ? "top" : "bottom"}
        buttonText={t('cookies.accept')}
        declineButtonText={t('cookies.decline')}
        cookieName="dealopia-cookie-consent"
        overlay={false}
        enableDeclineButton
        flipButtons
        extraCookieOptions={{ path: '/' }}
        style={{
          background: "rgba(12, 10, 9, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(139, 92, 246, 0.2)",
          position: "fixed",
          zIndex: 40,
          padding: "1rem",
          margin: "1rem",
          width: "calc(100% - 2rem)",
          maxWidth: "600px",
          borderRadius: "1rem",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
          transform: isMobile ? "none" : "translateX(-50%)",
          left: isMobile ? "0" : "50%",
          right: isMobile ? "0" : "auto",
          bottom: isMobile ? "auto" : "1rem",
          top: isMobile ? "1rem" : "auto",
        }}
        buttonStyle={{
          background: "#8b5cf6",
          color: "white",
          borderRadius: "0.75rem",
          padding: "0.75rem 1.25rem",
          border: "none",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "0.875rem",
          transition: "background-color 0.2s",
          flex: "1 1 auto",
          minWidth: "120px",
        }}
        declineButtonStyle={{
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(139, 92, 246, 0.2)",
          color: "#d4d4d4",
          borderRadius: "0.75rem",
          padding: "0.75rem 1.25rem",
          cursor: "pointer",
          fontWeight: "500",
          fontSize: "0.875rem",
          transition: "background-color 0.2s",
          flex: "1 1 auto",
          minWidth: "120px",
        }}
        contentStyle={{
          margin: "0 0 1.25rem",
          padding: "0",
          fontSize: "0.875rem",
          lineHeight: "1.5",
          color: "white",
        }}
        buttonWrapperClasses="flex flex-col sm:flex-row gap-3 w-full"
        expires={365}
        onAccept={() => {
          console.log('Cookies accepted');
        }}
        onDecline={() => {
          console.log('Cookies declined');
        }}
      >
        <div className="relative pr-5">
          <button 
            onClick={() => {
              document.querySelector('.CookieConsent')?.remove();
            }}
            className="absolute -top-2 -right-2 text-gray-400 hover:text-white bg-black/30 hover:bg-black/50 rounded-full p-1 transition-colors"
            aria-label="Close cookie notice"
          >
            <X size={16} />
          </button>
          <h4 className="text-primary-400 font-semibold text-base mb-1">
            {t('cookies.title', 'Cookie Settings')}
          </h4>
          <p className="mb-2 text-gray-200">
            {t('cookies.message')}
          </p>
          <p className="text-xs text-gray-400 leading-tight">
            Accepting cookies helps us personalize sustainable deals for you and improve your eco-friendly shopping experience.
          </p>
        </div>
      </CookieConsentBanner>
    </AnimatePresence>
  );
};

export default CookieConsent;