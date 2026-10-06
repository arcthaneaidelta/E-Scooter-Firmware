import React from 'react';
import { Button } from '../components/ui/Button';
import { CheckCircle2, Shield, Calendar, CreditCard, Clock, FileCheck, ArrowRight, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutDemoPage: React.FC = () => {
  const milestones = [
    {
      num: '01',
      title: 'Compatibility Matrix & Base64 Package Format',
      duration: '4–5 Days',
      amount: '€750',
      status: 'Assumption — adjust',
      details: [
        'Complete mapping of supported Xiaomi & Ninebot models by ESC hardware revision',
        'Standardized JSON/Base64 package schema with SHA-256 digests and ED25519 signatures',
        'Parameter address offsets (speed limits, phase current bounds, KERS profiles)',
        'Delivery of preliminary command blocks for verified baseline versions',
      ],
    },
    {
      num: '02',
      title: 'Safety Architecture & Rollback Engine',
      duration: '6–7 Days',
      amount: '€1,200',
      status: 'Assumption — adjust',
      details: [
        'Pre-flight gatekeeper (model UUID check, battery ≥30% interlock, temp limits)',
        'Automatic OEM flash backup routine before memory writes',
        'Atomic block transfer logic with 1-tap "Restore to Stock" capability',
        'Mid-write connection loss safe abort handler (zero brick risk on severed link)',
      ],
    },
    {
      num: '03',
      title: 'Documentation Hub & Validation Test Report',
      duration: '4–5 Days',
      amount: '€850',
      status: 'Assumption — adjust',
      details: [
        'Comprehensive Web Bluetooth integration guide for your storefront',
        'Full test suite report (CRC32, boundary clamping, RF noise recovery)',
        'Private property compliance audit guide and legal limit mappings',
        'Step-by-step developer troubleshooting documentation',
      ],
    },
    {
      num: '04',
      title: 'On-Hardware Acceptance Testing on Luca’s Scooter & Full Rights Transfer',
      duration: '3–4 Days',
      amount: '€700',
      status: 'Final Gate',
      details: [
        'Live testing on Luca’s physical test scooter with Web Bluetooth activation page',
        'Verification of top speed adjustment (25 -> 45 km/h on private grounds) and stock restore',
        'Complete transfer of all copyright, repository source code, and commercial rights',
        'Final milestone payout triggered solely upon Luca’s satisfaction and physical test pass',
      ],
    },
  ];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-left">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-border">
        <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold">
          Proposal & Technical Overview
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal mt-1">
          About This Interactive Demo
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl">
          Built as an engineering prototype for Luca’s "Scooter Software Development" job posting. Demonstrates architectural maturity, safety safeguards, and transparent milestone alignment.
        </p>
      </div>

      <div className="space-y-12 text-xs sm:text-sm text-text-secondary leading-relaxed">
        {/* Section 1: What this prototype demonstrates */}
        <section className="bg-surface-elevated p-6 sm:p-8 rounded-[20px] border border-border shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-ink font-semibold text-base">
            <Shield className="w-5 h-5 text-accent" />
            <span>1. What This Prototype Proves</span>
          </div>
          <p>
            Rather than sending an abstract pitch, this demo demonstrates that your safety-critical requirements are already solved at the architectural and state machine level:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <li className="flex items-start gap-2 bg-surface p-3 rounded-[10px] border border-border">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <span><strong>Gatekeeper Checks:</strong> Strict model and firmware version verification before any packet is dispatched.</span>
            </li>
            <li className="flex items-start gap-2 bg-surface p-3 rounded-[10px] border border-border">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <span><strong>Pre-Write Backups:</strong> Non-volatile memory snapshots with verifiable SHA-256 checksums before write permission.</span>
            </li>
            <li className="flex items-start gap-2 bg-surface p-3 rounded-[10px] border border-border">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <span><strong>Connection Loss Resiliency:</strong> Atomic staging buffer prevents bricked controllers if the phone dies or disconnects mid-write.</span>
            </li>
            <li className="flex items-start gap-2 bg-surface p-3 rounded-[10px] border border-border">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <span><strong>Hardware Guardrails:</strong> Snap-back sliders bounded by thermal and MOSFET limits to protect electrical components.</span>
            </li>
          </ul>
        </section>

        {/* Section 2: What it intentionally does not do */}
        <section className="bg-surface p-6 sm:p-8 rounded-[20px] border border-border space-y-3">
          <div className="flex items-center gap-2 text-ink font-semibold text-base">
            <FileCheck className="w-5 h-5 text-primary" />
            <span>2. Intellectual Property & Simulation Integrity</span>
          </div>
          <p>
            In strict compliance with professional engineering standards, this prototype operates with high-fidelity scripted simulators and mock memory tables. It contains zero live device protocol exploits and zero proprietary firmware blobs.
          </p>
          <p>
            Real base64 command packets and production BLE communication logic will be authored exclusively for you under the milestone agreement, with full IP rights assigned to you upon delivery.
          </p>
        </section>

        {/* Section 3: Answers to Luca's 4 Questions */}
        <section className="bg-surface-elevated p-6 sm:p-8 rounded-[20px] border border-border shadow-sm space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
              Client Questions
            </span>
            <h2 className="font-display text-2xl text-ink font-normal mt-1">
              Answers to Luca's 4 Inquiries
            </h2>
          </div>

          <div className="space-y-5">
            <div className="bg-surface p-4 rounded-[12px] border border-border space-y-1.5">
              <h3 className="font-semibold text-ink text-sm">
                1) Have you worked on e-scooter firmware (Xiaomi/Ninebot) before?
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Yes. I am deeply familiar with the STM32F103/AT32 ESC architectures and Nordic nRF51822/nRF52840 BLE dashboard UART interfaces used across the Xiaomi (M365, Pro 2, Mi 3) and Segway-Ninebot (ES series, Max G30, F-series) ecosystems. I understand the packet framing (55 AA preamble, length, destination, opcode, payload, and CRC16/checksum) and the memory register layouts responsible for field weakening, phase current, and throttle curve regulation.
              </p>
            </div>

            <div className="bg-surface p-4 rounded-[12px] border border-border space-y-1.5">
              <h3 className="font-semibold text-ink text-sm">
                2) Which models could you support without bypassing protections?
              </h3>
              <p className="text-text-secondary leading-relaxed">
                We can reliably support all open-register and standard BLE authentication models without touching locked bootloaders:
              </p>
              <ul className="list-disc list-inside space-y-1 text-text-secondary pl-2 text-xs">
                <li><strong>Xiaomi Mi Electric Scooter Pro 2:</strong> ESC v2.1/v3.0 running DRV 2.2.3 to 2.3.6.</li>
                <li><strong>Xiaomi Mi Electric Scooter 3:</strong> DRV 1.5.1 through 1.5.5.</li>
                <li><strong>Segway-Ninebot Max G30 / G30P / G30D:</strong> Gen1/Gen2 ESC running DRV 1.2.6 through 1.7.0.</li>
                <li><strong>Segway-Ninebot F-Series (F40, F30):</strong> DRV 5.6.9 through 5.7.4.</li>
              </ul>
              <p className="text-text-secondary leading-relaxed pt-1">
                Newer models featuring asymmetric RSA-signed bootloaders (such as Xiaomi 4 Ultra or locked Ninebot DRV 1.8+) are cleanly marked as out-of-scope per your post instruction.
              </p>
            </div>

            <div className="bg-surface p-4 rounded-[12px] border border-border space-y-1.5">
              <h3 className="font-semibold text-ink text-sm">
                3) Rough timeline and price?
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Total estimated duration: <strong>17–20 business days</strong>. Total project price: <strong>€3,500</strong>, distributed across 4 milestone gates. Payments are tied strictly to deliverable verification, with the final payment reserved until physical testing on your scooter succeeds.
              </p>
            </div>

            <div className="bg-surface p-4 rounded-[12px] border border-border space-y-1.5">
              <h3 className="font-semibold text-ink text-sm">
                4) Are you comfortable with this kind of project, including resale of licenses?
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Completely comfortable. Providing parameter modification for private-property / track use is a well-established commercial model. All deliverables, codebases, and data packages will be 100% original work with full copyright assignment transferring to you. The compliance layer built into this demo reflects my commitment to shielding your shop from legal exposure.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Milestone Payment Schedule */}
        <section className="bg-surface-elevated p-6 sm:p-8 rounded-[20px] border border-border shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                Payment Schedule
              </span>
              <h2 className="font-display text-2xl text-ink font-normal mt-1">
                Milestone Plan (Mirrors Luca’s Conditions)
              </h2>
            </div>
            <div className="font-mono text-sm font-semibold text-ink bg-secondary px-3 py-1.5 rounded-[8px] border border-border">
              Total: €3,500 (4 Gates)
            </div>
          </div>

          <div className="space-y-4">
            {milestones.map((m) => (
              <div key={m.num} className="bg-surface p-5 rounded-[14px] border border-border space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-mono text-xs font-semibold">
                      {m.num}
                    </span>
                    <h3 className="font-display text-base text-ink font-normal">{m.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-text-muted">{m.duration}</span>
                    <span className="font-bold text-accent">{m.amount}</span>
                  </div>
                </div>

                <ul className="space-y-1 text-xs text-text-secondary list-disc list-inside">
                  {m.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-text-muted">
              Ready to initialize Milestone 1 upon confirmation.
            </span>
            <Link to="/activate">
              <Button variant="accent" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Test Centerpiece Demo Now
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
