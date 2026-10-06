import React, { useRef, useEffect } from 'react';
import { Terminal, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { LogEntry } from '../../store/wizardStore';

interface PreflightLogProps {
  logs: LogEntry[];
  maxHeight?: string;
  title?: string;
}

export const PreflightLog: React.FC<PreflightLogProps> = ({
  logs,
  maxHeight = 'max-h-[300px]',
  title = 'Hardware Bus Diagnostic Stream',
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-[#16201D] text-[#ECE8E0] rounded-[14px] border border-border-strong/40 p-4 font-mono text-xs flex flex-col shadow-inner">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-accent" />
          <span className="font-semibold text-white/90">{title}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-white/50">
          <span className="w-2 h-2 rounded-full bg-success pulse-subtle" />
          <span>BLE TTY 115200</span>
        </div>
      </div>

      <div
        className={`overflow-y-auto ${maxHeight} space-y-1.5 pr-1 font-mono text-[11px] leading-relaxed`}
        aria-live="polite"
      >
        {logs.map((log) => {
          const iconMap = {
            info: <Info className="w-3.5 h-3.5 text-info shrink-0 mt-0.5" />,
            success: <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />,
            warning: <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />,
            error: <XCircle className="w-3.5 h-3.5 text-error shrink-0 mt-0.5" />,
          };

          return (
            <div key={log.id} className="flex items-start gap-2 hover:bg-white/5 p-1 rounded transition-colors">
              <span className="text-white/40 shrink-0 font-mono">[{log.timestamp}]</span>
              {iconMap[log.type]}
              <span
                className={
                  log.type === 'error'
                    ? 'text-[#F4A7A0] font-medium'
                    : log.type === 'success'
                    ? 'text-[#9EE0B7]'
                    : log.type === 'warning'
                    ? 'text-[#F7D18C]'
                    : 'text-white/80'
                }
              >
                {log.text}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
