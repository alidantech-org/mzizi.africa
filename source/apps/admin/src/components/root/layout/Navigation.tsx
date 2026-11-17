'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/datahub', label: 'Data Hub' },
    { href: '/map', label: 'Map' },
    { href: '/profiles', label: 'Profiles' },
    { href: '/reports', label: 'Reports' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-2 md:px-4">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl text-primary font-bold">
              Katiba
            </Link>
          </div>

          {/* Desktop Menu - Left aligned next to logo */}
          <div className="hidden md:flex items-center space-x-6 ml-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors ${isActive(link.href) ? 'text-primary' : 'text-foreground hover:text-primary'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions - Push to the right */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Theme Toggle - Hidden on mobile */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className=" p-2 text-muted-foreground hover:text-primary transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* Notification Icon - Hidden on mobile */}
            <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            <Link
              href="/signup"
              className="hidden md:block px-3 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Download App
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-0 text-muted-foreground hover:text-primary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border/50">
          <div className="px-2 py-2 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full px-3 py-2 font-medium rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'text-primary bg-primary/10 border-l-4 border-primary'
                    : 'text-foreground hover:text-primary hover:bg-accent'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-1 border-t border-border">
              <Link
                href="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors mt-1"
              >
                Download App
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
