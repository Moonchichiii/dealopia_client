// src/app/metadata.ts
import type { Metadata } from 'next';

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
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('http://localhost:3000'),
};