import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface NavbarProps {
  onOpenCommandPalette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Models', path: '/models' },
    { label: 'Shop', path: '/shop' },
    { label: 'Activate', path: '/activate', highlight: true },
    { label: 'Test Report', path: '/test-report' },
    { label: 'Docs', path: '/docs' },
    { label: 'Account', path: '/account' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-40 bg-bg/90 backdrop-blur-md border-b border-border transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand logo & wordmark */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-[8px] bg-primary flex items-center justify-center text-[#F4F2EE] group-hover:bg-primary-hover transition-colors shadow-sm">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 14 L11 4 L14 10 L20 6 L15 19 L11 13 Z" />
            </svg>
          </div>
          <span className="font-display text-xl font-normal tracking-tight text-ink">
            Kestrel
          </span>
          <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-secondary text-text-secondary border border-border">
            Activate
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-[6px] transition-colors ${
                  active
                    ? 'text-primary font-semibold'
                    : 'text-text-secondary hover:text-ink hover:bg-secondary/50'
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-accent rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Actions: Command search & Activate CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-mono text-text-muted hover:text-ink rounded-[6px] border border-border hover:border-border-strong bg-surface transition-colors"
            title="Search models and commands (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden lg:inline-block px-1 py-0.2 bg-secondary rounded text-[10px]">
              ⌘K
            </kbd>
          </button>

          <Link to="/about-demo" className="hidden sm:inline-block">
            <span className="text-xs text-accent hover:text-accent-hover font-medium underline flex items-center gap-0.5">
              About demo <ArrowUpRight className="w-3 h-3" />
            </span>
          </Link>

          <Link to="/activate" className="hidden sm:inline-block">
            <Button size="sm" variant="primary">
              Demo Wizard
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-ink rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer / dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface-elevated p-4 space-y-3 animate-in fade-in duration-150">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2.5 rounded-[8px] font-medium ${
                  isActive(link.path)
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-ink hover:bg-secondary/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <Link
              to="/about-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-accent font-medium"
            >
              Proposal & Answers to Luca
            </Link>
            <Link to="/activate" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" variant="accent">
                Start Activation
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
