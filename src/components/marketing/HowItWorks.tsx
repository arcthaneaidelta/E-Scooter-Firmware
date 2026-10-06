import React, { useState } from 'react';
import { Search, Save, Sliders, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Identify & Pre-Flight',
      desc: 'Verify exact model UUID and firmware build over BLE. If the firmware is cryptographically locked or unknown, writing is safely prevented.',
      icon: <Search className="w-5 h-5 text-accent" />,
      previewTitle: 'Pre-flight UUID match',
      previewDetails: [
        'Nordic nRF51822 BLE handshake OK',
        'Model ID: Xiaomi Pro 2 (DDHBC11NEB)',
        'Firmware: v2.2.8 (Whitelisted in matrix)',
        'Battery SoC: 86% (≥ 30% interlock satisfied)',
      ],
      tag: 'Never write blind',
    },
    {
      num: '02',
      title: 'Automatic Baseline Backup',
      desc: 'Before touching a single register, the client pulls a bitwise snapshot of the original factory configuration with a SHA-256 checksum saved to the account.',
      icon: <Save className="w-5 h-5 text-primary" />,
      previewTitle: 'Non-volatile flash snapshot',
      previewDetails: [
        'Register block 0x00–0x3F extracted',
        'SHA-256: ab41f92e...e90c generated',
        'Persisted to client account storage',
        'Instant 1-tap stock reversal ready',
      ],
      tag: 'Cryptographic safety net',
    },
    {
      num: '03',
      title: 'Apply Guarded Parameters',
      desc: 'Top speed, phase current, and thermal cutoffs are adjusted within hardware-safe guardrails. Sliders automatically snap back if pushed past safe limits.',
      icon: <Sliders className="w-5 h-5 text-info" />,
      previewTitle: 'Staged atomic parameter write',
      previewDetails: [
        'Speed ceiling: 33 km/h (Safe ceiling 34)',
        'Current limit: 22A (MOSFET margin +3A)',
        'Thermal trip: 68°C (Tighter than OEM 70°C)',
        'Signed ED25519 payload validated',
      ],
      tag: 'Hardware protection',
    },
    {
      num: '04',
      title: 'Read-Back & Verify',
      desc: 'Every parameter block is read back from the ESC to confirm bitwise integrity. If connection dropped mid-write, the ESC aborts safely to stock.',
      icon: <ShieldCheck className="w-5 h-5 text-success" />,
      previewTitle: 'Bitwise register verification',
      previewDetails: [
        'Block 1–8 checksum match: 100%',
        'No orphaned memory segments',
        'Reversible at any time from app',
        'Activation record generated',
      ],
      tag: 'Zero brick risk',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-left">
      <div className="mb-12">
        <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold">
          Deterministic Workflow
        </span>
        <h2 className="font-display text-3xl sm:text-4xl text-ink font-normal mt-2">
          How Kestrel Protects the Scooter
        </h2>
        <p className="text-text-secondary text-sm sm:text-base mt-2 max-w-2xl">
          Designed specifically for online shop owners who need complete customer trust, flawless reversibility, and zero bricked controllers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Step selectors */}
        <div className="lg:col-span-5 space-y-3">
          {steps.map((s, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={s.num}
                onClick={() => setActiveStep(idx)}
                className={`p-5 rounded-[14px] border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-surface-elevated border-primary/40 shadow-sm translate-x-1'
                    : 'bg-surface border-border hover:border-border-strong opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-text-muted">{s.num}</span>
                    <h3 className="text-sm font-semibold text-ink">{s.title}</h3>
                  </div>
                  {s.icon}
                </div>
                <p className="text-xs text-text-secondary leading-relaxed pl-7">{s.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Right: Live UI preview panel */}
        <div className="lg:col-span-7 bg-surface-elevated border border-border rounded-[20px] p-6 lg:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-ink">
                Step {steps[activeStep].num}: {steps[activeStep].previewTitle}
              </span>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-secondary text-text-secondary border border-border">
              {steps[activeStep].tag}
            </span>
          </div>

          {/* Simulated hardware state view */}
          <div className="bg-[#16201D] text-[#ECE8E0] rounded-[14px] p-5 font-mono text-xs space-y-3 shadow-inner">
            <div className="text-white/40 text-[10px] uppercase tracking-wider flex items-center justify-between pb-2 border-b border-white/10">
              <span>Hardware Link Terminal</span>
              <span>STATE: STAGED_TRANSACTION</span>
            </div>
            {steps[activeStep].previewDetails.map((line, i) => (
              <div key={i} className="flex items-center gap-2 text-white/90">
                <span className="text-accent">&gt;</span>
                <span>{line}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-border">
            <span className="text-xs text-text-muted">
              Explore the live 6-step wizard with real simulators:
            </span>
            <Link
              to="/activate"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-hover"
            >
              Launch Activation Wizard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
