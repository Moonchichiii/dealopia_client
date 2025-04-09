import { FC, useState, useEffect } from 'react';
import CookieConsentBanner from 'react-cookie-consent';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Info } from 'lucide-react';

const CookieConsent: FC = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDecline = () => {
    console.log('Cookies declined');
    localStorage.setItem('dealopia-essential-only', 'true');
    setDeclined(true);
  };
 
  if (declined) {
    return (
      <div className="p-3 text-center bg-neutral-900">
        <p className="text-gray-200 mb-2">You've chosen to use only essential cookies.</p>
        <p className="text-xs text-gray-400">
          Some features like personalized deals and location-based recommendations may be limited.
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <CookieConsentBanner
        location={isMobile ? "top" : "bottom"}
        buttonText={t('cookies.accept')}
        declineButtonText={t('cookies.essentialOnly', 'Essential Only')}
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
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
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
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
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
          localStorage.setItem('dealopia-essential-only', 'false');
        }}
        onDecline={handleDecline}
      >
        <div className="relative pr-5">
          <button
            onClick={() => {          
              handleDecline();
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
            {t('cookies.message', 'We use cookies to enhance your experience and show you personalized sustainable deals.')}
          </p>
          <div className="mb-3">
            <button
              onClick={() => setShowMoreInfo(!showMoreInfo)}
              className="text-xs text-primary-400 flex items-center hover:underline"
            >
              <Info size={12} className="mr-1" />
              {showMoreInfo ? "Hide details" : "What if I choose 'Essential Only'?"}
            </button>
            {showMoreInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-3 bg-black/20 border border-neutral-800 rounded-lg text-xs"
              >
                <p className="text-gray-300 mb-2">If you choose "Essential Only":</p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>We'll only use cookies necessary for basic functionality</li>
                  <li>Location-based deal discovery will require manual input</li>
                  <li>Deal recommendations won't be personalized</li>
                  <li>Your search history won't be saved between sessions</li>
                  <li>You can change your preference at any time in Settings</li>
                </ul>
              </motion.div>
            )}
          </div>
          <p className="text-xs text-gray-400 leading-tight">
            We prioritize your privacy. Dealopia uses first-party cookies only to improve your eco-friendly shopping experience.
          </p>
        </div>
      </CookieConsentBanner>
    </AnimatePresence>
  );
};

export default CookieConsent;
