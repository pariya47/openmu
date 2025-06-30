"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
  ];

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="text-2xl font-bold text-black font-lora">
                mdscholar
              </Link>
            </div>

            {/* Desktop Navigation */}
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

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 hover:bg-gray-100 transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <Link 
                  href="/" 
                  className="text-xl font-bold text-black font-lora"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  mdscholar
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                  aria-label="Close mobile menu"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </Button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-6 py-8">
                <div className="space-y-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block text-lg font-medium transition-colors ${
                        pathname === link.href
                          ? "text-black"
                          : "text-gray-600 hover:text-black"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200">
                <a
                  href="https://discord.gg/A5G9g8Bv9B"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-600 hover:text-black transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Image 
                    src="/assets/icons/Discord-Symbol-Black.svg" 
                    alt="Discord" 
                    width={24} 
                    height={24}
                    className="h-6 w-6"
                  />
                  <span className="font-medium">Join our Discord</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}