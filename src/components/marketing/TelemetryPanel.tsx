import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Cpu, Battery, Gauge, Thermometer, Radio } from 'lucide-react';

export const TelemetryPanel: React.FC = () => {
  const [speed, setSpeed] = useState(25);
  const [batt, setBatt] = useState(41.2);
  const [temp, setTemp] = useState(34);
  const [current, setCurrent] = useState(8.4);
  const [bleStatus, setBleStatus] = useState<'Scanning' | 'Verified' | 'Backup OK'>('Backup OK');
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 12-second looping sequence for needle and readouts
  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % 6;
      switch (step) {
        case 0:
          setSpeed(0);
          setBatt(41.8);
          setTemp(29);
          setCurrent(0.0);
          setBleStatus('Scanning');
          break;
        case 1:
          setSpeed(18);
          setBatt(41.4);
          setTemp(31);
          setCurrent(6.2);
          setBleStatus('Verified');
          break;
        case 2:
          // Stock limit pause
          setSpeed(25);
          setBatt(41.2);
          setTemp(33);
          setCurrent(8.4);
          setBleStatus('Verified');
          break;
        case 3:
          // Heading to private-property mode
          setSpeed(29);
          setBatt(40.8);
          setTemp(35);
          setCurrent(14.8);
          setBleStatus('Backup OK');
          break;
        case 4:
          // Settled in private property mode
          setSpeed(33);
          setBatt(40.4);
          setTemp(36);
          setCurrent(18.2);
          setBleStatus('Backup OK');
          break;
        case 5:
          setSpeed(25);
          setBatt(41.0);
          setTemp(34);
          setCurrent(8.0);
          setBleStatus('Backup OK');
          break;
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Subtle mouse shift (<= 6px)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;
    setOffset({
      x: Math.max(-6, Math.min(6, xRatio * 12)),
      y: Math.max(-6, Math.min(6, yRatio * 12)),
    });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  // Angle calculation for gauge: 0 km/h = -90deg, 45 km/h = 90deg
  const needleAngle = -90 + (speed / 45) * 180;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-[#16201D] text-[#ECE8E0] rounded-[20px] p-6 lg:p-7 border border-[#2D3935] shadow-2xl relative overflow-hidden select-none transition-shadow"
    >
      {/* Top status bar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent pulse-subtle" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-white/80">
            Live Controller Telemetry
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-white/70">
            BLE Link -62 dBm
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-colors ${
              bleStatus === 'Backup OK'
                ? 'bg-success/20 text-[#A6E8BF] border border-success/40'
                : 'bg-warning/20 text-[#F5CF8E] border border-warning/40'
            }`}
          >
            {bleStatus}
          </span>
        </div>
      </div>

      {/* Semicircular Speed Gauge (SVG) */}
      <div className="flex flex-col items-center justify-center my-4 relative">
        <svg viewBox="0 0 240 130" className="w-56 h-32 overflow-visible">
          {/* Background arc */}
          <path
            d="M 30 115 A 90 90 0 0 1 210 115"
            fill="none"
            stroke="#263430"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Stock limit arc (0 to 25 km/h) */}
          <path
            d="M 30 115 A 90 90 0 0 1 150 32"
            fill="none"
            stroke="#3F7D5A"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="4 2"
          />

          {/* Private Property mode arc (25 to 45 km/h) */}
          <path
            d="M 152 33 A 90 90 0 0 1 210 115"
            fill="none"
            stroke="#B8693A"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Stock Limit marker at 25 km/h */}
          <line
            x1="147"
            y1="34"
            x2="155"
            y2="22"
            stroke="#ECE8E0"
            strokeWidth="2"
          />
          <text
            x="150"
            y="16"
            textAnchor="middle"
            fill="#A39E93"
            fontSize="8"
            fontFamily="monospace"
          >
            STOCK (25)
          </text>

          {/* Needle pivot */}
          <circle cx="120" cy="115" r="6" fill="#ECE8E0" />
          {/* Animated Needle */}
          <line
            x1="120"
            y1="115"
            x2="120"
            y2="32"
            stroke="#B8693A"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{
              transformOrigin: '120px 115px',
              transform: `rotate(${needleAngle}deg)`,
              transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
        </svg>

        {/* Big Speed readout */}
        <div className="text-center -mt-6">
          <div className="font-mono text-4xl lg:text-5xl font-bold tracking-tight text-white flex items-baseline justify-center gap-1">
            <span>{speed}</span>
            <span className="text-sm font-normal text-white/60 font-sans">km/h</span>
          </div>
          <div className="text-[11px] font-mono text-white/50 tracking-wider uppercase mt-1">
            {speed <= 25 ? 'OEM Legal Window' : 'Private Track Mode · Guarded'}
          </div>
        </div>
      </div>

      {/* Scooter Profile (Original Line Art SVG) with mouse parallax */}
      <div
        className="w-full flex justify-center py-2 relative"
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
          transition: 'transform 80ms ease-out',
        }}
      >
        <svg
          viewBox="0 0 320 120"
          className="w-64 h-24 text-white/40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Front Wheel */}
          <circle cx="260" cy="95" r="18" stroke="#3F7D5A" strokeWidth="2" />
          <circle cx="260" cy="95" r="6" fill="#2D3935" />
          {/* Rear Wheel (Motor) */}
          <circle cx="60" cy="95" r="18" stroke="#B8693A" strokeWidth="2" />
          <circle cx="60" cy="95" r="7" fill="#2D3935" />
          {/* Deck */}
          <path d="M 60 95 L 85 92 L 235 92 L 260 95" stroke="#ECE8E0" strokeWidth="2.5" />
          {/* Deck grip pattern */}
          <line x1="110" y1="89" x2="210" y2="89" stroke="#7C847F" strokeWidth="1" strokeDasharray="3 3" />
          {/* Steering stem */}
          <path d="M 245 92 L 210 25" stroke="#ECE8E0" strokeWidth="2.5" />
          {/* Handlebars & Display */}
          <path d="M 198 22 L 222 28" stroke="#ECE8E0" strokeWidth="2" />
          <rect x="206" y="20" width="8" height="6" rx="1.5" fill="#B8693A" stroke="none" />
          {/* Fold mechanism latch */}
          <circle cx="242" cy="88" r="3" fill="#B8693A" />
        </svg>
      </div>

      {/* 4 Technical Readouts in Mono */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-white/10 text-xs font-mono">
        <div className="bg-white/[0.04] p-2.5 rounded-[8px] border border-white/5">
          <div className="text-white/50 text-[10px] flex items-center gap-1 uppercase">
            <Gauge className="w-3 h-3 text-accent" /> Speed
          </div>
          <div className="text-white font-semibold text-sm mt-0.5">{speed} km/h</div>
        </div>

        <div className="bg-white/[0.04] p-2.5 rounded-[8px] border border-white/5">
          <div className="text-white/50 text-[10px] flex items-center gap-1 uppercase">
            <Battery className="w-3 h-3 text-success" /> Battery
          </div>
          <div className="text-white font-semibold text-sm mt-0.5">{batt} V</div>
        </div>

        <div className="bg-white/[0.04] p-2.5 rounded-[8px] border border-white/5">
          <div className="text-white/50 text-[10px] flex items-center gap-1 uppercase">
            <Thermometer className="w-3 h-3 text-warning" /> ESC Temp
          </div>
          <div className="text-white font-semibold text-sm mt-0.5">{temp} °C</div>
        </div>

        <div className="bg-white/[0.04] p-2.5 rounded-[8px] border border-white/5">
          <div className="text-white/50 text-[10px] flex items-center gap-1 uppercase">
            <Cpu className="w-3 h-3 text-info" /> Current
          </div>
          <div className="text-white font-semibold text-sm mt-0.5">{current} A</div>
        </div>
      </div>
    </div>
  );
};
