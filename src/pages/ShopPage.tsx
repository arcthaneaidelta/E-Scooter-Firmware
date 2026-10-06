import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { api } from '../lib/api';
import { CheckCircle2, Shield, Copy, Check, ArrowRight, CreditCard, AlertCircle, Sparkles } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<'Single Device' | '3-Pack' | 'Reseller Bundle'>('Single Device');
  const [email, setEmail] = useState('marta.hoffmann@example.com');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('884');
  const [region, setRegion] = useState('Germany (Private Circuit)');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [privatePropertyAccepted, setPrivatePropertyAccepted] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purchasedKey, setPurchasedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const plans = [
    {
      id: 'Single Device',
      price: '€29',
      period: 'one-time',
      tag: 'Most Popular',
      desc: 'Single scooter activation license with permanent stock restore rights and backup vault.',
      features: [
        '1 Scooter binding entitlement',
        'Automatic OEM flash backup',
        'Unlimited restore to stock',
        'Private-property mode unlocked',
      ],
    },
    {
      id: '3-Pack',
      price: '€69',
      period: 'one-time',
      tag: 'Best Value',
      desc: 'Ideal for enthusiasts with multiple scooters or track days.',
      features: [
        '3 Independent license tokens',
        'Multi-device account dashboard',
        'Full backup & diff history',
        'Priority protocol updates',
      ],
    },
    {
      id: 'Reseller Bundle',
      price: '€199',
      period: '10 tokens',
      tag: 'Commercial Tier',
      desc: 'Wholesale batch for tuning shops and fleet operators on private facilities.',
      features: [
        '10 Reseller license keys',
        'API validation endpoint integration',
        'Dedicated compliance manifests',
        'Custom base64 command export',
      ],
    },
  ];

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!termsAccepted || !privatePropertyAccepted) {
      setError('You must accept the terms of service and private property acknowledgment.');
      return;
    }

    setIsLoading(true);
    try {
      const license = await api.createOrder({
        plan: selectedPlan,
        email,
        cardNumber,
        cardExpiry,
        cardCvc,
        termsAccepted,
        privatePropertyAccepted,
        region,
      });
      setPurchasedKey(license.key);
    } catch (err: any) {
      setError(err.message || 'Payment processing failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyKey = () => {
    if (purchasedKey) {
      navigator.clipboard.writeText(purchasedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-left">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold">
          Commercial Licensing
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal mt-1">
          Activation License Store
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-2">
          Demonstrates your end-customer storefront flow. Generates verifiable license tokens recognized by the activation wizard.
        </p>
      </div>

      {purchasedKey ? (
        /* Purchase Success State */
        <div className="bg-surface-elevated border border-border rounded-[20px] p-8 max-w-lg mx-auto shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-success-tint text-success mx-auto flex items-center justify-center mb-4 border border-success/30">
            <Check className="w-6 h-6" />
          </div>
          <h2 className="font-display text-2xl text-ink font-normal">License Issued Successfully</h2>
          <p className="text-xs text-text-secondary mt-1">
            Your license token is active and ready to pair with your scooter.
          </p>

          <div className="my-6 p-4 rounded-[12px] bg-secondary border border-border font-mono text-base font-semibold text-ink flex items-center justify-between">
            <span>{purchasedKey}</span>
            <button
              onClick={copyKey}
              className="p-1.5 text-text-secondary hover:text-ink rounded hover:bg-white/60 transition-colors"
              title="Copy license key"
            >
              {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Button
              variant="accent"
              size="md"
              onClick={() => navigate('/activate')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Go to Activation Wizard
            </Button>
            <Link to="/account">
              <Button variant="secondary" size="md" className="w-full sm:w-auto">
                View in Account
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Checkout flow */
        <div className="space-y-10">
          {/* Plan Selector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((p) => {
              const isSelected = selectedPlan === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id as any)}
                  className={`p-6 rounded-[16px] border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-surface-elevated border-2 border-primary shadow-md'
                      : 'bg-surface border-border hover:border-border-strong shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        {p.id}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-text-muted">
                        {p.tag}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 my-2">
                      <span className="font-mono text-3xl font-bold text-ink">{p.price}</span>
                      <span className="text-xs text-text-muted">/{p.period}</span>
                    </div>

                    <p className="text-xs text-text-secondary mt-2 leading-relaxed">{p.desc}</p>
                  </div>

                  <ul className="space-y-2 mt-6 pt-4 border-t border-border text-xs text-text-secondary">
                    {p.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Checkout Details Form */}
          <div className="bg-surface-elevated border border-border rounded-[20px] p-6 sm:p-8 max-w-2xl mx-auto shadow-sm">
            <h3 className="font-display text-xl text-ink font-normal mb-1">
              Order Details & Compliance Agreement
            </h3>
            <p className="text-xs text-text-secondary mb-6">
              Complete mock checkout to acquire your activation token.
            </p>

            {error && (
              <div className="mb-6 p-3.5 rounded-[10px] bg-error-tint border border-error/30 text-xs text-[#822E27] flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-error mt-0.5" />
                <div>
                  <div className="font-semibold">Payment Exception</div>
                  <div>{error}</div>
                </div>
              </div>
            )}

            {/* QA Test tip notice */}
            <div className="mb-6 p-3 rounded-[8px] bg-secondary border border-border text-[11px] text-text-secondary flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>Test note: Card ending in <strong className="font-mono text-ink">0002</strong> triggers a simulated decline test per PRD §24.</span>
              </span>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4 text-xs">
              <Input
                label="Purchaser Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <Input
                    label="Payment Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    leftIcon={<CreditCard className="w-4 h-4" />}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Expiry"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                  <Input
                    label="CVC"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-[0.08em] text-text-secondary mb-1.5">
                  Jurisdiction & Track Type
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-surface-elevated border border-border-strong rounded-[6px] px-3.5 py-2.5 text-xs text-ink focus:outline-none"
                >
                  <option value="Germany (Private Circuit)">Germany — Private Track Only (StVZO Public limit: 20 km/h)</option>
                  <option value="United Kingdom (Private Land)">UK — Private Land Only (Road limit: 15.5 mph / 25 km/h)</option>
                  <option value="European Union (Closed Course)">EU — Closed Course Circuit (Public limit: 25 km/h)</option>
                  <option value="United States (Private Facility)">US — Private Facility Only</option>
                </select>
              </div>

              {/* Compliance Checkboxes */}
              <div className="pt-2 space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privatePropertyAccepted}
                    onChange={(e) => setPrivatePropertyAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-border-strong text-primary focus:ring-primary"
                  />
                  <span className="text-[11px] text-text-secondary leading-snug">
                    I certify under penalty of terms that any modified speed parameters will be operated solely on private property / closed circuits, and not on public roadways without local authorization.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-border-strong text-primary focus:ring-primary"
                  />
                  <span className="text-[11px] text-text-secondary leading-snug">
                    I acknowledge that software updates retain full stock reversal capabilities and accept the digital licensing terms.
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="font-mono text-sm font-semibold text-ink">
                  Total: {plans.find((p) => p.id === selectedPlan)?.price}
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                >
                  Confirm & Issue License
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
