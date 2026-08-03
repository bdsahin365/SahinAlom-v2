'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { NAVIGATION, SITE_CONFIG } from '@/config/constants';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-heading-md font-bold hover:text-primary transition-colors">
            Sahin<span className="text-primary">Alom</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAVIGATION.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-body-md transition-colors',
                  isActive(link.href)
                    ? 'text-primary font-semibold'
                    : 'text-secondary hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-input-bg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657-9.193a1 1 0 00-1.414 0l-.707.707A1 1 0 005.05 6.464l.707-.707a1 1 0 001.414-1.414l-.707-.707zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-input-bg transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <Link href="/contact">
              <Button variant="primary" size="sm" className="hidden md:inline-flex">
                Contact
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <div className="flex flex-col gap-3 pt-4">
              {NAVIGATION.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-2 rounded-lg transition-colors',
                    isActive(link.href)
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-secondary hover:bg-input-bg'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" fullWidth>
                  Contact
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
