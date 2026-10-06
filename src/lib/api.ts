import { getMockDb, saveMockDb, License, BackupRecord, PairedDevice, ActivityLogItem } from '../data/mockDb';
import { SCOOTER_MODELS, ScooterModel } from '../data/models';

export interface OrderInput {
  plan: 'Single Device' | '3-Pack' | 'Reseller Bundle';
  email: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  termsAccepted: boolean;
  privatePropertyAccepted: boolean;
  region: string;
}

// Global demo toolbar overrides
let forceNetworkError = false;

export function setForceNetworkError(value: boolean) {
  forceNetworkError = value;
}

export function isForceNetworkError(): boolean {
  return forceNetworkError;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateLicenseKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `KSTL-${segment()}-${segment()}-${segment()}`;
}

export const api = {
  async getModels(): Promise<ScooterModel[]> {
    await delay(300);
    if (forceNetworkError) {
      throw new Error('Simulated network disruption: could not reach model registry.');
    }
    return SCOOTER_MODELS;
  },

  async verifyLicense(key: string): Promise<{ valid: boolean; license?: License; reason?: string }> {
    await delay(400);
    if (forceNetworkError) throw new Error('Network error validating license.');

    const cleanKey = key.trim().toUpperCase();
    if (cleanKey === 'KSTL-0000-0000-0000') {
      return { valid: false, reason: 'License revoked: invalid chargeback status.' };
    }

    const db = getMockDb();
    const found = db.licenses.find(l => l.key.toUpperCase() === cleanKey);

    if (found) {
      if (found.status === 'Revoked') {
        return { valid: false, reason: 'This license has been deactivated or revoked.' };
      }
      return { valid: true, license: found };
    }

    // Allow user to test any well-formed key
    if (cleanKey.startsWith('KSTL-') && cleanKey.length >= 14) {
      const mockNew: License = {
        id: `lic-${Date.now()}`,
        key: cleanKey,
        plan: 'Single Device',
        status: 'Unused',
        purchasedDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
        region: 'Private Property'
      };
      db.licenses.push(mockNew);
      saveMockDb(db);
      return { valid: true, license: mockNew };
    }

    return { valid: false, reason: 'License key not recognized. Check spelling or purchase a license in Shop.' };
  },

  async createOrder(input: OrderInput): Promise<License> {
    await delay(1200);
    if (forceNetworkError) throw new Error('Simulated payment gateway timeout.');

    const cleanCard = input.cardNumber.replace(/\s+/g, '');
    if (cleanCard.endsWith('0002')) {
      throw new Error('Transaction declined: Insufficient test funds (Simulated Card 0002 decline test).');
    }

    const db = getMockDb();
    const newLicense: License = {
      id: `lic-${Date.now()}`,
      key: generateLicenseKey(),
      plan: input.plan,
      status: 'Unused',
      purchasedDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      region: input.region || 'Standard Private Property'
    };

    db.licenses.unshift(newLicense);

    const log: ActivityLogItem = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      type: 'info',
      message: `New license purchased: ${newLicense.key}`,
      details: `Plan: ${input.plan} | Purchaser: ${input.email}`
    };
    db.activityLogs.unshift(log);

    saveMockDb(db);
    return newLicense;
  },

  async bindLicense(licenseKey: string, deviceId: string, deviceName: string): Promise<License> {
    await delay(350);
    const db = getMockDb();
    const lic = db.licenses.find(l => l.key === licenseKey);
    if (!lic) throw new Error('License not found');

    lic.status = 'Active';
    lic.boundDeviceId = deviceId;
    lic.boundDeviceName = deviceName;
    lic.boundDate = new Date().toISOString().slice(0, 16).replace('T', ' ');

    saveMockDb(db);
    return lic;
  },

  async createBackup(
    modelId: string,
    modelName: string,
    firmwareVersion: string,
    parameters: { speedLimit: number; motorCurrent: number; regenStrength: number; tempCutoff: number }
  ): Promise<BackupRecord> {
    await delay(800);
    const db = getMockDb();
    const hexDigest = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const newBackup: BackupRecord = {
      id: `bk-${Date.now().toString(36)}`,
      name: `Automatic Pre-Write Snapshot (${modelName.split(' ')[0]})`,
      modelId,
      modelName,
      firmwareVersion,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      sha256Checksum: hexDigest,
      sizeKb: 1.4,
      parameters,
      notes: 'Generated automatically by pre-flight activation safety check.'
    };

    db.backups.unshift(newBackup);

    const log: ActivityLogItem = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      type: 'info',
      message: `Backup ${newBackup.id} safely stored to account`,
      details: `SHA-256 Checksum: ${hexDigest.slice(0, 16)}...`
    };
    db.activityLogs.unshift(log);

    saveMockDb(db);
    return newBackup;
  },

  async deleteBackup(backupId: string): Promise<void> {
    await delay(300);
    const db = getMockDb();
    db.backups = db.backups.filter(b => b.id !== backupId);
    saveMockDb(db);
  },

  async renameDevice(deviceId: string, newName: string): Promise<PairedDevice> {
    await delay(250);
    const db = getMockDb();
    const dev = db.devices.find(d => d.id === deviceId);
    if (!dev) throw new Error('Device not found');
    dev.name = newName;
    saveMockDb(db);
    return dev;
  }
};
