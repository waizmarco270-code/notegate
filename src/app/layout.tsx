import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/react';
import { FirebaseProvider } from '@/firebase/provider';

export const metadata: Metadata = {
  title: 'NotesGate',
  description: 'A legendary notes app.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <meta name="theme-color" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Belleza&family=Inter:wght@400;700&family=Lora:ital,wght@0,400;1,700&family=Montserrat:wght@400;700&family=Playfair+Display:ital,wght@0,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-body">
        <FirebaseProvider>
          <Providers>{children}</Providers>
        </FirebaseProvider>
        <Analytics />
      </body>
    </html>
  );
}
