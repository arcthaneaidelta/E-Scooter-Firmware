import React, { useState } from 'react';
import { getMockDb, saveMockDb, License, BackupRecord, PairedDevice } from '../data/mockDb';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { DiffTable } from '../components/app/DiffTable';
import {
  Key,
  HardDrive,
  Cpu,
  Copy,
  Check,
  RotateCcw,
  Download,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccountPage: React.FC = () => {
  const [dbState, setDbState] = useState(getMockDb());
  const [activeTab, setActiveTab] = useState<'overview' | 'licenses' | 'devices' | 'backups'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Rename modal
  const [editingDevice, setEditingDevice] = useState<PairedDevice | null>(null);
  const [newName, setNewName] = useState('');

  // Restore modal with diff
  const [restoreBackup, setRestoreBackup] = useState<BackupRecord | null>(null);
  const [restoreSuccess, setRestoreSuccess] = useState(false);

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveRename = () => {
    if (!editingDevice || !newName.trim()) return;
    const db = getMockDb();
    const target = db.devices.find((d) => d.id === editingDevice.id);
    if (target) {
      target.name = newName.trim();
      saveMockDb(db);
      setDbState({ ...db });
    }
    setEditingDevice(null);
  };

  const handleExecuteRestore = () => {
    if (!restoreBackup) return;
    setRestoreSuccess(true);
    setTimeout(() => {
      setRestoreSuccess(false);
      setRestoreBackup(null);
    }, 1500);
  };

  const handleDeleteBackup = (id: string) => {
    const db = getMockDb();
    db.backups = db.backups.filter((b) => b.id !== id);
    saveMockDb(db);
    setDbState({ ...db });
  };

  const handleMockDownload = (backup: BackupRecord) => {
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kestrel-backup-${backup.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-left">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold">
            Client Vault
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal mt-1">
            Account Management
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Signed in as <strong>{dbState.currentUser.name}</strong> ({dbState.currentUser.email})
          </p>
        </div>

        <Link to="/activate">
          <Button variant="accent" size="sm">
            Launch Activation Wizard
          </Button>
        </Link>
      </div>

      {/* Needs Attention Warning Bar */}
      <div className="my-6 p-4 rounded-[12px] bg-secondary border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-ink">
          <AlertCircle className="w-4 h-4 text-accent shrink-0" />
          <span>
            <strong>Attention:</strong> You have 1 unused activation license ready to pair (Key: {dbState.licenses.find(l => l.status === 'Unused')?.key}).
          </span>
        </div>
        <Link to="/activate" className="text-accent underline font-semibold shrink-0">
          Pair Device Now &rarr;
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border mb-6">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'licenses', label: `Licenses (${dbState.licenses.length})` },
          { id: 'devices', label: `Scooters (${dbState.devices.length})` },
          { id: 'backups', label: `Saved Backups (${dbState.backups.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-3 text-xs font-medium transition-colors relative ${
              activeTab === tab.id ? 'text-primary font-semibold' : 'text-text-secondary hover:text-ink'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-surface-elevated p-5 rounded-[14px] border border-border shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-text-muted">Licenses</span>
                <Key className="w-4 h-4 text-accent" />
              </div>
              <div className="text-2xl font-mono font-bold text-ink">{dbState.licenses.length} Total</div>
              <div className="text-xs text-text-secondary mt-1">
                {dbState.licenses.filter((l) => l.status === 'Active').length} Active ·{' '}
                {dbState.licenses.filter((l) => l.status === 'Unused').length} Unused
              </div>
            </div>

            <div className="bg-surface-elevated p-5 rounded-[14px] border border-border shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-text-muted">Paired Scooters</span>
                <Cpu className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-mono font-bold text-ink">{dbState.devices.length} Registered</div>
              <div className="text-xs text-text-secondary mt-1">Both units verified on BLE</div>
            </div>

            <div className="bg-surface-elevated p-5 rounded-[14px] border border-border shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-text-muted">Flash Backups</span>
                <HardDrive className="w-4 h-4 text-success" />
              </div>
              <div className="text-2xl font-mono font-bold text-ink">{dbState.backups.length} Snapshots</div>
              <div className="text-xs text-text-secondary mt-1">100% stock restore ready</div>
            </div>
          </div>

          {/* Activity Log Feed */}
          <div className="bg-surface-elevated rounded-[16px] border border-border p-5 shadow-sm">
            <h3 className="font-display text-base text-ink font-normal mb-3">Recent Security & Write Activity</h3>
            <div className="divide-y divide-border text-xs">
              {dbState.activityLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-ink">{log.message}</div>
                    {log.details && <div className="text-[11px] text-text-muted font-mono">{log.details}</div>}
                  </div>
                  <span className="text-[11px] font-mono text-text-muted shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: LICENSES */}
      {activeTab === 'licenses' && (
        <div className="bg-surface-elevated rounded-[14px] border border-border overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg border-b border-border font-mono uppercase text-[10px] text-text-secondary">
              <tr>
                <th className="py-3 px-4">License Key</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Bound Scooter</th>
                <th className="py-3 px-4">Purchased</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {dbState.licenses.map((lic) => (
                <tr key={lic.id} className="hover:bg-bg/40">
                  <td className="py-3.5 px-4 font-mono font-semibold text-ink flex items-center gap-2">
                    <span>{lic.key}</span>
                    <button
                      onClick={() => copyKey(lic.key)}
                      className="p-1 text-text-muted hover:text-ink rounded"
                      title="Copy key"
                    >
                      {copiedKey === lic.key ? (
                        <Check className="w-3.5 h-3.5 text-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4">{lic.plan}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={lic.status.toLowerCase() as any} size="sm">
                      {lic.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-text-secondary">
                    {lic.boundDeviceName || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-text-muted font-mono">{lic.purchasedDate}</td>
                  <td className="py-3.5 px-4 text-right">
                    {lic.status === 'Unused' ? (
                      <Link to="/activate">
                        <Button size="sm" variant="accent">
                          Activate
                        </Button>
                      </Link>
                    ) : (
                      <span className="text-[11px] text-text-muted">Bound</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: DEVICES */}
      {activeTab === 'devices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {dbState.devices.map((dev) => (
            <div
              key={dev.id}
              className="bg-surface-elevated border border-border rounded-[14px] p-5 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg text-ink font-normal">{dev.name}</h3>
                  <p className="text-xs text-text-secondary font-mono">{dev.modelName}</p>
                </div>
                <button
                  onClick={() => {
                    setEditingDevice(dev);
                    setNewName(dev.name);
                  }}
                  className="p-1.5 text-text-muted hover:text-ink rounded hover:bg-secondary"
                  title="Rename Scooter"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-surface p-3 rounded-[10px] border border-border">
                <div>
                  <span className="text-text-muted block text-[10px]">CURRENT SPEED LIMIT</span>
                  <span className="font-semibold text-accent text-sm">{dev.currentSpeedLimit} km/h</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px]">PHASE CURRENT</span>
                  <span className="font-semibold text-ink text-sm">{dev.currentMotorCurrent} A</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px]">FIRMWARE BUILD</span>
                  <span className="text-text-secondary">{dev.firmwareVersion}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px]">BATTERY SOC</span>
                  <span className="text-success">{dev.batteryLevel}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-[11px] text-text-muted font-mono">
                  Last connected: {dev.lastConnected}
                </span>
                <Link to="/activate">
                  <Button size="sm" variant="secondary">
                    Connect
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: BACKUPS */}
      {activeTab === 'backups' && (
        <div className="bg-surface-elevated rounded-[14px] border border-border overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg border-b border-border font-mono uppercase text-[10px] text-text-secondary">
              <tr>
                <th className="py-3 px-4">Backup Name</th>
                <th className="py-3 px-4">Model & Firmware</th>
                <th className="py-3 px-4">SHA-256 Digest</th>
                <th className="py-3 px-4">Date Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {dbState.backups.map((bk) => (
                <tr key={bk.id} className="hover:bg-bg/40">
                  <td className="py-3.5 px-4 font-semibold text-ink">
                    <div>{bk.name}</div>
                    <div className="text-[11px] text-text-muted font-normal">{bk.notes}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-text-secondary">
                    {bk.modelName} ({bk.firmwareVersion})
                  </td>
                  <td className="py-3.5 px-4 font-mono text-text-muted text-[11px]">
                    {bk.sha256Checksum.slice(0, 16)}...
                  </td>
                  <td className="py-3.5 px-4 text-text-muted font-mono">{bk.date}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleMockDownload(bk)}
                        className="p-1.5 text-text-secondary hover:text-ink rounded hover:bg-secondary"
                        title="Download backup json"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setRestoreBackup(bk)}
                        className="p-1.5 text-accent hover:text-accent-hover rounded hover:bg-accent/10"
                        title="Restore this backup to scooter"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBackup(bk.id)}
                        className="p-1.5 text-text-muted hover:text-error rounded hover:bg-error/10"
                        title="Delete backup"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rename Device Modal */}
      <Modal
        isOpen={Boolean(editingDevice)}
        onClose={() => setEditingDevice(null)}
        title="Rename Scooter Peripheral"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full bg-surface border border-border-strong rounded-[8px] px-3.5 py-2.5 text-sm text-ink focus:outline-none"
            placeholder="e.g. Pro 2 · Track Edition"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setEditingDevice(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveRename}>
              Save Name
            </Button>
          </div>
        </div>
      </Modal>

      {/* Restore Backup with Diff Modal */}
      <Modal
        isOpen={Boolean(restoreBackup)}
        onClose={() => setRestoreBackup(null)}
        title="Restore Factory Backup to Scooter"
        description="Write OEM memory registers back to physical controller."
      >
        {restoreBackup && (
          <div className="space-y-4 text-xs">
            {restoreSuccess ? (
              <div className="p-4 rounded-[12px] bg-success-tint border border-success/30 text-success flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>OEM restoration committed successfully! Scooter restored to factory stock.</span>
              </div>
            ) : (
              <>
                <div className="bg-surface p-3.5 rounded-[10px] border border-border font-mono space-y-1">
                  <div><strong>Snapshot ID:</strong> {restoreBackup.id}</div>
                  <div><strong>Target:</strong> {restoreBackup.modelName} ({restoreBackup.firmwareVersion})</div>
                  <div><strong>Checksum:</strong> {restoreBackup.sha256Checksum.slice(0, 24)}...</div>
                </div>

                <DiffTable
                  currentConfig={{
                    speedLimit: 25,
                    motorCurrent: 17,
                    regenStrength: 1,
                    tempCutoff: 70,
                  }}
                  showRestoreAction={false}
                />

                <div className="pt-2 flex justify-end gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setRestoreBackup(null)}>
                    Cancel
                  </Button>
                  <Button variant="accent" size="sm" onClick={handleExecuteRestore}>
                    Confirm Restore to Stock
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
