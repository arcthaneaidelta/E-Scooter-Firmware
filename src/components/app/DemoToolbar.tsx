import React from 'react';
import { useDemoStore } from '../../store/demoStore';
import { useWizardStore } from '../../store/wizardStore';
import { Wrench, WifiOff, RotateCcw, AlertOctagon, X, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';

export const DemoToolbar: React.FC = () => {
  const {
    demoToolbarOpen,
    toggleDemoToolbar,
    tipDismissed,
    dismissTip,
    forcedError,
    toggleForcedError,
    resetAllDemoData,
  } = useDemoStore();

  const { isWriting, triggerConnectionLoss } = useWizardStore();

  return (
    <aside aria-label="Interactive Demo Controls" className="fixed bottom-4 right-4 z-[90] flex flex-col items-end gap-2 text-left font-sans">
      {/* First-time hint tooltip chip */}
      {!tipDismissed && (
        <div className="bg-[#16201D] text-[#ECE8E0] border border-accent/40 rounded-[10px] px-3.5 py-2 text-xs shadow-lg flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-xs">
          <Sparkles className="w-4 h-4 text-accent shrink-0" />
          <span className="text-[11px] leading-tight">
            <strong className="text-white">Reviewer Tip:</strong> In the Activate step, try <span className="text-accent underline font-mono">Simulate connection loss</span> to observe the safe-state abort mechanism!
          </span>
          <button
            onClick={dismissTip}
            className="text-white/50 hover:text-white p-0.5 rounded"
            aria-label="Dismiss hint"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Expanded Controls Panel */}
      {demoToolbarOpen && (
        <div className="bg-surface-elevated border border-border-strong rounded-[16px] shadow-lg p-4 w-72 mb-1 animate-in fade-in zoom-in-[0.98] duration-150">
          <div className="flex items-center justify-between pb-2.5 border-b border-border mb-3">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-wider text-ink">
                Demo QA Controls
              </span>
            </div>
            <button
              onClick={toggleDemoToolbar}
              className="text-text-muted hover:text-ink p-1 rounded"
              aria-label="Close demo toolbar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Connection Loss Button */}
            <div>
              <button
                onClick={triggerConnectionLoss}
                disabled={!isWriting}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[8px] font-medium border transition-colors ${
                  isWriting
                    ? 'bg-warning-tint text-[#87550E] border-warning hover:bg-warning/20 shadow-sm animate-pulse'
                    : 'bg-secondary/60 text-text-muted border-border cursor-not-allowed opacity-60'
                }`}
              >
                <span className="flex items-center gap-2">
                  <WifiOff className="w-4 h-4 text-warning" />
                  <span>Simulate Connection Loss</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1 py-0.5 rounded bg-white/60">
                  {isWriting ? 'Active' : 'Idle'}
                </span>
              </button>
              <p className="text-[10px] text-text-muted mt-1 leading-snug">
                Halts packet transmission mid-write to test transactional safe-state rollback.
              </p>
            </div>

            {/* Toggle Forced Network Error */}
            <div className="pt-2 border-t border-border">
              <button
                onClick={toggleForcedError}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[8px] font-medium border transition-colors ${
                  forcedError
                    ? 'bg-error-tint text-[#822E27] border-error'
                    : 'bg-surface text-ink border-border hover:bg-secondary'
                }`}
              >
                <span className="flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-error" />
                  <span>Force Network Error</span>
                </span>
                <span className="font-mono text-[10px] uppercase">
                  {forcedError ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>

            {/* Reset All Demo Data */}
            <div className="pt-2 border-t border-border">
              <button
                onClick={resetAllDemoData}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[8px] bg-secondary text-ink hover:bg-[#DDD8CD] font-medium border border-border transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-text-secondary" />
                <span>Reset Demo State & DB</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Trigger Toggle Pill */}
      <button
        onClick={toggleDemoToolbar}
        className="flex items-center gap-2 bg-[#16201D] text-[#ECE8E0] hover:text-white px-3.5 py-2 rounded-full border border-border-strong/60 shadow-md text-xs font-medium transition-all hover:scale-105"
        aria-label="Toggle Demo Controls"
      >
        <Wrench className="w-3.5 h-3.5 text-accent" />
        <span>QA Demo Toolbar</span>
        {demoToolbarOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-white/60" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-white/60" />
        )}
      </button>
    </aside>
  );
};
