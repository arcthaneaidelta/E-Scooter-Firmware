import { create } from 'zustand';
import { SimulatedBleDevice, runPreflightChecks, PreflightCheckResult } from '../lib/bleSimulator';
import { BackupRecord } from '../data/mockDb';
import { api } from '../lib/api';

export type WizardStepId = 1 | 2 | 3 | 4 | 5 | 6;

export interface LogEntry {
  id: string;
  timestamp: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface ParameterConfig {
  speedLimit: number;
  motorCurrent: number;
  regenStrength: number;
  tempCutoff: number;
}

export interface WizardState {
  currentStep: WizardStepId;
  licenseKey: string;
  isLicenseVerified: boolean;
  region: string;
  consentGiven: boolean;
  
  // Device & scanning
  isScanning: boolean;
  connectedDevice: SimulatedBleDevice | null;
  preflightChecks: PreflightCheckResult[];
  deviceError: string | null;

  // Backup
  isBackingUp: boolean;
  backupRecord: BackupRecord | null;

  // Parameter configuration
  parameters: ParameterConfig;
  targetPackageId: string;

  // Writing
  isWriting: boolean;
  writeBlock: number;
  totalBlocks: number;
  isConnectionLost: boolean;
  isRolledBack: boolean;
  isCompleted: boolean;
  isRestoringStock: boolean;

  // Logs
  logs: LogEntry[];

  // Actions
  setLicenseKey: (key: string) => void;
  verifyLicense: () => Promise<boolean>;
  setConsent: (consent: boolean, region: string) => void;
  startScanning: () => void;
  selectDevice: (device: SimulatedBleDevice) => void;
  runBackup: () => Promise<void>;
  updateParameter: (key: keyof ParameterConfig, value: number) => void;
  applyPreset: (preset: 'stock' | 'eco' | 'standard' | 'private-track') => void;
  startWriteSequence: () => void;
  triggerConnectionLoss: () => void;
  resumeVerification: () => void;
  rollbackToStock: () => void;
  abortAndRestore: () => void;
  goToStep: (step: WizardStepId) => void;
  resetWizard: () => void;
  addLog: (text: string, type?: LogEntry['type']) => void;
}

const STOCK_PARAMS: ParameterConfig = {
  speedLimit: 25,
  motorCurrent: 17,
  regenStrength: 1,
  tempCutoff: 70
};

export const useWizardStore = create<WizardState>((set, get) => ({
  currentStep: 1,
  licenseKey: 'KSTL-7F3A-92QD-H5MX', // preloaded Marta unused key
  isLicenseVerified: true,
  region: 'Germany (Private Track / StVZO off-road)',
  consentGiven: false,

  isScanning: false,
  connectedDevice: null,
  preflightChecks: [],
  deviceError: null,

  isBackingUp: false,
  backupRecord: null,

  parameters: {
    speedLimit: 32,
    motorCurrent: 22,
    regenStrength: 2,
    tempCutoff: 68
  },
  targetPackageId: 'PKG-MI-PRO2-228',

  isWriting: false,
  writeBlock: 0,
  totalBlocks: 8,
  isConnectionLost: false,
  isRolledBack: false,
  isCompleted: false,
  isRestoringStock: false,

  logs: [
    {
      id: 'log-0',
      timestamp: '14:20:00',
      text: 'Wizard initialized. Ready for parameter activation sequence.',
      type: 'info'
    }
  ],

  addLog: (text, type = 'info') => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newEntry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: time,
      text,
      type
    };
    set(state => ({ logs: [...state.logs, newEntry] }));
  },

  setLicenseKey: (key) => set({ licenseKey: key, isLicenseVerified: false }),

  verifyLicense: async () => {
    const { licenseKey, addLog } = get();
    addLog(`Validating license key ${licenseKey}...`, 'info');
    try {
      const res = await api.verifyLicense(licenseKey);
      if (res.valid) {
        addLog(`License verified successfully: ${res.license?.plan} (${res.license?.status})`, 'success');
        set({ isLicenseVerified: true, currentStep: 2 });
        return true;
      } else {
        addLog(`License verification failed: ${res.reason}`, 'error');
        return false;
      }
    } catch (err: any) {
      addLog(`Verification error: ${err.message}`, 'error');
      return false;
    }
  },

  setConsent: (consent, region) => {
    const { addLog } = get();
    if (consent) {
      addLog(`Compliance acknowledged: Private-property operation only in jurisdiction [${region}]`, 'success');
    }
    set({ consentGiven: consent, region, currentStep: consent ? 3 : 2 });
  },

  startScanning: () => {
    set({ isScanning: true, connectedDevice: null, deviceError: null });
    get().addLog('Initiating BLE advertisement scan for compatible scooter peripherals...', 'info');
  },

  selectDevice: (device) => {
    const { addLog } = get();
    set({ isScanning: false, connectedDevice: device });
    addLog(`Device selected: ${device.advertisingName} (${device.macAddress})`, 'info');

    if (device.status === 'out-of-scope') {
      addLog(`REJECTED: ${device.statusReason}`, 'error');
      set({ deviceError: device.statusReason });
      return;
    }

    if (device.status === 'mismatch') {
      addLog(`MISMATCH: ${device.statusReason}`, 'error');
      set({ deviceError: device.statusReason });
      return;
    }

    // Run Pre-flight Checks
    addLog('Executing pre-flight hardware security checks...', 'info');
    const checks = runPreflightChecks(device);
    set({ preflightChecks: checks });

    checks.forEach(c => {
      addLog(`[Check] ${c.step}: ${c.status.toUpperCase()} (${c.detail})`, c.status === 'passed' ? 'success' : 'warning');
    });

    if (device.modelId === 'segway-ninebot-max-g30') {
      set({
        parameters: { speedLimit: 33, motorCurrent: 28, regenStrength: 2, tempCutoff: 72 },
        totalBlocks: 9,
        targetPackageId: 'PKG-NB-G30-154'
      });
    } else {
      set({
        parameters: { speedLimit: 32, motorCurrent: 22, regenStrength: 2, tempCutoff: 68 },
        totalBlocks: 8,
        targetPackageId: 'PKG-MI-PRO2-228'
      });
    }

    // Proceed to Step 4 (Backup)
    set({ currentStep: 4 });
  },

  runBackup: async () => {
    const { connectedDevice, parameters, addLog } = get();
    if (!connectedDevice) return;

    set({ isBackingUp: true });
    addLog('Initiating non-volatile flash read of original OEM parameter table...', 'info');
    addLog('Generating SHA-256 cryptographic digest of baseline registers...', 'info');

    try {
      const backup = await api.createBackup(
        connectedDevice.modelId,
        connectedDevice.modelName,
        connectedDevice.firmwareVersion,
        STOCK_PARAMS
      );
      set({ isBackingUp: false, backupRecord: backup, currentStep: 5 });
      addLog(`Backup secured: ${backup.id} (SHA-256: ${backup.sha256Checksum.slice(0, 16)}...)`, 'success');
      addLog('Stock image saved to local storage. It can be restored at any time.', 'info');
    } catch (err: any) {
      set({ isBackingUp: false });
      addLog(`Backup failed: ${err.message}`, 'error');
    }
  },

  updateParameter: (key, val) => {
    set(state => ({
      parameters: {
        ...state.parameters,
        [key]: val
      }
    }));
  },

  applyPreset: (preset) => {
    const { addLog } = get();
    if (preset === 'stock') {
      set({ parameters: { speedLimit: 25, motorCurrent: 17, regenStrength: 1, tempCutoff: 70 } });
      addLog('Preset applied: Stock Factory Baseline (25 km/h limit)', 'info');
    } else if (preset === 'eco') {
      set({ parameters: { speedLimit: 20, motorCurrent: 15, regenStrength: 3, tempCutoff: 68 } });
      addLog('Preset applied: Efficiency Eco Mode', 'info');
    } else if (preset === 'standard') {
      set({ parameters: { speedLimit: 28, motorCurrent: 20, regenStrength: 2, tempCutoff: 68 } });
      addLog('Preset applied: Moderate Performance', 'info');
    } else if (preset === 'private-track') {
      set({ parameters: { speedLimit: 33, motorCurrent: 23, regenStrength: 2, tempCutoff: 68 } });
      addLog('Preset applied: Private Property Performance Mode (Guardrail bounded)', 'warning');
    }
  },

  startWriteSequence: () => {
    const { addLog, totalBlocks } = get();
    set({ isWriting: true, writeBlock: 0, isConnectionLost: false, isCompleted: false, isRolledBack: false });
    addLog('Commencing atomic staged BLE write sequence...', 'info');
    addLog(`Staging ${totalBlocks} parameter blocks. Atomic transaction window open.`, 'info');

    // Interval stepping
    const interval = setInterval(() => {
      const state = get();
      if (!state.isWriting || state.isConnectionLost) {
        clearInterval(interval);
        return;
      }

      const nextBlock = state.writeBlock + 1;
      if (nextBlock <= state.totalBlocks) {
        set({ writeBlock: nextBlock });
        state.addLog(`Written block ${nextBlock}/${state.totalBlocks} [CRC-16 verified]`, 'info');
      } else {
        clearInterval(interval);
        set({ isWriting: false, currentStep: 6 });
        state.addLog('All blocks written. Performing post-write read-back verification...', 'info');
        setTimeout(() => {
          set({ isCompleted: true });
          state.addLog('Read-back verification complete: All register values match package manifest bitwise.', 'success');
          state.addLog('Activation successfully completed! Scooter configured in private-property mode.', 'success');
        }, 1200);
      }
    }, 700);
  },

  triggerConnectionLoss: () => {
    const { writeBlock, totalBlocks, addLog } = get();
    set({ isWriting: false, isConnectionLost: true });
    addLog(`CRITICAL: BLE RSSI dropped to 0 dBm. Connection severed at block ${writeBlock} of ${totalBlocks}!`, 'error');
    addLog('SAFE ABORT ENGAGED: Incomplete transaction discarded by ESC staging buffer.', 'warning');
    addLog('Hardware left in 100% safe, uncommitted OEM state. Zero partial writes applied.', 'success');
  },

  resumeVerification: () => {
    const { addLog } = get();
    set({ isConnectionLost: false, writeBlock: 0 });
    addLog('Reconnected to scooter BLE. Querying hardware register state...', 'info');
    setTimeout(() => {
      addLog('Controller state verified: intact stock configuration confirmed.', 'success');
      get().startWriteSequence();
    }, 1000);
  },

  rollbackToStock: () => {
    const { addLog } = get();
    set({ isConnectionLost: false, isRolledBack: true, isWriting: false, isCompleted: false });
    addLog('Initiating rollback transaction: Restoring backup registers...', 'info');
    setTimeout(() => {
      set({
        parameters: { speedLimit: 25, motorCurrent: 17, regenStrength: 1, tempCutoff: 70 },
        currentStep: 6
      });
      addLog('Rollback complete! Controller confirmed in original factory stock condition.', 'success');
    }, 1200);
  },

  abortAndRestore: () => {
    const { addLog } = get();
    set({ isWriting: false, isConnectionLost: false, isRolledBack: true, currentStep: 6 });
    addLog('Write aborted by user request. Reverting staged parameters.', 'warning');
    addLog('Scooter remains safely in baseline OEM configuration.', 'success');
  },

  goToStep: (step) => set({ currentStep: step }),

  resetWizard: () => {
    set({
      currentStep: 1,
      isScanning: false,
      connectedDevice: null,
      deviceError: null,
      isBackingUp: false,
      backupRecord: null,
      parameters: { speedLimit: 32, motorCurrent: 22, regenStrength: 2, tempCutoff: 68 },
      isWriting: false,
      writeBlock: 0,
      isConnectionLost: false,
      isRolledBack: false,
      isCompleted: false,
      isRestoringStock: false,
      logs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          text: 'Wizard reset to initial state.',
          type: 'info'
        }
      ]
    });
  }
}));
