import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SUMU - Make Research Accessible to Everyone',
  description: 'SUMU transforms complex academic research into clear, actionable insights. Discover, understand, and apply knowledge faster than ever before.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}