import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface GuardrailSliderProps {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  safeMin: number;
  safeMax: number;
  stockValue: number;
  guardrailMessage: string;
  description?: string;
  step?: number;
  onChange: (val: number) => void;
}

export const GuardrailSlider: React.FC<GuardrailSliderProps> = ({
  label,
  unit,
  value,
  min,
  max,
  safeMin,
  safeMax,
  stockValue,
  guardrailMessage,
  description,
  step = 1,
  onChange,
}) => {
  const [snapNotice, setSnapNotice] = useState<string | null>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = Number(e.target.value);

    if (rawVal > safeMax) {
      setSnapNotice(`Clamped to ${safeMax} ${unit}. ${guardrailMessage}`);
      onChange(safeMax);
      setTimeout(() => setSnapNotice(null), 3500);
      return;
    }

    if (rawVal < safeMin) {
      setSnapNotice(`Floor enforced at ${safeMin} ${unit}.`);
      onChange(safeMin);
      setTimeout(() => setSnapNotice(null), 3500);
      return;
    }

    setSnapNotice(null);
    onChange(rawVal);
  };

  const safeRangeLeftPercent = ((safeMin - min) / (max - min)) * 100;
  const safeRangeWidthPercent = ((safeMax - safeMin) / (max - min)) * 100;
  const stockMarkerPercent = ((stockValue - min) / (max - min)) * 100;

  return (
    <div className="bg-surface-elevated border border-border rounded-[14px] p-4 text-left transition-all">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-ink">{label}</h4>
            {value === stockValue ? (
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-secondary text-text-secondary border border-border">
                Stock
              </span>
            ) : value > stockValue ? (
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium border border-accent/20">
                Performance (+{value - stockValue} {unit})
              </span>
            ) : null}
          </div>
          {description && (
            <p className="text-xs text-text-secondary mt-0.5">{description}</p>
          )}
        </div>

        <div className="text-right shrink-0">
          <div className="text-lg font-mono font-semibold text-ink">
            {value} <span className="text-xs font-normal text-text-muted">{unit}</span>
          </div>
          <div className="text-[11px] text-text-muted font-mono">
            OEM: {stockValue} {unit}
          </div>
        </div>
      </div>

      {/* Track & Safe Zone */}
      <div className="relative my-3 pt-2">
        {/* Background track */}
        <div className="relative w-full h-2.5 bg-secondary rounded-full overflow-hidden">
          {/* Safe operational envelope indicator */}
          <div
            className="absolute top-0 bottom-0 bg-[#3F7D5A]/25 border-x border-[#3F7D5A]/40"
            style={{
              left: `${safeRangeLeftPercent}%`,
              width: `${safeRangeWidthPercent}%`,
            }}
          />
        </div>

        {/* OEM Stock tick */}
        <div
          className="absolute top-0 flex flex-col items-center pointer-events-none -translate-x-1/2"
          style={{ left: `${stockMarkerPercent}%` }}
        >
          <div className="w-1.5 h-3.5 bg-text-secondary rounded-full" />
          <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider mt-0.5">
            OEM
          </span>
        </div>

        {/* Real Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="w-full absolute inset-0 opacity-0 cursor-pointer h-7 -top-1"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-text-muted mt-2">
        <span>Min: {min} {unit}</span>
        <span className="text-[#3F7D5A] font-medium flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Safe Range: {safeMin}–{safeMax} {unit}
        </span>
        <span>Max: {max} {unit}</span>
      </div>

      {/* Guardrail Snap Notice */}
      {snapNotice ? (
        <div className="mt-3 p-2.5 rounded-[8px] bg-warning-tint border border-warning/30 flex items-start gap-2 text-xs text-[#87550E] animate-in fade-in slide-in-from-top-1">
          <AlertTriangle className="w-4 h-4 shrink-0 text-warning mt-0.5" />
          <div>
            <span className="font-semibold">Guardrail Engaged: </span>
            {snapNotice}
          </div>
        </div>
      ) : null}
    </div>
  );
};
