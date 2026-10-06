import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'How do you guarantee a scooter cannot be bricked during parameter updates?',
    a: 'Every write transaction uses staged memory buffers and pre-flight gatekeeping. Before any bytes are sent, we verify the battery is ≥ 30%, controller temperature is within safe limits, and generate an exact SHA-256 backup of factory memory. Write commands are executed with CRC verification per block. If any packet drops, the controller staging buffer is discarded, leaving the scooter in its original factory state.'
  },
  {
    q: 'Why are certain models explicitly listed as "Out of scope"?',
    a: 'Per your job posting requirement: "No bypassing of cryptographic protection or locked bootloaders." Newer revisions (such as Xiaomi 4 Ultra or Segway GT2 with RSA-signed bootloaders) enforce proprietary dealer cryptosystems. Attempting to bypass these carries high bricking and liability risks. We explicitly exclude locked bootloaders to maintain a 100% dependable, safe service for supported models.'
  },
  {
    q: 'How does this integrate with your existing Web Bluetooth shop page and license server?',
    a: 'We provide structured base64 command manifests indexed by model code and firmware version. Each package contains atomic command chunks with pre-computed checksums and guardrail validation rules. Your Web Bluetooth page loads the authorized package for the customer’s verified device after validating the license key with your server.'
  },
  {
    q: 'What happens if a customer’s phone loses Bluetooth or dies mid-write?',
    a: 'We have built a dedicated "Simulate connection loss" control in this demo to prove this exact scenario. Because writes are atomic and verified sequentially, a dropped connection triggers an automatic abort on the scooter side. The uncommitted buffer is discarded, and the existing OEM firmware remains untouched. When the user reconnects, our software verifies memory integrity and offers a seamless resume or rollback.'
  },
  {
    q: 'Can the customer restore back to factory stock settings anytime?',
    a: 'Yes, with a single tap. The pre-flight backup created before the initial write is saved both in browser local storage and can be mirrored to your license server. A "Restore to Stock" routine writes the original OEM table back to the controller, completely returning top speed, current limits, and KERS behavior to factory specifications.'
  },
  {
    q: 'How are legal limits and private-property acknowledgments enforced?',
    a: 'Our flow introduces an integrated compliance consent layer. Customers must select their jurisdiction and explicitly certify that modified speed ceilings will only be used on private property / closed circuits. The UI displays the local road-legal limit (e.g. 20 km/h in Germany, 25 km/h in the EU/UK) alongside the disclaimer to protect your business.'
  }
];

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 text-left">
      <div className="text-center mb-12">
        <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold">
          Technical Assurance
        </span>
        <h2 className="font-display text-3xl sm:text-4xl text-ink font-normal mt-2">
          Frequently Asked Questions
        </h2>
        <p className="text-text-secondary text-sm sm:text-base mt-2">
          Direct answers regarding safety, hardware compatibility, and deployment architecture.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-surface border border-border rounded-[14px] overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-display text-base text-ink hover:text-primary transition-colors focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-text-muted shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-ink' : ''
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-200 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-border/50 pt-3">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
