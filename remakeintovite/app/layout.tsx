import type { Metadata } from 'next';
import { Outfit, DM_Sans } from 'next/font/google';
import { Providers } from './providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/app/globals.css';

// Load primary bold font for headings
const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  // Include bold weights for headings
  weight: ['400', '500', '600', '700', '800']
});

// Load secondary font for body text
const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '700']
});

export const metadata: Metadata = {
  title: {
    template: '%s | Dealopia',
    default: 'Dealopia - Discover Amazing Local Deals',
  },
  description: 'Find the best discounts from your favorite local shops. Save money while supporting your community.',
  keywords: ['deals', 'discounts', 'local businesses', 'savings', 'local deals', 'coupons'],
  authors: [{ name: 'Dealopia Team' }],
  creator: 'Dealopia',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dealopia.com',
    siteName: 'Dealopia',
    title: 'Dealopia - Discover Amazing Local Deals',
    description: 'Find the best discounts from your favorite local shops. Save money while supporting your community.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dealopia',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dealopia - Discover Amazing Local Deals',
    description: 'Find the best discounts from your favorite local shops. Save money while supporting your community.',
    images: ['/twitter-image.jpg'],
    creator: '@dealopia',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-bgPrimary text-textPrimary font-body antialiased">
        <Providers>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </Providers>
      </body>
    </html>
  );
}