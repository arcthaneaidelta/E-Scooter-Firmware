import React from 'react';
import { ParameterConfig } from '../../store/wizardStore';
import { ArrowRight, RotateCcw } from 'lucide-react';

interface DiffTableProps {
  currentConfig: ParameterConfig;
  onRestoreStock?: () => void;
  showRestoreAction?: boolean;
}

export const DiffTable: React.FC<DiffTableProps> = ({
  currentConfig,
  onRestoreStock,
  showRestoreAction = true,
}) => {
  const rows = [
    {
      id: 'speed',
      name: 'Top Speed Ceiling',
      stock: '25 km/h',
      proposed: `${currentConfig.speedLimit} km/h`,
      changed: currentConfig.speedLimit !== 25,
      delta: currentConfig.speedLimit - 25,
      safeRange: '20–34 km/h',
      guardrail: 'Safe below motor back-EMF threshold',
    },
    {
      id: 'current',
      name: 'Phase Current Limit',
      stock: '17 A',
      proposed: `${currentConfig.motorCurrent} A`,
      changed: currentConfig.motorCurrent !== 17,
      delta: currentConfig.motorCurrent - 17,
      safeRange: '15–25 A',
      guardrail: 'MOSFET thermal dissipation protected',
    },
    {
      id: 'regen',
      name: 'Regenerative Braking',
      stock: 'Level 1',
      proposed: `Level ${currentConfig.regenStrength}`,
      changed: currentConfig.regenStrength !== 1,
      delta: currentConfig.regenStrength - 1,
      safeRange: '0–3',
      guardrail: 'Peak back-voltage surge < 42.6V',
    },
    {
      id: 'temp',
      name: 'ESC Thermal Cutoff',
      stock: '70 °C',
      proposed: `${currentConfig.tempCutoff} °C`,
      changed: currentConfig.tempCutoff !== 70,
      delta: currentConfig.tempCutoff - 70,
      safeRange: '65–72 °C',
      guardrail: 'Tighter threshold maintains lifespan',
    },
  ];

  return (
    <div className="bg-surface rounded-[14px] border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-elevated">
        <div>
          <h4 className="text-sm font-semibold text-ink">Parameter Register Inspection</h4>
          <p className="text-xs text-text-secondary">Comparing factory OEM baseline with target configuration</p>
        </div>
        {showRestoreAction && onRestoreStock && (
          <button
            onClick={onRestoreStock}
            className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to stock
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-bg border-b border-border text-text-secondary font-mono uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-2.5 px-4 font-medium">Parameter</th>
              <th className="py-2.5 px-4 font-medium">OEM Factory</th>
              <th className="py-2.5 px-4 font-medium">Target Value</th>
              <th className="py-2.5 px-4 font-medium">Safe Boundary</th>
              <th className="py-2.5 px-4 font-medium">Safety Margin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr
                key={row.id}
                className={row.changed ? 'bg-accent/[0.03] hover:bg-accent/[0.06]' : 'hover:bg-bg/50'}
              >
                <td className="py-3 px-4 font-medium text-ink flex items-center gap-2">
                  {row.changed && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" title="Modified parameter" />
                  )}
                  {row.name}
                </td>
                <td className="py-3 px-4 font-mono text-text-muted">{row.stock}</td>
                <td className="py-3 px-4 font-mono font-medium">
                  <span className="flex items-center gap-1.5">
                    {row.changed ? (
                      <>
                        <span className="text-accent font-semibold">{row.proposed}</span>
                        <span className="text-[10px] text-accent/80">
                          ({row.delta > 0 ? `+${row.delta}` : row.delta})
                        </span>
                      </>
                    ) : (
                      <span className="text-text-secondary">{row.proposed}</span>
                    )}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-success">{row.safeRange}</td>
                <td className="py-3 px-4 text-text-muted text-[11px]">{row.guardrail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
