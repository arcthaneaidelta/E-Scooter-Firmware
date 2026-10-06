import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, Shield, ShoppingBag, FileText, CheckCircle2, User, X } from 'lucide-react';
import { SCOOTER_MODELS } from '../../data/models';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickLinks = [
    { name: 'BLE Activation Wizard', path: '/activate', icon: <Compass className="w-4 h-4 text-accent" />, category: 'Core' },
    { name: 'Hardware Compatibility Matrix', path: '/models', icon: <Shield className="w-4 h-4 text-primary" />, category: 'Core' },
    { name: 'Shop & License Checkout', path: '/shop', icon: <ShoppingBag className="w-4 h-4 text-info" />, category: 'Sales' },
    { name: 'Account & Saved Backups', path: '/account', icon: <User className="w-4 h-4 text-text-secondary" />, category: 'Account' },
    { name: 'Firmware Test Report (48 Cases)', path: '/test-report', icon: <CheckCircle2 className="w-4 h-4 text-success" />, category: 'QA' },
    { name: 'Technical Documentation', path: '/docs', icon: <FileText className="w-4 h-4 text-text-muted" />, category: 'Docs' },
    { name: 'Proposal & Answers to Luca', path: '/about-demo', icon: <FileText className="w-4 h-4 text-accent" />, category: 'Client' },
  ];

  const filteredLinks = quickLinks.filter(l => l.name.toLowerCase().includes(query.toLowerCase()));
  const filteredModels = SCOOTER_MODELS.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase()) || m.brand.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center pt-24 p-4 text-left font-sans">
      <div className="fixed inset-0 bg-[#16201D]/50" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-surface-elevated rounded-[16px] border border-border shadow-2xl z-10 overflow-hidden">
        {/* Search header */}
        <div className="flex items-center px-4 py-3.5 border-b border-border bg-surface">
          <Search className="w-5 h-5 text-text-muted shrink-0 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command, model name, or jump to page..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-ink placeholder:text-text-muted/60 text-sm focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-text-muted hover:text-ink rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-4">
          <div>
            <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-text-muted">
              Navigation Destinations
            </div>
            <div className="space-y-1">
              {filteredLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleSelect(link.path)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-[8px] hover:bg-secondary text-left text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {link.icon}
                    <span className="font-medium text-ink">{link.name}</span>
                  </div>
                  <span className="text-[10px] text-text-muted font-mono">{link.category}</span>
                </button>
              ))}
            </div>
          </div>

          {filteredModels.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-text-muted">
                Scooter Models ({filteredModels.length})
              </div>
              <div className="space-y-1">
                {filteredModels.slice(0, 5).map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleSelect(`/models/${model.id}`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-[8px] hover:bg-secondary text-left text-xs transition-colors"
                  >
                    <div>
                      <div className="font-medium text-ink">{model.name}</div>
                      <div className="text-[10px] text-text-muted">{model.brand} · {model.architecture}</div>
                    </div>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      model.status === 'supported' ? 'bg-success-tint text-success' : 'bg-secondary text-text-muted'
                    }`}>
                      {model.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-bg border-t border-border flex items-center justify-between text-[11px] text-text-muted">
          <span>Navigate with mouse or arrow keys</span>
          <span className="font-mono">ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
