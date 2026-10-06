import React from 'react';
import { SCOOTER_MODELS } from '../../data/models';
import { Badge } from '../ui/Badge';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ModelStrip: React.FC = () => {
  return (
    <section className="py-16 bg-surface/50 border-y border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 text-left">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold">
              Ecosystem Coverage
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-ink font-normal mt-1">
              Supported Hardware Platforms
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Strictly adheres to open parameter models without bypassing cryptographic bootloaders.
            </p>
          </div>
          <Link
            to="/models"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover shrink-0"
          >
            <span>Open Compatibility Matrix</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Horizontal scrollable / responsive grid strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {SCOOTER_MODELS.slice(0, 4).map((model) => (
            <Link
              key={model.id}
              to={`/models/${model.id}`}
              className="bg-surface-elevated border border-border rounded-[14px] p-5 hover:border-border-strong hover:-translate-y-1 transition-all duration-200 shadow-sm flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                    {model.brand}
                  </span>
                  <Badge variant={model.status} size="sm">
                    {model.status}
                  </Badge>
                </div>
                <h3 className="font-display text-base text-ink group-hover:text-accent transition-colors font-normal">
                  {model.name}
                </h3>
                <p className="text-xs text-text-secondary mt-1 font-mono">
                  {model.architecture}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-text-secondary">
                <span className="font-mono text-[11px]">
                  {model.supportedFirmwareCount} verified firmwares
                </span>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 group-hover:text-ink transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
