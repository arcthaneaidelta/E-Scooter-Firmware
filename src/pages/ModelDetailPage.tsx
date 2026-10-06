import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SCOOTER_MODELS } from '../data/models';
import { TEST_CASES } from '../data/testCases';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ArrowLeft, ArrowRight, ShieldCheck, Lock, CheckCircle2, Cpu, Battery, Gauge } from 'lucide-react';

export const ModelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'firmwares' | 'limits' | 'tests'>('overview');

  const model = SCOOTER_MODELS.find((m) => m.id === id) || SCOOTER_MODELS[0];
  const isOutOfScope = model.status === 'out-of-scope';
  const modelTests = TEST_CASES.filter((t) => t.modelId === model.id);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-left">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/models"
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-ink font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Compatibility Matrix</span>
        </Link>
      </div>

      {/* Model Header */}
      <div className="bg-surface-elevated border border-border rounded-[20px] p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs uppercase text-text-muted">{model.brand}</span>
              <span className="text-text-muted">·</span>
              <span className="font-mono text-xs text-text-muted">{model.modelCode}</span>
              <Badge variant={model.status} size="sm">
                {model.status}
              </Badge>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-ink font-normal">
              {model.name}
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Architecture: {model.architecture} | ESC: {model.escType}
            </p>
          </div>

          <div className="shrink-0">
            {isOutOfScope ? (
              <Button disabled variant="secondary" size="md" leftIcon={<Lock className="w-4 h-4" />}>
                Protected Bootloader
              </Button>
            ) : (
              <Button
                variant="accent"
                size="md"
                onClick={() => navigate('/activate')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Launch Activation
              </Button>
            )}
          </div>
        </div>

        {/* Tab switch bar */}
        <div className="flex items-center gap-2 border-b border-border mt-8 pt-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Platform Specs' },
            { id: 'firmwares', label: `Firmwares (${model.firmwares.length})` },
            { id: 'limits', label: 'Guardrails & Limits' },
            { id: 'tests', label: `Test Results (${modelTests.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-3 text-xs font-medium transition-colors relative whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-primary font-semibold'
                  : 'text-text-secondary hover:text-ink'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface p-5 rounded-[14px] border border-border">
              <div className="text-[10px] font-mono text-text-muted uppercase">Stock Speed Governor</div>
              <div className="text-xl font-mono font-semibold text-ink mt-1">{model.stockTopSpeedKmH} km/h</div>
              <p className="text-xs text-text-secondary mt-1">Road-legal factory baseline.</p>
            </div>
            <div className="bg-surface p-5 rounded-[14px] border border-border">
              <div className="text-[10px] font-mono text-text-muted uppercase">Max Tested Safe Speed</div>
              <div className="text-xl font-mono font-semibold text-accent mt-1">{model.maxSafeSpeedKmH} km/h</div>
              <p className="text-xs text-text-secondary mt-1">Verified within back-EMF margin.</p>
            </div>
            <div className="bg-surface p-5 rounded-[14px] border border-border">
              <div className="text-[10px] font-mono text-text-muted uppercase">BLE Chipset</div>
              <div className="text-sm font-mono font-medium text-ink mt-2">{model.bleChipset}</div>
              <p className="text-xs text-text-secondary mt-1">Standard Nordic UART profile.</p>
            </div>
          </div>

          {isOutOfScope && (
            <div className="p-5 rounded-[14px] bg-secondary border border-border text-xs leading-relaxed">
              <div className="flex items-center gap-2 font-semibold text-ink text-sm mb-1">
                <Lock className="w-4 h-4 text-text-secondary" />
                <span>Model Out of Scope: Cryptographically Protected Bootloader</span>
              </div>
              <p className="text-text-secondary">
                {model.statusReason}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'firmwares' && (
        <div className="bg-surface rounded-[14px] border border-border overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg border-b border-border font-mono uppercase text-[10px] text-text-secondary">
              <tr>
                <th className="py-3 px-4">Firmware Version</th>
                <th className="py-3 px-4">Release Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Analysis Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {model.firmwares.map((fw) => (
                <tr key={fw.version} className="hover:bg-bg/40">
                  <td className="py-3 px-4 font-mono font-semibold text-ink">{fw.version}</td>
                  <td className="py-3 px-4 font-mono text-text-muted">{fw.releaseDate}</td>
                  <td className="py-3 px-4">
                    <Badge variant={fw.status} size="sm">{fw.status}</Badge>
                  </td>
                  <td className="py-3 px-4 text-text-secondary">{fw.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'limits' && (
        <div className="space-y-4">
          {model.parameters.length === 0 ? (
            <div className="p-8 text-center bg-surface rounded-[14px] border border-border text-xs text-text-secondary">
              No writable parameter registers defined for this model state.
            </div>
          ) : (
            model.parameters.map((param) => (
              <div key={param.id} className="bg-surface p-5 rounded-[14px] border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-ink text-sm">{param.name}</h4>
                    <p className="text-xs text-text-secondary mt-0.5">{param.description}</p>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <span className="text-text-muted">OEM Stock: </span>
                    <span className="font-semibold text-ink">{param.stockValue} {param.unit}</span>
                  </div>
                </div>

                <div className="my-3 py-2 bg-secondary/50 rounded-[8px] px-3 flex items-center justify-between font-mono text-xs text-text-secondary">
                  <span>Absolute Min: {param.min} {param.unit}</span>
                  <span className="text-success font-medium">Safe Guardrail: {param.safeMin} – {param.safeMax} {param.unit}</span>
                  <span>Absolute Max: {param.max} {param.unit}</span>
                </div>

                <div className="text-xs text-text-muted flex items-center gap-1.5 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span>{param.guardrailNote}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'tests' && (
        <div className="space-y-3">
          {modelTests.length === 0 ? (
            <div className="p-8 text-center bg-surface rounded-[14px] border border-border text-xs text-text-secondary">
              View the complete QA suite in the <Link to="/test-report" className="text-accent underline font-medium">Test Report page</Link>.
            </div>
          ) : (
            modelTests.map((t) => (
              <div key={t.id} className="bg-surface p-4 rounded-[12px] border border-border flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-text-muted">{t.testCaseNumber}</span>
                    <span className="font-medium text-ink">{t.title}</span>
                  </div>
                  <div className="text-[11px] text-text-secondary mt-1">{t.expectedResult}</div>
                </div>
                <Badge variant={t.status === 'PASS' ? 'supported' : 'warning'} size="sm">
                  {t.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
