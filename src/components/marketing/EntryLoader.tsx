import React, { useState, useEffect } from 'react';

interface EntryLoaderProps {
  onComplete: () => void;
}

export const EntryLoader: React.FC<EntryLoaderProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'solid' | 'draw' | 'progress' | 'exit'>('solid');

  useEffect(() => {
    // 0-200ms: solid bg
    const t1 = setTimeout(() => setPhase('draw'), 180);
    // 200-700ms: draw stroke & title
    const t2 = setTimeout(() => setPhase('progress'), 650);
    // 700-1100ms: progress line fills
    const t3 = setTimeout(() => setPhase('exit'), 1050);
    // 1100-1400ms: exit overlay
    const t4 = setTimeout(() => {
      sessionStorage.setItem('kestrel_skip_loader', 'true');
      onComplete();
    }, 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center transition-all duration-400 ease-in-out select-none ${
        phase === 'exit' ? 'opacity-0 pointer-events-none -translate-y-4' : 'opacity-100'
      }`}
      style={{
        clipPath: phase === 'exit' ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)',
        transition: 'clip-path 400ms cubic-bezier(0.65, 0, 0.35, 1), opacity 300ms ease',
      }}
    >
      <div className="flex flex-col items-center text-center">
        {/* Minimal bird-wing / bolt SVG logo glyph */}
        <div className="w-16 h-16 mb-4 relative">
          <svg
            viewBox="0 0 64 64"
            className="w-full h-full text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M12 40 L28 14 L36 28 L52 18 L38 50 L28 36 Z"
              style={{
                strokeDasharray: 200,
                strokeDashoffset: phase === 'solid' ? 200 : 0,
                transition: 'stroke-dashoffset 500ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
          </svg>
        </div>

        {/* Wordmark */}
        <div
          className={`transition-all duration-400 ${
            phase !== 'solid' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <h1 className="font-display text-3xl font-normal tracking-tight text-ink">
            Kestrel
          </h1>
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-muted mt-1">
            Hardware Verification Suite
          </p>
        </div>

        {/* Copper progress bar line */}
        <div className="w-36 h-[2px] bg-border-strong/50 rounded-full mt-6 overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-400 ease-out"
            style={{
              width: phase === 'solid' ? '0%' : phase === 'draw' ? '25%' : phase === 'progress' || phase === 'exit' ? '100%' : '0%',
            }}
          />
        </div>

        <span className="text-[10px] text-text-muted font-mono mt-2">
          Initialising safe registers...
        </span>
      </div>
    </div>
  );
};
