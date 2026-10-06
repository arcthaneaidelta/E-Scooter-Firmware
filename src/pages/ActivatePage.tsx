import React, { useState } from 'react';
import { useWizardStore } from '../store/wizardStore';
import { DISCOVERABLE_DEVICES, SimulatedBleDevice } from '../lib/bleSimulator';
import { Stepper } from '../components/ui/Stepper';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { GuardrailSlider } from '../components/app/GuardrailSlider';
import { PreflightLog } from '../components/app/PreflightLog';
import { DiffTable } from '../components/app/DiffTable';
import { Modal } from '../components/ui/Modal';
import {
  ShieldCheck,
  Battery,
  Thermometer,
  Wifi,
  WifiOff,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Radio,
  FileCheck,
  Download,
  AlertOctagon,
  Sliders,
  Terminal,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ActivatePage: React.FC = () => {
  const {
    currentStep,
    goToStep,
    licenseKey,
    setLicenseKey,
    isLicenseVerified,
    verifyLicense,
    region,
    consentGiven,
    setConsent,
    isScanning,
    startScanning,
    connectedDevice,
    selectDevice,
    deviceError,
    isBackingUp,
    backupRecord,
    runBackup,
    parameters,
    updateParameter,
    applyPreset,
    isWriting,
    writeBlock,
    totalBlocks,
    isConnectionLost,
    isRolledBack,
    isCompleted,
    startWriteSequence,
    resumeVerification,
    rollbackToStock,
    abortAndRestore,
    resetWizard,
    logs,
  } = useWizardStore();

  const [inputKey, setInputKey] = useState(licenseKey);
  const [inputRegion, setInputRegion] = useState(region);
  const [inputConsent, setInputConsent] = useState(consentGiven);
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [showAbortModal, setShowAbortModal] = useState(false);

  // Region legal speed notice lookup
  const getLegalNote = (reg: string) => {
    if (reg.includes('Germany')) return 'German StVZO limit on public infrastructure is 20 km/h.';
    if (reg.includes('United Kingdom')) return 'UK public highway limit is 15.5 mph (25 km/h).';
    if (reg.includes('United States')) return 'US state public laws vary between 15–20 mph.';
    return 'EU standard public road cap is 25 km/h.';
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-left">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold">
            Execution Center
          </span>
          <h1 className="font-display text-2xl sm:text-3xl text-ink font-normal mt-0.5">
            BLE Parameter Activation Wizard
          </h1>
          <p className="text-xs text-text-secondary">
            Simulated interactive workflow for safe hardware parameter modification and rollback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetWizard}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Wizard
          </Button>
        </div>
      </div>

      {/* 6-Step Progress Stepper */}
      <div className="mb-8">
        <Stepper currentStep={currentStep} onStepClick={(s) => goToStep(s)} />
      </div>

      {/* Main Grid: Left 60% Step Area / Right 40% Live Controller Status & Bus Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Current Active Step */}
        <div className="lg:col-span-7 bg-surface-elevated border border-border rounded-[20px] p-6 sm:p-8 shadow-sm">
          {/* STEP 1: LICENSE */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl text-ink font-normal">
                  Step 1: Validate Activation License
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  Enter your purchased license key to authorize scooter parameter writes.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-medium uppercase tracking-[0.08em] text-text-secondary">
                  Customer License Key
                </label>
                <input
                  type="text"
                  value={inputKey}
                  onChange={(e) => {
                    setInputKey(e.target.value);
                    setLicenseKey(e.target.value);
                  }}
                  placeholder="KSTL-XXXX-XXXX-XXXX"
                  className="w-full bg-surface border border-border-strong font-mono uppercase text-sm rounded-[8px] px-3.5 py-2.5 text-ink focus:outline-none focus:border-info"
                />
                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <span>Preloaded: Marta Hoffmann's unused single license</span>
                  <Link to="/shop" className="text-accent underline font-medium">
                    Need a new key? Shop &rarr;
                  </Link>
                </div>
              </div>

              <div className="p-3.5 rounded-[10px] bg-secondary border border-border text-xs text-text-secondary">
                <div className="font-semibold text-ink mb-0.5">QA Verification Notes:</div>
                <ul className="list-disc list-inside space-y-1 text-[11px]">
                  <li>Valid format keys starting with <code className="font-mono text-ink">KSTL-</code> validate immediately.</li>
                  <li>Try <code className="font-mono text-ink">KSTL-0000-0000-0000</code> to observe revoked key rejection.</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => verifyLicense()}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Verify & Proceed
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: CONSENT */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl text-ink font-normal">
                  Step 2: Private Property Compliance Gate
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  Enforces jurisdictional compliance before any parameter adjustments can be configured.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-[0.08em] text-text-secondary">
                  Jurisdiction of Operation
                </label>
                <select
                  value={inputRegion}
                  onChange={(e) => setInputRegion(e.target.value)}
                  className="w-full bg-surface border border-border-strong rounded-[8px] px-3.5 py-2.5 text-xs text-ink focus:outline-none"
                >
                  <option value="Germany (Private Track / StVZO off-road)">Germany (Private Track / StVZO off-road)</option>
                  <option value="United Kingdom (Private Land / Closed Circuit)">United Kingdom (Private Land / Closed Circuit)</option>
                  <option value="European Union (Private Course)">European Union (Private Course)</option>
                  <option value="United States (Closed Facility)">United States (Closed Facility)</option>
                </select>
              </div>

              {/* Legal Limit Warning Box */}
              <div className="p-4 rounded-[12px] bg-warning-tint border border-warning/30 text-xs text-[#87550E] space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span>Regional Road-Legal Benchmark:</span>
                </div>
                <p className="leading-relaxed">
                  {getLegalNote(inputRegion)} Modifying performance ceiling on public thoroughfares is strictly prohibited under local transport laws.
                </p>
              </div>

              <label className="p-4 rounded-[12px] bg-surface border border-border-strong flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputConsent}
                  onChange={(e) => setInputConsent(e.target.checked)}
                  className="mt-1 rounded text-primary border-border focus:ring-primary"
                />
                <span className="text-xs text-text-secondary leading-relaxed">
                  I explicitly acknowledge and confirm that modified scooter performance parameters will strictly be utilized on <strong className="text-ink">private property</strong> or authorized closed racetracks only. I hold harmless the vendor from any non-compliant road use.
                </span>
              </label>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => goToStep(1)}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  disabled={!inputConsent}
                  onClick={() => setConsent(true, inputRegion)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Confirm Compliance
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: IDENTIFY */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl text-ink font-normal">
                  Step 3: Discover & Identify Peripheral
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  Connect over simulated Web Bluetooth. The gatekeeper verifies model, firmware version, and cryptographic flags.
                </p>
              </div>

              {deviceError && (
                <div className="p-4 rounded-[12px] bg-error-tint border border-error/30 text-xs text-[#822E27] space-y-2">
                  <div className="font-semibold flex items-center gap-2">
                    <Lock className="w-4 h-4 text-error" />
                    <span>Connection Rejected by Security Gatekeeper</span>
                  </div>
                  <p className="leading-relaxed">{deviceError}</p>
                </div>
              )}

              {/* Simulated Device Chooser */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-medium text-text-secondary">
                  <span>Available Simulated Peripherals in BLE Range:</span>
                  <span className="font-mono text-[10px] text-text-muted">Web Bluetooth Mock</span>
                </div>

                <div className="space-y-2">
                  {DISCOVERABLE_DEVICES.map((dev) => (
                    <div
                      key={dev.macAddress}
                      onClick={() => selectDevice(dev)}
                      className="p-4 rounded-[12px] bg-surface border border-border hover:border-border-strong hover:bg-secondary/40 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
                          <Radio className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-ink group-hover:text-primary transition-colors">
                            {dev.advertisingName}
                          </div>
                          <div className="text-[11px] font-mono text-text-secondary">
                            {dev.modelName} · FW {dev.firmwareVersion}
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-2">
                        <Badge variant={dev.status} size="sm">
                          {dev.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-start">
                <Button variant="ghost" size="sm" onClick={() => goToStep(2)}>
                  Back
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: BACKUP */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl text-ink font-normal">
                  Step 4: Non-Volatile Pre-Write Memory Backup
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  A cryptographic backup is mandated before any writing can occur. This gives the customer 100% reversible stock restoration.
                </p>
              </div>

              {backupRecord ? (
                <div className="p-5 rounded-[14px] bg-success-tint border border-success/30 text-xs space-y-3">
                  <div className="flex items-center gap-2 text-success font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span>Factory Baseline Snapshot Secured</span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-[8px] font-mono text-[11px] text-ink space-y-1">
                    <div><strong>Backup ID:</strong> {backupRecord.id}</div>
                    <div><strong>SHA-256 Digest:</strong> {backupRecord.sha256Checksum}</div>
                    <div><strong>Model:</strong> {backupRecord.modelName} ({backupRecord.firmwareVersion})</div>
                  </div>
                  <p className="text-[#28573D] text-[11px]">
                    ✓ Stored permanently in your browser account vault. You can trigger "Restore to stock" anytime.
                  </p>
                </div>
              ) : (
                <div className="p-6 rounded-[14px] bg-surface border border-border text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-secondary text-primary mx-auto flex items-center justify-center">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display text-base text-ink font-normal">Ready to compile factory snapshot</h4>
                    <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
                      Extracts 64-byte parameter table from ESC flash registers, digests SHA-256 checksum, and saves to local storage.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    isLoading={isBackingUp}
                    onClick={() => runBackup()}
                  >
                    Generate Pre-Write Backup
                  </Button>
                </div>
              )}

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => goToStep(3)}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  disabled={!backupRecord}
                  onClick={() => goToStep(5)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Proceed to Configuration
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: CONFIGURE & WRITE */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl text-ink font-normal">
                  Step 5: Guarded Parameter Tuning & Flash
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  Adjust top speed and phase current within safe bounds. All sliders automatically enforce hardware safety guardrails.
                </p>
              </div>

              {/* Mode Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-[0.08em] text-text-secondary">
                  Preset Configuration Profiles
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => applyPreset('stock')}
                    className="p-2.5 rounded-[8px] bg-surface border border-border hover:border-border-strong text-xs font-medium text-ink text-center"
                  >
                    OEM Stock (25 km/h)
                  </button>
                  <button
                    onClick={() => applyPreset('eco')}
                    className="p-2.5 rounded-[8px] bg-surface border border-border hover:border-border-strong text-xs font-medium text-ink text-center"
                  >
                    Eco Range (20 km/h)
                  </button>
                  <button
                    onClick={() => applyPreset('standard')}
                    className="p-2.5 rounded-[8px] bg-surface border border-border hover:border-border-strong text-xs font-medium text-ink text-center"
                  >
                    Standard (28 km/h)
                  </button>
                  <button
                    onClick={() => applyPreset('private-track')}
                    className="p-2.5 rounded-[8px] bg-accent/10 border border-accent/30 text-xs font-medium text-accent text-center"
                  >
                    Private Track (33 km/h)
                  </button>
                </div>
              </div>

              {/* Guardrail Sliders */}
              <div className="space-y-3">
                <GuardrailSlider
                  label="Top Speed Limit Ceiling"
                  unit="km/h"
                  value={parameters.speedLimit}
                  min={15}
                  max={40}
                  safeMin={20}
                  safeMax={34}
                  stockValue={25}
                  guardrailMessage="Motor back-EMF headroom on stock 36V battery requires keeping target ≤ 34 km/h."
                  onChange={(val) => updateParameter('speedLimit', val)}
                />

                <GuardrailSlider
                  label="Nominal Motor Phase Current"
                  unit="A"
                  value={parameters.motorCurrent}
                  min={12}
                  max={32}
                  safeMin={15}
                  safeMax={25}
                  stockValue={17}
                  guardrailMessage="Phase currents above 25A induce heavy MOSFET junction heating on factory heatsinks."
                  onChange={(val) => updateParameter('motorCurrent', val)}
                />
              </div>

              {/* Writing Progress / WOW MOMENT: Connection Loss Alert Box */}
              {isConnectionLost && (
                <div className="p-5 rounded-[14px] bg-warning-tint border border-warning/40 text-xs space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 font-semibold text-warning text-sm">
                    <WifiOff className="w-5 h-5 text-warning shrink-0" />
                    <span>Safe Abort: Connection Severed Mid-Write</span>
                  </div>
                  <p className="text-[#87550E] leading-relaxed">
                    Packet transfer halted at block {writeBlock} of {totalBlocks}. Because writes are staged atomically, the controller discarded the uncommitted payload. <strong className="text-ink">Hardware remains in 100% safe, uncorrupted OEM condition.</strong>
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    <Button variant="primary" size="sm" onClick={resumeVerification}>
                      Reconnect & Retry Write
                    </Button>
                    <Button variant="secondary" size="sm" onClick={rollbackToStock}>
                      Roll Back to Stock Backup
                    </Button>
                  </div>
                </div>
              )}

              {/* Staged block writing active progress */}
              {isWriting && (
                <div className="p-5 rounded-[14px] bg-[#16201D] text-[#ECE8E0] space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-white/60">
                    <span>TRANSMITTING BASE64 BLOCKS</span>
                    <span>BLOCK {writeBlock} OF {totalBlocks}</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${(writeBlock / totalBlocks) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-white/50">
                    <span>Atomic buffer open</span>
                    <span>Tip: Try "Simulate connection loss" in demo toolbar!</span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowDiffModal(true)}
                >
                  Review Diff Table
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAbortModal(true)}
                  >
                    Abort & Revert
                  </Button>
                  <Button
                    variant="accent"
                    size="md"
                    disabled={isWriting}
                    onClick={() => startWriteSequence()}
                  >
                    {isWriting ? 'Writing to ESC...' : 'Write Parameters to Scooter'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: VERIFY */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-success-tint text-success mx-auto flex items-center justify-center mb-3 border border-success/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl text-ink font-normal">
                  {isRolledBack ? 'Reverted Cleanly to Factory Stock' : 'Activation & Verification Successful'}
                </h3>
                <p className="text-xs text-text-secondary mt-1 max-w-md mx-auto">
                  {isRolledBack
                    ? 'All controller registers have been bitwise restored to OEM baseline specifications.'
                    : 'All 8 parameter blocks committed cleanly. Read-back verification confirmed bitwise register parity.'}
                </p>
              </div>

              {/* Verified Parameters Summary */}
              <div className="bg-surface rounded-[14px] border border-border p-4 text-xs font-mono space-y-2">
                <div className="text-text-muted text-[10px] uppercase border-b border-border pb-1.5 flex justify-between">
                  <span>Hardware State</span>
                  <span className="text-success font-semibold">VERIFIED BITWISE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Effective Top Speed Limit:</span>
                  <span className="font-semibold text-ink">{parameters.speedLimit} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Phase Current Allocation:</span>
                  <span className="font-semibold text-ink">{parameters.motorCurrent} A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">ESC Thermal Cutoff:</span>
                  <span className="font-semibold text-ink">{parameters.tempCutoff} °C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Active Digital Signature:</span>
                  <span className="text-accent">ED25519:7b92...41a0</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={rollbackToStock}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Restore to OEM Stock
                </Button>

                <div className="flex items-center gap-2">
                  <Link to="/test-report">
                    <Button variant="secondary" size="sm">
                      View QA Test Report
                    </Button>
                  </Link>
                  <Link to="/account">
                    <Button variant="primary" size="sm">
                      Go to My Account
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Persistent Device Info Card & Live Terminal Log */}
        <div className="lg:col-span-5 space-y-5">
          {/* Persistent Device Status Card */}
          <div className="bg-surface-elevated border border-border rounded-[16px] p-5 shadow-sm text-left">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success pulse-subtle" />
                <span className="text-xs font-semibold uppercase tracking-wider text-ink">
                  Hardware Status
                </span>
              </div>
              <Badge variant={connectedDevice ? 'active' : 'unused'} size="sm">
                {connectedDevice ? 'Paired' : 'Standby'}
              </Badge>
            </div>

            {connectedDevice ? (
              <div className="space-y-3 text-xs">
                <div>
                  <div className="font-semibold text-ink text-sm">{connectedDevice.modelName}</div>
                  <div className="text-[11px] font-mono text-text-muted">{connectedDevice.advertisingName} [{connectedDevice.macAddress}]</div>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                  <div className="bg-surface p-2 rounded-[6px] border border-border">
                    <div className="text-text-muted text-[10px] flex items-center gap-1">
                      <Battery className="w-3 h-3 text-success" /> Battery
                    </div>
                    <div className="font-semibold text-ink mt-0.5">{connectedDevice.batteryPercent}% SoC</div>
                  </div>
                  <div className="bg-surface p-2 rounded-[6px] border border-border">
                    <div className="text-text-muted text-[10px] flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-warning" /> ESC Temp
                    </div>
                    <div className="font-semibold text-ink mt-0.5">{connectedDevice.temperatureC}°C</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between font-mono text-[11px] text-text-secondary">
                  <span>Firmware: {connectedDevice.firmwareVersion}</span>
                  <span className="text-success">RSSI: {connectedDevice.rssiDbm} dBm</span>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-text-secondary">
                <p>No peripheral paired yet.</p>
                <p className="text-[11px] text-text-muted mt-1">Advances automatically upon device discovery.</p>
              </div>
            )}
          </div>

          {/* Live Hardware Preflight & Diagnostic Log */}
          <PreflightLog logs={logs} maxHeight="max-h-[380px]" />
        </div>
      </div>

      {/* Diff Modal */}
      <Modal
        isOpen={showDiffModal}
        onClose={() => setShowDiffModal(false)}
        title="Parameter Register Diff"
        description="Side-by-side comparison between OEM baseline and target values."
      >
        <div className="space-y-4">
          <DiffTable
            currentConfig={parameters}
            onRestoreStock={() => {
              applyPreset('stock');
              setShowDiffModal(false);
            }}
          />
          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={() => setShowDiffModal(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* Abort Confirmation Modal */}
      <Modal
        isOpen={showAbortModal}
        onClose={() => setShowAbortModal(false)}
        title="Abort Configuration Write?"
        description="Confirm cancellation of the current parameter update."
      >
        <div className="space-y-4 text-xs text-text-secondary">
          <p>
            Any uncommitted staged blocks will be discarded. The scooter will retain or revert back to its factory OEM parameters.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setShowAbortModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setShowAbortModal(false);
                abortAndRestore();
              }}
            >
              Abort & Revert to Stock
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
