import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clipflow — Video Production & Content Operations',
  description: 'Premium creator workspace for discovery, planning, editing, and payout tracking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-studio-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
