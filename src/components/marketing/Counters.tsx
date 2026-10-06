import React from 'react';

export const Counters: React.FC = () => {
  const stats = [
    {
      value: '14',
      label: 'Models Catalogued',
      detail: '7 fully supported, 3 read-only, 4 out-of-scope locked models cleanly categorized.',
    },
    {
      value: '48 / 48',
      label: 'Test Cases Validated',
      detail: '46 passed, 2 passed with documented timing notes, 0 regressions.',
    },
    {
      value: '100%',
      label: 'Rollback & Restore Rate',
      detail: 'Zero bricked units across simulated disconnects, CRC failures, and brownout tests.',
    },
  ];

  return (
    <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {stats.map((s, i) => (
          <div key={i} className="border-l-2 border-accent pl-5 py-1">
            <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-ink">
              {s.value}
            </div>
            <div className="font-display text-base text-ink mt-1">
              {s.label}
            </div>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              {s.detail}
            </p>
          </div>
        ))}
      </div>
      <div className="text-[11px] text-text-muted font-mono mt-6 text-center">
        * Illustrative demo metrics reflecting test suite architecture and safety envelope validation.
      </div>
    </section>
  );
};
