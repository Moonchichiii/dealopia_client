'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollSmoother, ScrollTrigger } from '@/utils/gsap';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
//import { useTranslation } from 'react-i18next';


export default function DashboardPage() {
  const { user, logout } = useAuth();
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);
  
  // Initialize smooth scrolling
  useLayoutEffect(() => {
    // Create scroll smoother for smooth scrolling effect
    const smoother = ScrollSmoother.create({
      wrapper: smoothWrapperRef.current!,
      content: smoothContentRef.current!,
      smooth: 1.5, // Adjust smoothness (higher = slower)
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
    });
    
    // Set up a listener for route changes to kill ScrollTrigger instances when navigating away
    const handleRouteChange = () => {
      smoother.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
    
    return () => {
      // Clean up all scroll-related instances when component unmounts
      smoother.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener('beforeunload', handleRouteChange);
    };
  }, []);
  
  return (
    <ProtectedRoute>
      <div ref={smoothWrapperRef} className="smooth-wrapper">
        <div ref={smoothContentRef} className="smooth-content">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Welcome to your Dashboard, {user?.first_name || user?.username}!
              </h1>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow">
                  <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
                    Your Profile
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300">
                    <p><span className="font-medium">Email:</span> {user?.email}</p>
                    <p><span className="font-medium">Name:</span> {user?.first_name} {user?.last_name}</p>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg shadow">
                  <h2 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">
                    Favorite Deals
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    You don't have any favorite deals yet.
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  onClick={() => logout()}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  );
}