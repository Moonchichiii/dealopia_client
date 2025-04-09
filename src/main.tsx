import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// i18n configuration
import '@/i18n/config';

// Styles
import '@/globals.css';

import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
