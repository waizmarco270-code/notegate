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
      </head>
      <body className="antialiased">
        <FirebaseProvider>
          <Providers>{children}</Providers>
        </FirebaseProvider>
        <Analytics />
      </body>
    </html>
  );
}
