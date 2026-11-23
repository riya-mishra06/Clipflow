import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'Clipflow Creator Studio | Video Production & Content Operations',
  description: 'Next-gen video production, UGC campaign discovery, and automated clipping platform for modern creators.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="bg-surface-container-lowest text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
