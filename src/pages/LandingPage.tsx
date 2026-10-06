import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { TelemetryPanel } from '../components/marketing/TelemetryPanel';
import { HowItWorks } from '../components/marketing/HowItWorks';
import { SafetyGrid } from '../components/marketing/SafetyGrid';
import { ModelStrip } from '../components/marketing/ModelStrip';
import { Counters } from '../components/marketing/Counters';
import { FaqAccordion } from '../components/marketing/FaqAccordion';
import { ShieldCheck, ArrowRight, CheckCircle2, ChevronRight, Lock } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="pt-10 pb-20 md:pt-16 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-primary border border-border text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>BLE activation for e-scooters</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink font-normal leading-[1.08] tracking-tight">
              Change the limits.<br />
              <span className="italic">Keep the safety net.</span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed">
              Verified model checks, automatic pre-write backups, and one-tap restore to stock. Built for private-property performance tuning, with every single write reversible.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link to="/activate">
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Try the activation demo
                </Button>
              </Link>
              <Link to="/models">
                <Button size="lg" variant="secondary">
                  Browse supported models
                </Button>
              </Link>
            </div>

            {/* Reassurance points */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-text-secondary border-t border-border">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                <span>Zero bootloader bypass</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                <span>Pre-write SHA-256 backup</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                <span>Private property compliance gate</span>
              </span>
            </div>
          </div>

          {/* Right Column: Live Telemetry Panel */}
          <div className="lg:col-span-5 w-full">
            <TelemetryPanel />
          </div>
        </div>
      </section>

      {/* Storytelling Section */}
      <HowItWorks />

      {/* Safety Grid */}
      <SafetyGrid />

      {/* Supported Models Horizontal Explorer */}
      <ModelStrip />

      {/* Proof Metrics */}
      <Counters />

      {/* FAQ Accordion */}
      <FaqAccordion />

      {/* Pre-Footer Action Banner */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="bg-surface-elevated border border-border rounded-[20px] p-8 sm:p-12 shadow-sm text-left">
          <div className="max-w-xl">
            <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold">
              Interactive Test Environment
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-ink font-normal mt-2">
              Experience the Safety Architecture Firsthand
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
              Step through the full 6-step activation wizard using scripted BLE peripherals. Test our guardrail sliders, disconnect resilience, and stock reversibility.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/activate">
                <Button variant="accent" size="md">
                  Launch Centerpiece Demo
                </Button>
              </Link>
              <Link to="/about-demo">
                <Button variant="secondary" size="md">
                  Read Proposal & Answers for Luca
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
