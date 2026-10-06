import React from 'react';
import { getMockDb } from '../data/mockDb';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Key, Activity, ShieldCheck, Server, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminPage: React.FC = () => {
  const db = getMockDb();

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold">
            Merchant Telemetry
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal mt-1">
            License Server Integration View
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Read-only operator perspective demonstrating clean interoperability with Luca’s license database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-tint text-success font-mono text-xs border border-success/30">
            <span className="w-1.5 h-1.5 rounded-full bg-success pulse-subtle" />
            License Server Online
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="my-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-surface-elevated p-4 rounded-[14px] border border-border shadow-sm">
          <div className="text-[10px] font-mono text-text-muted uppercase">Tokens Generated</div>
          <div className="text-2xl font-mono font-bold text-ink mt-1">{db.licenses.length} Keys</div>
          <div className="text-[11px] text-text-secondary mt-1">Ed25519 signatures validated</div>
        </div>

        <div className="bg-surface-elevated p-4 rounded-[14px] border border-border shadow-sm">
          <div className="text-[10px] font-mono text-text-muted uppercase">Active Bindings</div>
          <div className="text-2xl font-mono font-bold text-success mt-1">
            {db.licenses.filter((l) => l.status === 'Active').length} Bound
          </div>
          <div className="text-[11px] text-text-secondary mt-1">Bound to physical MACs</div>
        </div>

        <div className="bg-surface-elevated p-4 rounded-[14px] border border-border shadow-sm">
          <div className="text-[10px] font-mono text-text-muted uppercase">Available Unused</div>
          <div className="text-2xl font-mono font-bold text-accent mt-1">
            {db.licenses.filter((l) => l.status === 'Unused').length} Pool
          </div>
          <div className="text-[11px] text-text-secondary mt-1">Ready for storefront sale</div>
        </div>

        <div className="bg-surface-elevated p-4 rounded-[14px] border border-border shadow-sm">
          <div className="text-[10px] font-mono text-text-muted uppercase">Revoked Tokens</div>
          <div className="text-2xl font-mono font-bold text-text-muted mt-1">0 Charged</div>
          <div className="text-[11px] text-success mt-1">Zero chargeback disputes</div>
        </div>
      </div>

      {/* 7-Day Sparkline (SVG) */}
      <div className="bg-surface-elevated p-6 rounded-[16px] border border-border shadow-sm mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base text-ink font-normal">7-Day Activation Velocity</h3>
            <p className="text-xs text-text-secondary">Simulated daily Web Bluetooth parameter write volume</p>
          </div>
          <div className="font-mono text-xs text-text-secondary">Avg: 18 writes/day</div>
        </div>

        <div className="h-28 w-full pt-2">
          <svg viewBox="0 0 700 100" className="w-full h-full overflow-visible">
            {/* Grid lines */}
            <line x1="0" y1="20" x2="700" y2="20" stroke="#E2DED6" strokeDasharray="3 3" />
            <line x1="0" y1="50" x2="700" y2="50" stroke="#E2DED6" strokeDasharray="3 3" />
            <line x1="0" y1="80" x2="700" y2="80" stroke="#E2DED6" strokeDasharray="3 3" />

            {/* Sparkline gradient fill */}
            <defs>
              <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B8693A" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#B8693A" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path
              d="M 50 70 Q 150 40, 250 55 T 450 30 T 650 20 L 650 100 L 50 100 Z"
              fill="url(#sparkGradient)"
            />

            {/* Sparkline stroke */}
            <path
              d="M 50 70 Q 150 40, 250 55 T 450 30 T 650 20"
              fill="none"
              stroke="#B8693A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Data points */}
            <circle cx="50" cy="70" r="4" fill="#B8693A" />
            <circle cx="250" cy="55" r="4" fill="#B8693A" />
            <circle cx="450" cy="30" r="4" fill="#B8693A" />
            <circle cx="650" cy="20" r="4" fill="#B8693A" />
          </svg>
        </div>

        <div className="flex justify-between text-[10px] font-mono text-text-muted border-t border-border pt-2">
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
          <span>SUN (TODAY)</span>
        </div>
      </div>

      {/* License Transaction Table */}
      <div className="bg-surface-elevated rounded-[16px] border border-border overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-display text-base text-ink font-normal">Active Token Records</h3>
          <span className="text-xs font-mono text-text-muted">Mirrored from local DB</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-bg border-b border-border font-mono uppercase text-[10px] text-text-secondary">
            <tr>
              <th className="py-3 px-4">License Key</th>
              <th className="py-3 px-4">Tier Plan</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Bound Peripheral</th>
              <th className="py-3 px-4 font-mono">Jurisdiction Policy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {db.licenses.map((lic) => (
              <tr key={lic.id} className="hover:bg-bg/40">
                <td className="py-3 px-4 font-mono font-semibold text-ink">{lic.key}</td>
                <td className="py-3 px-4 text-text-secondary">{lic.plan}</td>
                <td className="py-3 px-4">
                  <Badge variant={lic.status.toLowerCase() as any} size="sm">{lic.status}</Badge>
                </td>
                <td className="py-3 px-4 font-mono text-text-muted">{lic.boundDeviceName || 'Unassigned'}</td>
                <td className="py-3 px-4 text-text-secondary">{lic.region}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
