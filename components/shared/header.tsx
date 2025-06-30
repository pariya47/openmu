"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; // To highlight active link

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
  ];

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-2xl font-bold text-black font-lora">
              mdscholar
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors font-medium pb-1 ${
                  pathname === link.href
                    ? "text-black border-b-2 border-black"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://discord.gg/A5G9g8Bv9B"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join us on Discord"
              className="text-gray-600 hover:text-black transition-colors"
            >
              <Image 
                src="/assets/icons/Discord-Symbol-Black.svg" 
                alt="Discord" 
                width={24} 
                height={24}
                className="h-6 w-6"
              />
            </a>
          </nav>

          {/* Basic mobile navigation placeholder - can be improved later if needed */}
          <div className="md:hidden">
            {/* A simple menu button or link could go here for mobile */}
            <Link href="/" className="text-gray-600 hover:text-black">
                Menu
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}