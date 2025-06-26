"use client";

import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { usePathname } from 'next/navigation'; // To highlight active link

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/plan", label: "Plan" },
    { href: "/donate", label: "Donate" },
  ];

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-black text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <Link href="/" className="text-xl font-bold text-black">
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
            <button className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors font-medium">
              Join Us
            </button>
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
