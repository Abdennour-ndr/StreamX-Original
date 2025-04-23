import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StreamX',
  description: 'منصة البث عربية',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar">
      <head>
        <title>StreamX</title>
        <meta name="description" content="منصة بث عربية" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2a2a2a" />
        {/* Add to homescreen for Safari on iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="StreamX" />
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
} 