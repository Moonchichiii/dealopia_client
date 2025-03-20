import React from 'react';
import CookieConsentBanner from 'react-cookie-consent';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent: React.FC = () => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      <CookieConsentBanner
        location="bottom"
        buttonText={t('cookies.accept')}
        declineButtonText={t('cookies.decline')}
        cookieName="dealopia-cookie-consent"
        overlay={false}
        enableDeclineButton
        flipButtons
        style={{
          background: "rgba(12, 10, 9, 0.95)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          padding: "1rem",
          margin: 0,
          '@media (min-width: 640px)': {
            maxWidth: "400px",
            right: "20px",
            left: "auto",
            margin: "0 0 20px 0",
            borderRadius: "1rem",
            padding: "1.5rem",
          },
        }}
        buttonStyle={{
          background: "#843dff",
          color: "white",
          borderRadius: "0.5rem",
          padding: "0.5rem 1rem",
          border: "none",
          cursor: "pointer",
          fontWeight: "500",
          fontSize: "0.875rem",
          transition: "background-color 0.2s",
          flex: 1,
          '@media (min-width: 640px)': {
            padding: "0.75rem 1.5rem",
            flex: "none",
            width: "100%",
          },
        }}
        declineButtonStyle={{
          background: "transparent",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "white",
          borderRadius: "0.5rem",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          fontWeight: "500",
          fontSize: "0.875rem",
          transition: "background-color 0.2s",
          flex: 1,
          '@media (min-width: 640px)': {
            padding: "0.75rem 1.5rem",
            flex: "none",
            width: "100%",
          },
        }}
        contentStyle={{
          margin: "0 0 1rem",
          padding: "0",
          fontSize: "0.875rem",
          lineHeight: "1.4",
          '@media (min-width: 640px)': {
            margin: "0 0 1.5rem",
            lineHeight: "1.5",
          },
        }}
        buttonWrapperClasses="flex flex-row sm:flex-col gap-2 sm:gap-3"
        expires={365}
        onAccept={() => {
          // Enable necessary tracking
          console.log('Cookies accepted');
        }}
        onDecline={() => {
          // Disable tracking
          console.log('Cookies declined');
        }}
      >
        {t('cookies.message')}
      </CookieConsentBanner>
    </AnimatePresence>
  );
};

export default CookieConsent;