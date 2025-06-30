"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/plan", label: "Plan" },
    { href: "/donate", label: "Donate" },
  ];

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-2xl font-bold text-foreground font-lora hover:text-primary transition-colors">
              mdscholar
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors font-medium pb-1 ${
                  pathname === link.href
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <a
                href="https://discord.gg/A5G9g8Bv9B"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join us on Discord - Opens in new tab"
              >
                <Image 
                  src="/assets/icons/Discord-Symbol-Black.svg" 
                  alt=""
                  width={24} 
                  height={24}
                  className="h-6 w-6"
                />
              </a>
            </Button>
          </nav>

          {/* Mobile navigation */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Menu
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}