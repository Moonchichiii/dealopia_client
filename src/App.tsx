import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import './i18n/config';

// Pages
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';

// Check if environment variables are defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables'
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60,
      retry: 3,
    },
  },
});

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-primary-950 via-stone-950 to-accent-950 animate-gradient-xy">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.015] pointer-events-none"></div>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Routes>
          <Footer />
          <CookieConsent />
        </div>
      </QueryClientProvider>
    </SessionContextProvider>
  );
}

export default App;