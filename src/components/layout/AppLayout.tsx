import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from '../marketing/Footer';
import { CommandPalette } from '../app/CommandPalette';
import { DemoToolbar } from '../app/DemoToolbar';
import { EntryLoader } from '../marketing/EntryLoader';
import { useDemoStore } from '../../store/demoStore';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const location = useLocation();
  const { skipLoader, setSkipLoader } = useDemoStore();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Only show loader on initial visit to landing page if not skipped
    const alreadyVisited = sessionStorage.getItem('kestrel_skip_loader') === 'true';
    if (!alreadyVisited && !skipLoader && location.pathname === '/') {
      setShowLoader(true);
    }
  }, [location.pathname, skipLoader]);

  const isAppView = location.pathname.startsWith('/activate') || location.pathname.startsWith('/account');

  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink relative selection:bg-accent selection:text-white">
      {/* Entry Loader Sequence */}
      {showLoader && (
        <EntryLoader
          onComplete={() => {
            setShowLoader(false);
            setSkipLoader(true);
          }}
        />
      )}

      {/* Primary Top Navbar */}
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Main Page Body */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer (only on content pages, account/activate has simplified layout) */}
      {!isAppView && <Footer />}

      {/* Persistent QA Demo Controls Toolbar */}
      <DemoToolbar />
    </div>
  );
};
