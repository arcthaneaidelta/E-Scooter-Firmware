export interface License {
  id: string;
  key: string;
  plan: 'Single Device' | '3-Pack' | 'Reseller Bundle';
  status: 'Unused' | 'Active' | 'Revoked';
  purchasedDate: string;
  boundDeviceId?: string;
  boundDeviceName?: string;
  boundDate?: string;
  region: string;
}

export interface BackupRecord {
  id: string;
  name: string;
  modelId: string;
  modelName: string;
  firmwareVersion: string;
  date: string;
  sha256Checksum: string;
  sizeKb: number;
  parameters: {
    speedLimit: number;
    motorCurrent: number;
    regenStrength: number;
    tempCutoff: number;
  };
  notes: string;
}

export interface PairedDevice {
  id: string;
  name: string;
  modelId: string;
  modelName: string;
  firmwareVersion: string;
  batteryLevel: number;
  temperatureC: number;
  lastConnected: string;
  licenseKey?: string;
  status: 'Connected' | 'Disconnected' | 'Standby';
  currentSpeedLimit: number;
  currentMotorCurrent: number;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'security';
  message: string;
  details?: string;
}

export interface MockDbState {
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'admin';
  };
  licenses: License[];
  backups: BackupRecord[];
  devices: PairedDevice[];
  activityLogs: ActivityLogItem[];
}

const STORAGE_KEY = 'kestrel_demo_db_v1';

const INITIAL_DB: MockDbState = {
  currentUser: {
    id: 'usr-marta',
    name: 'Marta Hoffmann',
    email: 'marta.hoffmann@example.com',
    role: 'customer'
  },
  licenses: [
    {
      id: 'lic-1',
      key: 'KSTL-7F3A-92QD-H5MX',
      plan: 'Single Device',
      status: 'Unused',
      purchasedDate: '2026-09-24 16:30',
      region: 'Germany (Private Track)'
    },
    {
      id: 'lic-2',
      key: 'KSTL-81B9-44KP-22NX',
      plan: '3-Pack',
      status: 'Active',
      purchasedDate: '2026-09-10 11:15',
      boundDeviceId: 'dev-pro2-01',
      boundDeviceName: 'Pro 2 · Garage',
      boundDate: '2026-09-12 14:24',
      region: 'Germany (Private Track)'
    },
    {
      id: 'lic-3',
      key: 'KSTL-33TR-90ZZ-88LK',
      plan: '3-Pack',
      status: 'Unused',
      purchasedDate: '2026-09-10 11:15',
      region: 'Germany (Private Track)'
    }
  ],
  backups: [
    {
      id: 'bk-pro2-01',
      name: 'OEM Factory Stock Backup',
      modelId: 'xiaomi-pro-2',
      modelName: 'Xiaomi Mi Electric Scooter Pro 2',
      firmwareVersion: 'v2.2.8',
      date: '2026-09-12 14:22',
      sha256Checksum: 'ab41f92e41a0bc6d88190de12470f1a2384a511382103fca0199e823b18fe90c',
      sizeKb: 1.4,
      parameters: {
        speedLimit: 25,
        motorCurrent: 17,
        regenStrength: 1,
        tempCutoff: 70
      },
      notes: 'Initial OEM snapshot before first configuration write.'
    },
    {
      id: 'bk-g30-01',
      name: 'Max G30 Factory Baselines',
      modelId: 'segway-ninebot-max-g30',
      modelName: 'Segway-Ninebot KickScooter Max G30',
      firmwareVersion: 'DRV 1.5.4',
      date: '2026-08-24 09:15',
      sha256Checksum: '78e1b209d66144e390c52a0888147d341b8a902199b418ca473829104bc111ad',
      sizeKb: 1.8,
      parameters: {
        speedLimit: 25,
        motorCurrent: 25,
        regenStrength: 1,
        tempCutoff: 75
      },
      notes: 'Clean factory image prior to private-property testing.'
    },
    {
      id: 'bk-pro2-02',
      name: 'Pro 2 Pre-Inspection Snapshot',
      modelId: 'xiaomi-pro-2',
      modelName: 'Xiaomi Mi Electric Scooter Pro 2',
      firmwareVersion: 'v2.2.8',
      date: '2026-07-19 18:40',
      sha256Checksum: 'cc9011af3412aa894412df76a001bb92348574189082caef098492019943412a',
      sizeKb: 1.4,
      parameters: {
        speedLimit: 25,
        motorCurrent: 17,
        regenStrength: 1,
        tempCutoff: 70
      },
      notes: 'Routine monthly safeguard backup.'
    }
  ],
  devices: [
    {
      id: 'dev-pro2-01',
      name: 'Pro 2 · Garage',
      modelId: 'xiaomi-pro-2',
      modelName: 'Xiaomi Mi Electric Scooter Pro 2',
      firmwareVersion: 'v2.2.8',
      batteryLevel: 84,
      temperatureC: 31,
      lastConnected: '2026-09-28 14:30',
      licenseKey: 'KSTL-81B9-44KP-22NX',
      status: 'Connected',
      currentSpeedLimit: 32,
      currentMotorCurrent: 22
    },
    {
      id: 'dev-g30-01',
      name: 'Max G30 · Track',
      modelId: 'segway-ninebot-max-g30',
      modelName: 'Segway-Ninebot KickScooter Max G30',
      firmwareVersion: 'DRV 1.5.4',
      batteryLevel: 92,
      temperatureC: 28,
      lastConnected: '2026-09-25 11:20',
      status: 'Standby',
      currentSpeedLimit: 25,
      currentMotorCurrent: 25
    }
  ],
  activityLogs: [
    {
      id: 'act-1',
      timestamp: '2026-09-28 14:32:05',
      type: 'success',
      message: 'Package PKG-MI-PRO2-228 verified & applied',
      details: 'SHA-256: e3b0c44...b855 (All 8 blocks committed cleanly)'
    },
    {
      id: 'act-2',
      timestamp: '2026-09-28 14:30:11',
      type: 'info',
      message: 'Non-volatile pre-write snapshot created',
      details: 'Checksum: ab41f92e...e90c saved to local account store'
    },
    {
      id: 'act-3',
      timestamp: '2026-09-24 16:30:44',
      type: 'info',
      message: 'License key KSTL-7F3A-92QD-H5MX generated',
      details: 'Plan: Single Device (German Private Property acknowledgment signed)'
    },
    {
      id: 'act-4',
      timestamp: '2026-09-12 14:24:55',
      type: 'success',
      message: 'Restore to stock completed on Pro 2 · Garage',
      details: 'Reverted to factory baseline: 25 km/h, 17A current limit'
    }
  ]
};

export function getMockDb(): MockDbState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DB));
      return INITIAL_DB;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DB;
  }
}

export function saveMockDb(state: MockDbState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to persist mockDb:', err);
  }
}

export function resetMockDb(): MockDbState {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DB));
  } catch (err) {
    console.error('Failed to reset mockDb:', err);
  }
  return INITIAL_DB;
}
