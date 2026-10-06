import React, { useState } from 'react';
import { SCOOTER_MODELS, ScooterModel } from '../data/models';
import { PARAMETER_PACKAGES, ParameterPackage } from '../data/packages';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';
import { Search, LayoutGrid, Table, ChevronRight, ShieldAlert, CheckCircle2, Lock, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ModelsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState<'all' | 'Xiaomi' | 'Segway-Ninebot'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'supported' | 'read-only' | 'out-of-scope'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'matrix'>('grid');
  
  // Selected package drawer state
  const [selectedPackage, setSelectedPackage] = useState<ParameterPackage | null>(null);
  const [selectedOutOfScope, setSelectedOutOfScope] = useState<ScooterModel | null>(null);

  const filteredModels = SCOOTER_MODELS.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(search.toLowerCase()) ||
      model.architecture.toLowerCase().includes(search.toLowerCase()) ||
      model.modelCode.toLowerCase().includes(search.toLowerCase());

    const matchesBrand = brandFilter === 'all' || model.brand === brandFilter;
    const matchesStatus = statusFilter === 'all' || model.status === statusFilter;

    return matchesSearch && matchesBrand && matchesStatus;
  });

  const handleCellClick = (model: ScooterModel, packageId?: string) => {
    if (model.status === 'out-of-scope') {
      setSelectedOutOfScope(model);
      return;
    }
    if (packageId && PARAMETER_PACKAGES[packageId]) {
      setSelectedPackage(PARAMETER_PACKAGES[packageId]);
    } else {
      // Default to Pro 2 package preview
      setSelectedPackage(PARAMETER_PACKAGES['PKG-MI-PRO2-228']);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold">
            Hardware Database
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal mt-1">
            Compatibility Matrix
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl">
            Detailed mapping of supported e-scooter platforms, firmware versions, safe parameter margins, and out-of-scope cryptographically locked models.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-secondary/80 p-1 rounded-[8px] border border-border self-start md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors ${
              viewMode === 'grid' ? 'bg-surface-elevated text-ink shadow-sm' : 'text-text-secondary hover:text-ink'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Card Grid</span>
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors ${
              viewMode === 'matrix' ? 'bg-surface-elevated text-ink shadow-sm' : 'text-text-secondary hover:text-ink'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Matrix Table</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="my-6 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by model name, ESC revision, or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-elevated border border-border-strong rounded-[8px] pl-10 pr-3.5 py-2 text-xs text-ink focus:outline-none focus:border-info focus:ring-1 focus:ring-info"
          />
        </div>

        {/* Brand Filter */}
        <div className="sm:col-span-3">
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value as any)}
            className="w-full bg-surface-elevated border border-border-strong rounded-[8px] px-3 py-2 text-xs text-ink focus:outline-none focus:border-info"
          >
            <option value="all">All Manufacturers</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="Segway-Ninebot">Segway-Ninebot</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-4 flex items-center gap-1 bg-secondary/50 p-1 rounded-[8px] border border-border overflow-x-auto">
          {(['all', 'supported', 'read-only', 'out-of-scope'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-[11px] rounded-[6px] capitalize whitespace-nowrap font-medium transition-colors ${
                statusFilter === st ? 'bg-surface-elevated text-ink shadow-sm' : 'text-text-secondary hover:text-ink'
              }`}
            >
              {st === 'all' ? 'All' : st.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Content Rendering */}
      {filteredModels.length === 0 ? (
        <div className="bg-surface rounded-[14px] border border-border p-12 text-center my-6">
          <ShieldAlert className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <h3 className="font-display text-lg text-ink font-normal">No hardware models match your filters</h3>
          <p className="text-xs text-text-secondary mt-1">Try relaxing your search terms or manufacturer filter.</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSearch('');
              setBrandFilter('all');
              setStatusFilter('all');
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="bg-surface-elevated border border-border rounded-[14px] p-5 hover:border-border-strong transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-text-muted uppercase">
                    {model.brand} · {model.releaseYear}
                  </span>
                  <Badge variant={model.status} size="sm">
                    {model.status}
                  </Badge>
                </div>

                <h3 className="font-display text-lg text-ink font-normal">
                  {model.name}
                </h3>
                <div className="text-[11px] font-mono text-text-secondary mt-0.5">
                  Code: {model.modelCode}
                </div>

                <p className="text-xs text-text-secondary mt-3 leading-relaxed">
                  {model.architecture}
                </p>

                {model.status === 'out-of-scope' && (
                  <div className="mt-3 p-2.5 rounded-[8px] bg-secondary text-[11px] text-text-secondary flex items-start gap-2 border border-border">
                    <Lock className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5" />
                    <span>{model.statusReason}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs font-mono text-text-muted">
                  {model.supportedFirmwareCount} / {model.totalFirmwareCount} firmwares
                </span>
                <Link
                  to={`/models/${model.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-accent transition-colors"
                >
                  <span>Specs & limits</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Matrix Table View */
        <div className="bg-surface-elevated rounded-[14px] border border-border overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg border-b border-border text-text-secondary font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-medium">Model</th>
                <th className="py-3 px-4 font-medium">ESC Architecture</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Firmware Versions</th>
                <th className="py-3 px-4 font-medium text-right">Manifest Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredModels.map((m) => (
                <tr key={m.id} className="hover:bg-bg/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-ink text-sm">{m.name}</div>
                    <div className="text-[11px] font-mono text-text-muted">{m.modelCode}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-text-secondary">
                    {m.architecture}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={m.status} size="sm">
                      {m.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1.5">
                      {m.firmwares.map((fw) => (
                        <button
                          key={fw.version}
                          onClick={() => handleCellClick(m, fw.packageId)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                            fw.status === 'supported'
                              ? 'bg-success-tint text-success border-success/30 hover:border-success'
                              : fw.status === 'read-only'
                              ? 'bg-info-tint text-info border-info/30 hover:border-info'
                              : 'bg-secondary text-text-muted border-border hover:bg-secondary/80'
                          }`}
                          title={`Click to inspect package manifest for ${fw.version}`}
                        >
                          {fw.version}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleCellClick(m, m.firmwares[0]?.packageId)}
                      className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover font-medium"
                    >
                      <span>Manifest</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Package Manifest Inspection Drawer */}
      <Drawer
        isOpen={Boolean(selectedPackage)}
        onClose={() => setSelectedPackage(null)}
        title={selectedPackage?.packageId || 'Package Manifest'}
        subtitle={`${selectedPackage?.modelName} · FW ${selectedPackage?.firmwareVersion}`}
      >
        {selectedPackage && (
          <div className="space-y-5 text-left text-xs">
            {/* Manifest Checksum & Signature Banner */}
            <div className="bg-[#16201D] text-[#ECE8E0] p-4 rounded-[12px] font-mono space-y-2">
              <div className="flex items-center justify-between text-[10px] text-white/50 border-b border-white/10 pb-1.5">
                <span>DIGITAL MANIFEST DIGEST</span>
                <span className="text-success font-semibold">VALIDATED</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px]">SHA-256 Digest:</span>
                <span className="text-accent text-[11px] break-all">{selectedPackage.sha256Checksum}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px]">Author Signature:</span>
                <span className="text-white/80 text-[11px]">{selectedPackage.authorSignature}</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-ink text-sm mb-1">Package Scope</h4>
              <p className="text-text-secondary leading-relaxed">{selectedPackage.description}</p>
            </div>

            {/* Changed parameters list */}
            <div>
              <h4 className="font-semibold text-ink text-sm mb-2">Parameter Modifications & Guardrails</h4>
              <div className="space-y-2">
                {selectedPackage.changes.map((c) => (
                  <div key={c.parameterId} className="bg-surface p-3 rounded-[10px] border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-ink">{c.name}</span>
                      <span className="font-mono text-accent font-semibold">{c.newValue}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-text-muted font-mono">
                      <span>Stock OEM: {c.stockValue}</span>
                      <span>Safe Range: {c.guardrailRange}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-success">
                      ✓ {c.safetyMargin}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pre-conditions */}
            <div>
              <h4 className="font-semibold text-ink text-sm mb-2">Pre-flight Hardware Requirements</h4>
              <ul className="space-y-1.5 text-text-secondary">
                {selectedPackage.compatibilityConstraints.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-text-muted">
                Package writes as base64 memory blocks.
              </span>
              <Link to="/activate" onClick={() => setSelectedPackage(null)}>
                <Button size="sm" variant="accent">
                  Test In Activation Wizard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Drawer>

      {/* Out of Scope Explanation Drawer / Modal */}
      <Drawer
        isOpen={Boolean(selectedOutOfScope)}
        onClose={() => setSelectedOutOfScope(null)}
        title="Out of Scope Platform"
        subtitle={selectedOutOfScope?.name}
      >
        {selectedOutOfScope && (
          <div className="space-y-4 text-left text-xs">
            <div className="p-4 rounded-[12px] bg-secondary border border-border text-text-secondary">
              <div className="flex items-center gap-2 text-ink font-semibold mb-1">
                <Lock className="w-4 h-4 text-text-muted" />
                <span>Cryptographic Protection Enforced</span>
              </div>
              <p className="leading-relaxed">
                {selectedOutOfScope.statusReason}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-ink text-sm mb-1">Engineering Boundary Rationale</h4>
              <p className="text-text-secondary leading-relaxed">
                Luca’s project scope strictly excludes bypassing cryptographically locked bootloaders or attempting exploits against hardware secure elements. We honor this boundary unconditionally to guarantee zero liability, zero bricked hardware, and 100% legal compliance for your business.
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedOutOfScope(null)}
                className="w-full"
              >
                Close Notice
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
