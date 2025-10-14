import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { SecureNoteLogo, NotesGateLogo } from '@/components/icons';

export const metadata: Metadata = {
  title: 'NotesGate',
  description: 'A legendary notes app.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
