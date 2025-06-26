import './globals.css';
import type { Metadata } from 'next';
import { Lora } from 'next/font/google';
import { Header } from '@/components/shared/header'; // Import the new header

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
});

export const metadata: Metadata = {
  title: 'mdscholar - Make Research Accessible to Everyone',
  description: 'mdscholar transforms complex academic research into clear, actionable insights. Discover, understand, and apply knowledge faster than ever before.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${lora.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}