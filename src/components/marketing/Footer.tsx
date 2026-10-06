import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Check, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.email || !formState.name) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      setFormState({ name: '', email: '', message: '' });
    }, 1200);
  };

  return (
    <footer className="bg-[#16201D] text-[#ECE8E0] pt-16 pb-12 border-t border-[#2A3732] relative overflow-hidden text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-14 pb-10 border-b border-white/10">
          <h2 className="font-display text-3xl sm:text-4xl text-white font-normal max-w-lg">
            Built carefully. Tested on real scooters.
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-2 max-w-md">
            Prepared as a bespoke prototype demonstrating the safety, protocol architecture, and client deliverables for Luca’s project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Col 1: CTA */}
          <div className="md:col-span-4 space-y-4">
            <div className="font-display text-xl text-white">Kestrel Activate</div>
            <p className="text-xs text-white/70 leading-relaxed">
              Firmware parameter modulation framework with transactional safety rollbacks, verifiable pre-write snapshots, and complete compliance documentation.
            </p>
            <div className="pt-2">
              <Link to="/about-demo">
                <Button variant="accent" size="sm">
                  Review Proposal & Milestones
                </Button>
              </Link>
            </div>
          </div>

          {/* Col 2: Navigation Columns */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6 text-xs">
            <div>
              <div className="font-mono uppercase tracking-wider text-white/40 mb-3 text-[10px]">
                Product
              </div>
              <ul className="space-y-2 text-white/70">
                <li><Link to="/activate" className="hover:text-white transition-colors">Activation Wizard</Link></li>
                <li><Link to="/models" className="hover:text-white transition-colors">Compatibility Matrix</Link></li>
                <li><Link to="/shop" className="hover:text-white transition-colors">License Store</Link></li>
                <li><Link to="/account" className="hover:text-white transition-colors">Client Account</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-mono uppercase tracking-wider text-white/40 mb-3 text-[10px]">
                Engineering
              </div>
              <ul className="space-y-2 text-white/70">
                <li><Link to="/test-report" className="hover:text-white transition-colors">QA Test Report (48)</Link></li>
                <li><Link to="/docs" className="hover:text-white transition-colors">Documentation Hub</Link></li>
                <li><Link to="/legal" className="hover:text-white transition-colors">Private Property Terms</Link></li>
                <li><Link to="/about-demo" className="hover:text-white transition-colors">Luca’s 4 Answers</Link></li>
              </ul>
            </div>
          </div>

          {/* Col 3: Contact Form */}
          <div className="md:col-span-4 bg-white/[0.04] p-5 rounded-[16px] border border-white/10">
            <div className="text-xs font-semibold uppercase tracking-wider text-white mb-1">
              Start Project Inquiry
            </div>
            <p className="text-[11px] text-white/60 mb-3">
              Direct communication for milestone setup & testing.
            </p>

            {isSent ? (
              <div className="p-4 rounded-[10px] bg-success/20 border border-success/40 text-xs text-[#A6E8BF] flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 text-success" />
                <span>Thanks. I'll reply within one working day.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
                <input
                  type="text"
                  required
                  placeholder="Your Name (e.g. Luca)"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-[6px] px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-accent text-xs"
                />
                <input
                  type="email"
                  required
                  placeholder="Your Email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-[6px] px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-accent text-xs"
                />
                <textarea
                  rows={2}
                  placeholder="Project specifications or timeline notes..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-[6px] px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-accent text-xs"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  isLoading={isLoading}
                  className="w-full !bg-white !text-dark hover:!bg-white/90"
                >
                  Send Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar with mandatory Simulated Device Tag */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/50 gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/15 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Interactive prototype · simulated device
            </span>
            <span>All rights and IP transfer to client upon milestone acceptance</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/legal" className="hover:underline">Legal & Compliance</Link>
            <Link to="/about-demo" className="hover:underline text-accent">About this demo</Link>
          </div>
        </div>
      </div>

      {/* Large subtle wordmark cropped at bottom */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-display text-[9rem] sm:text-[14rem] font-bold text-white/[0.02] pointer-events-none select-none tracking-tighter">
        KESTREL
      </div>
    </footer>
  );
};
