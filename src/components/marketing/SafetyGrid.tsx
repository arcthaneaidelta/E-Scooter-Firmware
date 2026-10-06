import React from 'react';
import { ShieldCheck, HardDriveDownload, RotateCcw, WifiOff, ThermometerSnowflake, FileCheck } from 'lucide-react';

export const SafetyGrid: React.FC = () => {
  const safetyFeatures = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: 'Model & Firmware Gatekeeping',
      description: 'Zero write commands dispatch until BLE reads vendor descriptor, firmware build number, and ESC revision. Incompatible or locked units abort with a clear explanation.',
    },
    {
      icon: <HardDriveDownload className="w-6 h-6 text-accent" />,
      title: 'Pre-Write Flash Snapshot',
      description: 'An exact bitwise backup of factory memory is compiled with a verifiable SHA-256 digest before any configuration write is unlocked.',
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-success" />,
      title: 'One-Tap Restore to Stock',
      description: 'Reversibility is non-negotiable. Customers can restore OEM factory parameters from their browser at any time with complete before-and-after diff tracking.',
    },
    {
      icon: <WifiOff className="w-6 h-6 text-warning" />,
      title: 'Safe Abort on Connection Loss',
      description: 'All writes operate through an atomic staging buffer. If the phone battery dies or Bluetooth drops mid-write, the ESC automatically drops staged packets and retains stock values.',
    },
    {
      icon: <ThermometerSnowflake className="w-6 h-6 text-info" />,
      title: 'Current & Thermal Guardrails',
      description: 'Parameters are bounded by physical hardware limits (phase wire gauge, MOSFET dissipation, battery discharge rating). Values snap back to safe envelopes automatically.',
    },
    {
      icon: <FileCheck className="w-6 h-6 text-primary" />,
      title: 'Signed Package Checksums',
      description: 'Base64 parameter packets are versioned, SHA-256 digested, and ED25519 authenticated per model/firmware tuple to prevent corrupted payload transmission.',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-left">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold">
          Hardware First Principles
        </span>
        <h2 className="font-display text-3xl sm:text-4xl text-ink font-normal mt-2">
          Safety First by Design
        </h2>
        <p className="text-text-secondary text-sm sm:text-base mt-2">
          Every requirement from Luca’s specification built as an architectural safeguard, not an afterthought.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safetyFeatures.map((item, idx) => (
          <div
            key={idx}
            className="bg-surface border border-border rounded-[14px] p-6 hover:border-border-strong hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
          >
            <div className="w-11 h-11 rounded-[10px] bg-secondary/80 flex items-center justify-center mb-4 border border-border">
              {item.icon}
            </div>
            <h3 className="font-display text-lg text-ink font-normal mb-2">
              {item.title}
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
