export interface SimulatedBleDevice {
  advertisingName: string;
  macAddress: string;
  modelId: string;
  modelName: string;
  brand: 'Xiaomi' | 'Segway-Ninebot';
  firmwareVersion: string;
  batteryPercent: number;
  temperatureC: number;
  rssiDbm: number;
  status: 'supported' | 'read-only' | 'out-of-scope' | 'mismatch';
  statusReason?: string;
  escRevision: string;
}

export const DISCOVERABLE_DEVICES: SimulatedBleDevice[] = [
  {
    advertisingName: 'MIScooter-Pro2-3F9A',
    macAddress: 'E4:95:6E:3F:9A:12',
    modelId: 'xiaomi-pro-2',
    modelName: 'Xiaomi Mi Electric Scooter Pro 2',
    brand: 'Xiaomi',
    firmwareVersion: 'v2.2.8',
    batteryPercent: 86,
    temperatureC: 31,
    rssiDbm: -62,
    status: 'supported',
    escRevision: 'ESC Rev 2.1 (STM32F103)'
  },
  {
    advertisingName: 'Ninebot-G30-77B2',
    macAddress: 'D8:80:39:77:B2:8E',
    modelId: 'segway-ninebot-max-g30',
    modelName: 'Segway-Ninebot KickScooter Max G30',
    brand: 'Segway-Ninebot',
    firmwareVersion: 'DRV 1.5.4',
    batteryPercent: 93,
    temperatureC: 28,
    rssiDbm: -58,
    status: 'supported',
    escRevision: 'Gen1 ESC Heavy-Trace'
  },
  {
    advertisingName: 'MIScooter-Pro2-Locked-91A',
    macAddress: 'E4:95:6E:91:A4:77',
    modelId: 'xiaomi-pro-2',
    modelName: 'Xiaomi Mi Electric Scooter Pro 2 (Secured)',
    brand: 'Xiaomi',
    firmwareVersion: 'v2.4.8',
    batteryPercent: 78,
    temperatureC: 29,
    rssiDbm: -68,
    status: 'out-of-scope',
    statusReason: 'Firmware v2.4.8 has an RSA-signed bootloader. Bypassing this requires locked bootloader defeat, which is strictly out of scope.',
    escRevision: 'ESC Rev 3.0'
  },
  {
    advertisingName: 'Xiaomi-4Pro-88C1',
    macAddress: 'F2:12:44:88:C1:A0',
    modelId: 'xiaomi-mi-4-pro',
    modelName: 'Xiaomi Electric Scooter 4 Pro',
    brand: 'Xiaomi',
    firmwareVersion: 'v1.1.2',
    batteryPercent: 82,
    temperatureC: 30,
    rssiDbm: -71,
    status: 'read-only',
    statusReason: 'Diagnostic and backup read supported. Write parameters blocked by controller policy.',
    escRevision: 'Gen4 Encrypted ESC'
  },
  {
    advertisingName: 'Generic-Scooter-Unknown-0042',
    macAddress: '00:1A:7D:00:42:F1',
    modelId: 'unknown',
    modelName: 'Unrecognized Micro-Mobility Controller',
    brand: 'Xiaomi',
    firmwareVersion: 'v9.9.9-custom',
    batteryPercent: 65,
    temperatureC: 34,
    rssiDbm: -84,
    status: 'mismatch',
    statusReason: 'Controller signature did not match any verified vendor profiles. Flash forbidden to prevent bricking.',
    escRevision: 'Unknown Generic 8-bit'
  }
];

export interface PreflightCheckResult {
  step: string;
  status: 'passed' | 'warning' | 'failed';
  detail: string;
}

export function runPreflightChecks(device: SimulatedBleDevice): PreflightCheckResult[] {
  const results: PreflightCheckResult[] = [
    {
      step: 'BLE Link Signal Integrity',
      status: device.rssiDbm >= -75 ? 'passed' : 'warning',
      detail: `RSSI ${device.rssiDbm} dBm (Minimum requirement: -78 dBm)`
    },
    {
      step: 'Vendor & Model Match',
      status: device.status === 'supported' ? 'passed' : 'failed',
      detail: `${device.modelName} [${device.macAddress}]`
    },
    {
      step: 'Firmware Version Verification',
      status: device.status === 'supported' ? 'passed' : 'failed',
      detail: `Detected ${device.firmwareVersion} (Whitelisted in compatibility matrix)`
    },
    {
      step: 'Battery Level Interlock',
      status: device.batteryPercent >= 30 ? 'passed' : 'failed',
      detail: `${device.batteryPercent}% state-of-charge (Threshold: ≥ 30% required)`
    },
    {
      step: 'ESC Temperature Guardrail',
      status: device.temperatureC <= 45 ? 'passed' : 'failed',
      detail: `${device.temperatureC}°C (Well within safe operating band ≤ 45°C)`
    },
    {
      step: 'Cryptographic Protection Check',
      status: device.status !== 'out-of-scope' ? 'passed' : 'failed',
      detail: device.status === 'out-of-scope' ? 'Locked bootloader detected' : 'Standard open ESC registers verified'
    }
  ];
  return results;
}
