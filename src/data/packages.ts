export interface ParameterChange {
  parameterId: string;
  name: string;
  stockValue: string | number;
  newValue: string | number;
  unit: string;
  guardrailRange: string;
  safetyMargin: string;
}

export interface ParameterPackage {
  packageId: string;
  modelId: string;
  modelName: string;
  firmwareVersion: string;
  releaseDate: string;
  sha256Checksum: string;
  authorSignature: string;
  targetArchitecture: string;
  totalBlocks: number;
  safetyVerificationLevel: 'Hardware Guarded' | 'Restricted Range' | 'Baseline Verified';
  description: string;
  changes: ParameterChange[];
  compatibilityConstraints: string[];
}

export const PARAMETER_PACKAGES: Record<string, ParameterPackage> = {
  'PKG-MI-PRO2-228': {
    packageId: 'PKG-MI-PRO2-228',
    modelId: 'xiaomi-pro-2',
    modelName: 'Xiaomi Mi Electric Scooter Pro 2',
    firmwareVersion: 'v2.2.8',
    releaseDate: '2024-03-14',
    sha256Checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    authorSignature: 'ED25519:7b92...41a0 [Verified Manifest]',
    targetArchitecture: 'STM32F103 (ESC Rev 2.1)',
    totalBlocks: 8,
    safetyVerificationLevel: 'Hardware Guarded',
    description: 'Private-property performance optimization pack with stock safety ceiling and active thermal trip points preserved.',
    changes: [
      {
        parameterId: 'speed_limit',
        name: 'Top Speed Limit',
        stockValue: '25 km/h',
        newValue: '33 km/h',
        unit: 'km/h',
        guardrailRange: '20–34 km/h',
        safetyMargin: '12% below motor back-EMF limit'
      },
      {
        parameterId: 'motor_current',
        name: 'Phase Current Limit',
        stockValue: '17 A',
        newValue: '22 A',
        unit: 'A',
        guardrailRange: '15–25 A',
        safetyMargin: '3A below MOSFET dissipation rating'
      },
      {
        parameterId: 'regen_strength',
        name: 'KERS Energy Recovery',
        stockValue: 'Level 1 (Mild)',
        newValue: 'Level 2 (Balanced)',
        unit: 'Level',
        guardrailRange: '0–3',
        safetyMargin: 'Peak voltage surge < 42.6V'
      },
      {
        parameterId: 'temp_cutoff',
        name: 'ESC Thermal Cutoff',
        stockValue: '70 °C',
        newValue: '68 °C',
        unit: '°C',
        guardrailRange: '65–72 °C',
        safetyMargin: 'Enhanced safety (+2°C tighter threshold)'
      }
    ],
    compatibilityConstraints: [
      'Battery state-of-charge must be ≥ 30% before write',
      'Ambient ESC temperature must measure below 45°C prior to flash',
      'BLE signal RSSI must be stronger than -78 dBm',
      'Stock ESC bootloader v2.x checksum must match target descriptor'
    ]
  },
  'PKG-MI-PRO2-223': {
    packageId: 'PKG-MI-PRO2-223',
    modelId: 'xiaomi-pro-2',
    modelName: 'Xiaomi Mi Electric Scooter Pro 2',
    firmwareVersion: 'v2.2.3',
    releaseDate: '2024-02-10',
    sha256Checksum: '9a03b54432a104f21689bc6625841029497e882046487ff1b17169123847291a',
    authorSignature: 'ED25519:3e41...98ff [Verified Manifest]',
    targetArchitecture: 'STM32F103 (ESC Rev 2.1)',
    totalBlocks: 8,
    safetyVerificationLevel: 'Hardware Guarded',
    description: 'Validated baseline parameter pack for firmware v2.2.3.',
    changes: [
      {
        parameterId: 'speed_limit',
        name: 'Top Speed Limit',
        stockValue: '25 km/h',
        newValue: '32 km/h',
        unit: 'km/h',
        guardrailRange: '20–34 km/h',
        safetyMargin: '14% safety headroom'
      },
      {
        parameterId: 'motor_current',
        name: 'Phase Current Limit',
        stockValue: '17 A',
        newValue: '21 A',
        unit: 'A',
        guardrailRange: '15–25 A',
        safetyMargin: '4A below thermal limit'
      }
    ],
    compatibilityConstraints: [
      'Battery state-of-charge must be ≥ 30%',
      'Stock bootloader checksum verified'
    ]
  },
  'PKG-NB-G30-154': {
    packageId: 'PKG-NB-G30-154',
    modelId: 'segway-ninebot-max-g30',
    modelName: 'Segway-Ninebot KickScooter Max G30',
    firmwareVersion: 'DRV 1.5.4',
    releaseDate: '2024-03-20',
    sha256Checksum: '1c496a798934abdf43b23e8093284092bbfa5329107932649a21808bcf431872',
    authorSignature: 'ED25519:11ef...72ca [Verified Manifest]',
    targetArchitecture: 'STM32F103 (Gen1 ESC)',
    totalBlocks: 9,
    safetyVerificationLevel: 'Hardware Guarded',
    description: 'High-efficiency private track configuration for Ninebot Max G30 with reinforced power curves.',
    changes: [
      {
        parameterId: 'speed_limit',
        name: 'Top Speed Limit',
        stockValue: '25 km/h',
        newValue: '34 km/h',
        unit: 'km/h',
        guardrailRange: '20–35 km/h',
        safetyMargin: 'Verified safe on 36V 551Wh battery'
      },
      {
        parameterId: 'motor_current',
        name: 'Phase Current Limit',
        stockValue: '25 A',
        newValue: '28 A',
        unit: 'A',
        guardrailRange: '20–30 A',
        safetyMargin: 'Connectors rated to 35A continuous'
      },
      {
        parameterId: 'temp_cutoff',
        name: 'Thermal Cutoff Guard',
        stockValue: '75 °C',
        newValue: '72 °C',
        unit: '°C',
        guardrailRange: '68–74 °C',
        safetyMargin: 'Extra conservative margin (+3°C below factory trip)'
      }
    ],
    compatibilityConstraints: [
      'G30 Gen1 / Gen2 motor harness inspected',
      'Battery voltage must measure ≥ 37.0V',
      'BLE dashboard link RSSI ≥ -75 dBm'
    ]
  }
};
