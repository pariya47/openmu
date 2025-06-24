import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hello World - Modern & Minimal',
  description: 'A beautiful, modern Hello World page built with Next.js and Tailwind CSS',
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