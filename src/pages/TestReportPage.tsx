import React, { useState } from 'react';
import { TEST_CASES, TestCase } from '../data/testCases';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CheckCircle2, AlertTriangle, FileText, Download, Play, ChevronDown, ChevronUp, Search } from 'lucide-react';

export const TestReportPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PASS' | 'PASS WITH NOTE'>('ALL');
  const [search, setSearch] = useState('');
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>('TC-001');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState('2026-09-29 16:45 UTC');

  const filteredTests = TEST_CASES.filter((tc) => {
    const matchesStatus = filterStatus === 'ALL' || tc.status === filterStatus;
    const matchesSearch =
      tc.title.toLowerCase().includes(search.toLowerCase()) ||
      tc.modelName.toLowerCase().includes(search.toLowerCase()) ||
      tc.category.toLowerCase().includes(search.toLowerCase()) ||
      tc.testCaseNumber.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setReportGeneratedTime(new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC');
    }, 1600);
  };

  const handleDownloadMockPdf = () => {
    const content = `KESTREL ACTUATOR FIRMWARE VALIDATION REPORT
Generated: ${reportGeneratedTime}
Status: 48/48 Evaluated (46 PASS, 2 PASS WITH NOTE, 0 REGRESSIONS)
Tested Models: Xiaomi Pro 2, Ninebot Max G30, Xiaomi Mi 3, Ninebot F40
All rights transferred to client upon final milestone acceptance.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kestrel-firmware-test-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleExpand = (id: string) => {
    setExpandedCaseId(expandedCaseId === id ? null : id);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold">
            Quality Assurance Deliverable
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal mt-1">
            Firmware Validation & Test Report
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Empirical hardware execution test log across 7 scooter models, testing pre-flight checks, radio disconnects, and thermal boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleGenerateReport}
            isLoading={isGenerating}
            leftIcon={<Play className="w-3.5 h-3.5 text-accent" />}
          >
            Run Suite Simulation
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadMockPdf}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Report (PDF)
          </Button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="my-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface-elevated p-4 rounded-[14px] border border-border shadow-sm">
          <div className="text-[10px] font-mono text-text-muted uppercase">Total Test Cases</div>
          <div className="text-2xl font-mono font-bold text-ink mt-0.5">48</div>
          <div className="text-[11px] text-text-secondary mt-1">100% evaluated</div>
        </div>

        <div className="bg-surface-elevated p-4 rounded-[14px] border border-border shadow-sm">
          <div className="text-[10px] font-mono text-text-muted uppercase">Unconditional Pass</div>
          <div className="text-2xl font-mono font-bold text-success mt-0.5">46</div>
          <div className="text-[11px] text-text-secondary mt-1">Bitwise parity verified</div>
        </div>

        <div className="bg-surface-elevated p-4 rounded-[14px] border border-border shadow-sm">
          <div className="text-[10px] font-mono text-text-muted uppercase">Pass With Note</div>
          <div className="text-2xl font-mono font-bold text-warning mt-0.5">2</div>
          <div className="text-[11px] text-text-secondary mt-1">Voltage & RF debounce</div>
        </div>

        <div className="bg-surface-elevated p-4 rounded-[14px] border border-border shadow-sm">
          <div className="text-[10px] font-mono text-text-muted uppercase">Hard Regressions</div>
          <div className="text-2xl font-mono font-bold text-text-muted mt-0.5">0</div>
          <div className="text-[11px] text-success mt-1">Zero controller bricks</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search test cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-elevated border border-border-strong rounded-[8px] pl-9 pr-3 py-2 text-xs text-ink focus:outline-none focus:border-info"
          />
        </div>

        <div className="flex items-center gap-1 bg-secondary/80 p-1 rounded-[8px] border border-border w-full sm:w-auto">
          {(['ALL', 'PASS', 'PASS WITH NOTE'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 text-xs rounded-[6px] font-medium transition-colors ${
                filterStatus === st ? 'bg-surface-elevated text-ink shadow-sm' : 'text-text-secondary hover:text-ink'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Test Cases Table / List */}
      <div className="bg-surface-elevated border border-border rounded-[16px] overflow-hidden shadow-sm divide-y divide-border">
        {filteredTests.map((tc) => {
          const isExpanded = expandedCaseId === tc.id;
          return (
            <div key={tc.id} className="transition-colors">
              <div
                onClick={() => toggleExpand(tc.id)}
                className="p-4 sm:px-6 flex items-center justify-between cursor-pointer hover:bg-bg/40 select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-text-muted w-14 shrink-0">
                    {tc.testCaseNumber}
                  </span>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-ink flex items-center gap-2">
                      <span>{tc.title}</span>
                      <span className="hidden md:inline-block text-[11px] font-mono text-text-muted font-normal">
                        [{tc.category}]
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-text-secondary mt-0.5">
                      {tc.modelName} · FW {tc.firmwareVersion}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={tc.status === 'PASS' ? 'supported' : 'warning'} size="sm">
                    {tc.status}
                  </Badge>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-text-muted" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-text-muted" />
                  )}
                </div>
              </div>

              {/* Expanded Test Details */}
              {isExpanded && (
                <div className="px-6 pb-5 pt-2 bg-bg/50 border-t border-border text-xs space-y-3 font-sans animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-mono text-[10px] uppercase text-text-muted mb-1">
                        Execution Procedure Steps:
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-text-secondary font-mono text-[11px]">
                        {tc.steps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="font-mono text-[10px] uppercase text-text-muted">Expected Assertion:</div>
                        <div className="text-text-secondary text-[11px] mt-0.5">{tc.expectedResult}</div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase text-text-muted">Actual Bus Response:</div>
                        <div className="text-ink font-mono text-[11px] mt-0.5">{tc.actualResult}</div>
                      </div>
                      {tc.note && (
                        <div className="p-2 rounded bg-warning-tint border border-warning/30 text-[11px] text-[#87550E]">
                          <strong>Engineering Note:</strong> {tc.note}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] font-mono text-text-muted">
                    <span>Executed: {tc.executionTime} ({tc.durationMs}ms)</span>
                    <span>Payload SHA-256: {tc.sha256Payload}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
