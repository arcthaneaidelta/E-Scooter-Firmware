import React, { useState } from 'react';
import { Search, BookOpen, ShieldCheck, Cpu, RotateCcw, WifiOff, FileCode, ChevronRight } from 'lucide-react';

interface DocArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string[];
}

const ARTICLES: DocArticle[] = [
  {
    id: 'getting-started',
    title: 'Web Bluetooth Activation Integration',
    category: 'Architecture',
    summary: 'How Luca’s Web Bluetooth shop page loads base64 parameter payloads securely from the license server.',
    content: [
      'The Kestrel parameter framework integrates seamlessly with an existing Web Bluetooth frontend and central license server.',
      'When an end customer opens your activation page, navigator.bluetooth requests standard GATT service 0xFE95 (or vendor Nordic UART). The client initiates pre-flight checks by reading device descriptor registers.',
      'Upon verifying the scooter UUID and firmware build, your frontend posts a signed authorization challenge to your license server. The server verifies the license token is active, unused, and valid for the identified model, then serves the targeted base64 parameter manifest with SHA-256 digest.',
      'The client transmits the base64 blocks sequentially using writeValueWithResponse(), verifying CRC-16 checksums on each ACK before advancing.'
    ]
  },
  {
    id: 'safety-checks',
    title: 'Pre-Flight Interlocks & Gatekeeping',
    category: 'Safety Engineering',
    summary: 'The 6 mandatory verification steps executed before any memory registers are altered.',
    content: [
      'Rule 1: Battery State-of-Charge Interlock (SoC ≥ 30%). Prevents voltage brownouts during flash write which could cause incomplete transaction states.',
      'Rule 2: ESC Thermal Cutoff Verification (Temp ≤ 45°C). Ensures the motor controller is in thermal steady-state before parameter modification.',
      'Rule 3: Radio Signal Strength Floor (RSSI ≥ -78 dBm). Eliminates packet drop anomalies before initiating the atomic staging window.',
      'Rule 4: Bootloader Cryptographic State. Any firmware version tagged as locked (such as RSA-signed builds) is blocked immediately with an informative notice.',
      'Rule 5: Non-Volatile Pre-Write Snapshot. Bitwise backup of OEM factory registers must be compiled, SHA-256 digested, and saved before write permissions are granted.'
    ]
  },
  {
    id: 'restoring-stock',
    title: 'Restoring to Factory OEM Settings',
    category: 'Reversibility',
    summary: 'Bitwise stock parameter reversal instructions and diff tracking.',
    content: [
      'Reversibility is the core trust signal for both the end customer and your online shop reputation.',
      'Whenever an activation is completed, a snapshot containing the exact OEM factory registers (speed limit, phase current, KERS energy recovery, and thermal cutoff) is stored in the user’s local browser vault and mirrored to your database.',
      'To restore, the customer connects to the scooter and selects "Restore to Stock". The system executes an atomic write of the factory baseline table.',
      'A final read-back test compares all registers against the OEM factory table. Once confirmed bitwise, the scooter is indistinguishable from its factory state.'
    ]
  },
  {
    id: 'connection-recovery',
    title: 'Safe Abort on Disconnect & Radio Severance',
    category: 'Fail-Safe Mechanisms',
    summary: 'How atomic staging buffers prevent controller bricking when Bluetooth drops mid-write.',
    content: [
      'A primary danger in casual firmware flashing is mid-write disconnection (phone battery dies, Bluetooth glitch, or user walks out of range).',
      'Kestrel eliminates this risk by writing parameters to an uncommitted ESC staging buffer. The controller only commits new values to main configuration flash upon receiving an End-Of-Transmission (EOT) packet with valid full-table CRC32.',
      'If the BLE link drops at any point (e.g. at block 4 of 8), the ESC watchdog timer expires after 400ms. The uncommitted buffer is flushed, and the existing factory parameters remain untouched.',
      'Upon reconnection, the client reads current memory, verifies the scooter is in its safe baseline state, and allows the user to resume or roll back cleanly.'
    ]
  },
  {
    id: 'package-format',
    title: 'Base64 Parameter Block Specification',
    category: 'Specification',
    summary: 'Manifest structure, checksum verification, and per-model data schema.',
    content: [
      'Deliverable packages are structured as modular JSON manifests containing versioned base64 byte arrays.',
      'Each package specifies: packageId, modelCode, targetFirmware, sha256Checksum, authorSignature (ED25519), and atomic block arrays.',
      'Block payloads contain the opcode (0x20 Write Register), register offset, byte count, data bytes, and trailing CRC16.',
      'This guarantees that Luca receives clean, portable data blocks that can be directly written by his Web Bluetooth activation page without proprietary tooling dependencies.'
    ]
  }
];

export const DocsPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState('getting-started');
  const [search, setSearch] = useState('');

  const currentArticle = ARTICLES.find((a) => a.id === selectedId) || ARTICLES[0];
  const filteredArticles = ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-left">
      <div className="mb-8 pb-6 border-b border-border">
        <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold">
          Developer Documentation
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal mt-1">
          Technical Specifications & Guides
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Detailed architecture documentation covering protocol integration, safety interlocks, and base64 packet formats.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Article navigation tree */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter technical docs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-elevated border border-border-strong rounded-[8px] pl-9 pr-3 py-2 text-xs text-ink focus:outline-none focus:border-info"
            />
          </div>

          <div className="space-y-1">
            {filteredArticles.map((art) => {
              const isSelected = selectedId === art.id;
              return (
                <button
                  key={art.id}
                  onClick={() => setSelectedId(art.id)}
                  className={`w-full text-left p-3 rounded-[10px] text-xs transition-all border ${
                    isSelected
                      ? 'bg-surface-elevated border-primary/30 shadow-sm text-primary font-semibold'
                      : 'border-transparent text-text-secondary hover:text-ink hover:bg-secondary/60'
                  }`}
                >
                  <div className="text-[10px] uppercase font-mono text-text-muted mb-0.5">
                    {art.category}
                  </div>
                  <div>{art.title}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Article Reading Area */}
        <div className="lg:col-span-8 bg-surface-elevated border border-border rounded-[20px] p-6 sm:p-8 shadow-sm">
          <div className="pb-4 border-b border-border mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
              {currentArticle.category}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-ink font-normal mt-1">
              {currentArticle.title}
            </h2>
            <p className="text-xs text-text-secondary mt-2">
              {currentArticle.summary}
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
            {currentArticle.content.map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Integration snippet preview */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="font-mono text-xs uppercase text-text-muted mb-2">
              Sample Web Bluetooth Packet Transfer Loop
            </div>
            <pre className="bg-[#16201D] text-[#ECE8E0] p-4 rounded-[12px] font-mono text-xs overflow-x-auto leading-relaxed border border-border-strong/30">
{`// Sequential atomic write with CRC16 verification
async function writeParameterPackage(characteristic, manifest) {
  for (const block of manifest.blocks) {
    const rawBytes = Uint8Array.from(atob(block.base64Data), c => c.charCodeAt(0));
    await characteristic.writeValueWithResponse(rawBytes);
    const ack = await characteristic.readValue();
    if (ack.getUint8(0) !== 0x00) {
      throw new Error(\`Write rejected at block \${block.index}\`);
    }
  }
  // Send commit pulse
  await characteristic.writeValueWithResponse(new Uint8Array([0x55, 0xAA]));
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
