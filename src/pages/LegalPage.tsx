import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, FileText, Scale } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState('Germany');

  const regionDetails: Record<string, { publicLimit: string; regulation: string; note: string }> = {
    Germany: {
      publicLimit: '20 km/h (max 500W nominal)',
      regulation: 'eKFV (Elektrokleinstfahrzeuge-Verordnung)',
      note: 'Operation above 20 km/h or with modified motor current on public roads invalidates the general operating permit (Allgemeine Betriebserlaubnis / ABE) and insurance badge (Versicherungskennzeichen). All modified software modes must be strictly confined to fenced private property.'
    },
    'United Kingdom': {
      publicLimit: '15.5 mph / 25 km/h (Trial zones only)',
      regulation: 'Road Traffic Act 1988 / PLEV Regulations',
      note: 'Privately owned e-scooters are prohibited on UK public roads and pavements. Modifying speed limits for private track or private estate recreation is permissible only on land with explicit landowner consent.'
    },
    'European Union': {
      publicLimit: '25 km/h standard',
      regulation: 'EN 17128 Standard & National Transpositions',
      note: 'Most member states enforce a hard 25 km/h road cutoff. Any higher speed configuration delivered to customers must be paired with an unambiguous private-property waiver to shield the vendor.'
    },
    'United States': {
      publicLimit: '15–20 mph (Varies by state code)',
      regulation: 'State DOT / CPSC Standards',
      note: 'States classify scooters into Class 1/2 micro-mobility brackets. Off-road and closed-course riding is exempt from public roadway speed governors.'
    }
  };

  const regInfo = regionDetails[selectedRegion] || regionDetails['Germany'];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-left">
      <div className="mb-8 pb-6 border-b border-border">
        <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold">
          Commercial Safeguards
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal mt-1">
          Private Property Compliance & Liability Gate
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Designed specifically to protect Luca's business when reselling parameter modification licenses.
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-text-secondary leading-relaxed">
        {/* Compliance By Design Card */}
        <div className="bg-surface-elevated p-6 rounded-[16px] border border-border shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-ink font-semibold text-base">
            <Scale className="w-5 h-5 text-accent" />
            <span>Commercial Intent: Protecting the Reseller</span>
          </div>
          <p>
            When selling parameter licenses to retail consumers, legal risk is minimized by establishing an explicit contract of use: the customer acknowledges that performance modifications are intended exclusively for private property, closed tracks, or agricultural estates.
          </p>
          <p>
            By integrating an immutable jurisdiction selector and digital consent signature into the activation flow, your shop maintains a clean audit trail proving that performance modes were not marketed for unlawful public highway operation.
          </p>
        </div>

        {/* Interactive Jurisdiction Selector */}
        <div className="bg-surface p-6 rounded-[16px] border border-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-display text-lg text-ink font-normal">
              Regional Road Limits vs. Private Property
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-text-muted">Select Jurisdiction:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-surface-elevated border border-border-strong rounded-[6px] px-3 py-1.5 text-xs text-ink focus:outline-none"
              >
                {Object.keys(regionDetails).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-surface-elevated p-4 rounded-[12px] border border-border space-y-2 font-mono text-xs">
            <div className="flex justify-between border-b border-border pb-1.5">
              <span className="text-text-muted uppercase">Statutory Road Speed Cap:</span>
              <span className="font-semibold text-ink">{regInfo.publicLimit}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-1.5">
              <span className="text-text-muted uppercase">Governing Framework:</span>
              <span className="text-text-secondary">{regInfo.regulation}</span>
            </div>
            <div className="pt-1 text-text-secondary font-sans leading-relaxed">
              <strong>Jurisdictional Disclaimer:</strong> {regInfo.note}
            </div>
          </div>
        </div>

        {/* Recommended Shop Terms Checklist */}
        <div className="bg-surface-elevated p-6 rounded-[16px] border border-border shadow-sm space-y-3">
          <h3 className="font-display text-lg text-ink font-normal">
            Recommended Storefront Safeguards
          </h3>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>Digital Checksum Recording:</strong> Store the cryptographic hash of the client's consent payload alongside the license token upon activation.</li>
            <li><strong>Reversibility Prominence:</strong> Highlight the 1-tap "Restore to Stock" capability prominently in shop marketing to reassure cautious customers.</li>
            <li><strong>No Speed Exaggerations:</strong> Factually specify target parameters in technical units (e.g. 32 km/h, 22A current limit) rather than exaggerated claims.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
