import './globals.css';
import type { Metadata } from 'next';
import { Lora } from 'next/font/google';
import { Header } from '@/components/shared/header'; // Import the new header
import Image from 'next/image';

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
        
        {/* Floating Action Button */}
        <div className="fixed bottom-8 left-8 z-50">
          <button
            className="group relative w-16 h-16 bg-white rounded-full shadow-2xl hover:shadow-3xl border border-gray-200 transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-black/20"
            aria-label="Quick actions menu"
          >
            {/* Icon Container */}
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src="/assets/icons/black_circle_360x360.png"
                alt="Quick actions"
                width={64}
                height={64}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-full" />
            </div>
            
            {/* Subtle Pulse Animation */}
            <div className="absolute inset-0 rounded-full bg-black/5 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg">
              Quick Actions
              <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-black" />
            </div>
          </button>
          
          {/* Floating Background Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 scale-150" />
        </div>
      </body>
    </html>
  );
}