export interface FirmwareVersion {
  version: string;
  status: 'supported' | 'read-only' | 'out-of-scope';
  releaseDate: string;
  notes: string;
  packageId?: string;
}

export interface ParameterSpec {
  id: string;
  name: string;
  unit: string;
  stockValue: number | string;
  defaultValue: number | string;
  min: number;
  max: number;
  step?: number;
  safeMin: number;
  safeMax: number;
  guardrailNote: string;
  description: string;
}

export interface ScooterModel {
  id: string;
  brand: 'Xiaomi' | 'Segway-Ninebot' | 'Fictional/Test';
  name: string;
  modelCode: string;
  releaseYear: string;
  status: 'supported' | 'read-only' | 'out-of-scope';
  statusReason?: string;
  stockTopSpeedKmH: number;
  maxSafeSpeedKmH: number;
  supportedFirmwareCount: number;
  totalFirmwareCount: number;
  firmwares: FirmwareVersion[];
  parameters: ParameterSpec[];
  architecture: string;
  bleChipset: string;
  escType: string;
}

export const SCOOTER_MODELS: ScooterModel[] = [
  {
    id: 'xiaomi-pro-2',
    brand: 'Xiaomi',
    name: 'Xiaomi Mi Electric Scooter Pro 2',
    modelCode: 'DDHBC11NEB',
    releaseYear: '2020–2022',
    status: 'supported',
    stockTopSpeedKmH: 25,
    maxSafeSpeedKmH: 34,
    supportedFirmwareCount: 3,
    totalFirmwareCount: 4,
    architecture: 'STM32F103 ESC + nRF51822 BLE',
    bleChipset: 'Nordic nRF51822 (Rev 3)',
    escType: 'v2.1 reinforced trace board',
    firmwares: [
      { version: 'v2.2.3', status: 'supported', releaseDate: '2021-04-12', notes: 'Fully open parameter map, reliable write window.', packageId: 'PKG-MI-PRO2-223' },
      { version: 'v2.2.8', status: 'supported', releaseDate: '2021-09-18', notes: 'Standard stock firmware. Full parameter modification allowed.', packageId: 'PKG-MI-PRO2-228' },
      { version: 'v2.3.6', status: 'supported', releaseDate: '2022-02-10', notes: 'BLE auth token validation passed. High stability.', packageId: 'PKG-MI-PRO2-236' },
      { version: 'v2.4.8', status: 'out-of-scope', releaseDate: '2022-11-05', notes: 'OTA locked with asymmetric RSA signature check. Out of scope.' }
    ],
    parameters: [
      {
        id: 'speed_limit',
        name: 'Top Speed Ceiling',
        unit: 'km/h',
        stockValue: 25,
        defaultValue: 32,
        min: 15,
        max: 40,
        safeMin: 20,
        safeMax: 34,
        guardrailNote: 'Above 34 km/h motor back-EMF reduces braking headroom on stock 36V packs.',
        description: 'Governs maximum ESC PWM duty cycle under flat terrain in private-property mode.'
      },
      {
        id: 'motor_current',
        name: 'Nominal Phase Current',
        unit: 'A',
        stockValue: 17,
        defaultValue: 22,
        min: 12,
        max: 32,
        safeMin: 15,
        safeMax: 25,
        guardrailNote: 'Exceeding 25A induces excessive MOSFET thermal accumulation on factory heatsinks.',
        description: 'Maximum phase current injected to stator coils during peak acceleration.'
      },
      {
        id: 'regen_strength',
        name: 'KERS Energy Recovery',
        unit: 'Level',
        stockValue: 1,
        defaultValue: 2,
        min: 0,
        max: 3,
        step: 1,
        safeMin: 0,
        safeMax: 3,
        guardrailNote: 'Level 3 creates heavy initial brake surge on descending gradients.',
        description: 'Kinetic energy recovery braking force when throttle is fully released.'
      },
      {
        id: 'temp_cutoff',
        name: 'ESC Thermal Cutoff',
        unit: '°C',
        stockValue: 70,
        defaultValue: 68,
        min: 60,
        max: 85,
        safeMin: 65,
        safeMax: 72,
        guardrailNote: 'Safety floor enforced: cannot exceed 72°C to prevent PCB delamination.',
        description: 'Emergency shutdown threshold monitored by internal ESC NTC sensor.'
      }
    ]
  },
  {
    id: 'segway-ninebot-max-g30',
    brand: 'Segway-Ninebot',
    name: 'Segway-Ninebot KickScooter Max G30',
    modelCode: 'G30P / G30D',
    releaseYear: '2019–2023',
    status: 'supported',
    stockTopSpeedKmH: 25,
    maxSafeSpeedKmH: 35,
    supportedFirmwareCount: 4,
    totalFirmwareCount: 5,
    architecture: 'STM32F103 ESC + nRF52840 Dashboard',
    bleChipset: 'Nordic nRF52840',
    escType: 'Gen1 / Gen2 ESC with heavy-gauge wiring',
    firmwares: [
      { version: 'DRV 1.2.6', status: 'supported', releaseDate: '2020-01-15', notes: 'Direct parameter write supported.', packageId: 'PKG-NB-G30-126' },
      { version: 'DRV 1.5.4', status: 'supported', releaseDate: '2020-08-20', notes: 'Optimal power curves; verified checksum table.', packageId: 'PKG-NB-G30-154' },
      { version: 'DRV 1.6.3', status: 'supported', releaseDate: '2021-03-11', notes: 'Fully compliant write sequencing supported.', packageId: 'PKG-NB-G30-163' },
      { version: 'DRV 1.7.0', status: 'supported', releaseDate: '2021-10-04', notes: 'Requires staged packet acknowledgement.', packageId: 'PKG-NB-G30-170' },
      { version: 'DRV 1.8.8', status: 'out-of-scope', releaseDate: '2023-04-19', notes: 'Cryptographically locked bootloader block. Out of scope.' }
    ],
    parameters: [
      {
        id: 'speed_limit',
        name: 'Top Speed Ceiling',
        unit: 'km/h',
        stockValue: 25,
        defaultValue: 33,
        min: 15,
        max: 38,
        safeMin: 20,
        safeMax: 35,
        guardrailNote: '35 km/h is the thermal threshold for stock internal charger and battery cells.',
        description: 'Governs high-speed field weakening and motor speed controller limit.'
      },
      {
        id: 'motor_current',
        name: 'Nominal Phase Current',
        unit: 'A',
        stockValue: 25,
        defaultValue: 28,
        min: 15,
        max: 36,
        safeMin: 20,
        safeMax: 30,
        guardrailNote: 'Phase wires and bullet connectors risk degradation if sustained >30A.',
        description: 'Nominal torque current for high-load hill climb conditions.'
      },
      {
        id: 'regen_strength',
        name: 'Regenerative Braking',
        unit: 'Level',
        stockValue: 1,
        defaultValue: 2,
        min: 0,
        max: 3,
        step: 1,
        safeMin: 0,
        safeMax: 3,
        guardrailNote: 'Safe throughout range on G30 high-capacity 551Wh battery.',
        description: 'Regenerative braking current delivered back to lithium battery pack.'
      },
      {
        id: 'temp_cutoff',
        name: 'Thermal Cutoff Guard',
        unit: '°C',
        stockValue: 75,
        defaultValue: 70,
        min: 65,
        max: 85,
        safeMin: 68,
        safeMax: 74,
        guardrailNote: 'Enforced maximum ceiling 74°C protects motor stator enamel coating.',
        description: 'Thermal safeguard tripping threshold.'
      }
    ]
  },
  {
    id: 'xiaomi-mi-3',
    brand: 'Xiaomi',
    name: 'Xiaomi Mi Electric Scooter 3',
    modelCode: 'DDHBC16NEB',
    releaseYear: '2021–2023',
    status: 'supported',
    stockTopSpeedKmH: 25,
    maxSafeSpeedKmH: 30,
    supportedFirmwareCount: 2,
    totalFirmwareCount: 3,
    architecture: 'STM32 ESC + BLE v1.5',
    bleChipset: 'Nordic nRF51822',
    escType: 'v3.0 compact controller',
    firmwares: [
      { version: 'v1.5.1', status: 'supported', releaseDate: '2021-08-14', notes: 'Factory baseline, safe parameter write verified.', packageId: 'PKG-MI-3-151' },
      { version: 'v1.5.5', status: 'supported', releaseDate: '2022-01-22', notes: 'Standard release, verified payload offsets.', packageId: 'PKG-MI-3-155' },
      { version: 'v1.6.2', status: 'out-of-scope', releaseDate: '2023-05-10', notes: 'Hardware fuse locked. Out of scope.' }
    ],
    parameters: [
      {
        id: 'speed_limit',
        name: 'Top Speed Ceiling',
        unit: 'km/h',
        stockValue: 25,
        defaultValue: 30,
        min: 15,
        max: 34,
        safeMin: 20,
        safeMax: 30,
        guardrailNote: 'Single-disc brake and 275Wh pack max safe ceiling is 30 km/h.',
        description: 'Governs private-property speed ceiling.'
      },
      {
        id: 'motor_current',
        name: 'Phase Current Limit',
        unit: 'A',
        stockValue: 16,
        defaultValue: 20,
        min: 12,
        max: 26,
        safeMin: 14,
        safeMax: 21,
        guardrailNote: 'Compact battery BMS cell discharge capped at 21A sustained.',
        description: 'Phase current allocation.'
      },
      {
        id: 'temp_cutoff',
        name: 'ESC Thermal Cutoff',
        unit: '°C',
        stockValue: 70,
        defaultValue: 67,
        min: 60,
        max: 80,
        safeMin: 65,
        safeMax: 70,
        guardrailNote: 'Cannot exceed 70°C for controller lifespan.',
        description: 'Controller temperature limit.'
      }
    ]
  },
  {
    id: 'segway-ninebot-f40',
    brand: 'Segway-Ninebot',
    name: 'Segway-Ninebot KickScooter F40',
    modelCode: 'F40D / F40E',
    releaseYear: '2021–2023',
    status: 'supported',
    stockTopSpeedKmH: 25,
    maxSafeSpeedKmH: 32,
    supportedFirmwareCount: 2,
    totalFirmwareCount: 3,
    architecture: 'AT32 ESC + BLE dashboard',
    bleChipset: 'Artery AT32F415',
    escType: 'F-Series Integrated ESC',
    firmwares: [
      { version: 'DRV 5.6.9', status: 'supported', releaseDate: '2021-11-02', notes: 'Verified command offsets and CRC checks.', packageId: 'PKG-NB-F40-569' },
      { version: 'DRV 5.7.4', status: 'supported', releaseDate: '2022-04-18', notes: 'Confirmed reversible parameter set.', packageId: 'PKG-NB-F40-574' },
      { version: 'DRV 5.8.5', status: 'out-of-scope', releaseDate: '2023-08-30', notes: 'Secured bootloader with signature integrity enforcement. Out of scope.' }
    ],
    parameters: [
      {
        id: 'speed_limit',
        name: 'Top Speed Ceiling',
        unit: 'km/h',
        stockValue: 25,
        defaultValue: 30,
        min: 15,
        max: 35,
        safeMin: 20,
        safeMax: 32,
        guardrailNote: 'Motor winding thermal dissipation limit is 32 km/h on 10-inch pneumatics.',
        description: 'Speed governor setting.'
      },
      {
        id: 'motor_current',
        name: 'Phase Current Limit',
        unit: 'A',
        stockValue: 22,
        defaultValue: 25,
        min: 15,
        max: 30,
        safeMin: 18,
        safeMax: 26,
        guardrailNote: '26A max prevents thermal trip on hill ascents.',
        description: 'Acceleration current limit.'
      }
    ]
  },
  {
    id: 'xiaomi-mi-4-pro',
    brand: 'Xiaomi',
    name: 'Xiaomi Electric Scooter 4 Pro',
    modelCode: 'DDHBC02ZM',
    releaseYear: '2022–2024',
    status: 'read-only',
    statusReason: 'Telemetry read & telemetry backup supported; ESC memory write register is read-only via standard BLE without intrusive vendor keys.',
    stockTopSpeedKmH: 25,
    maxSafeSpeedKmH: 25,
    supportedFirmwareCount: 2,
    totalFirmwareCount: 2,
    architecture: 'GD32 ESC + Modern Secure BLE',
    bleChipset: 'Nordic nRF52832',
    escType: 'Gen4 Encrypted ESC',
    firmwares: [
      { version: 'v1.1.2', status: 'read-only', releaseDate: '2022-09-01', notes: 'Telemetry, backup & health diagnostic verified. Write protected.' },
      { version: 'v1.2.0', status: 'read-only', releaseDate: '2023-03-15', notes: 'Read-only state. Parameter write rejected by firmware policy.' }
    ],
    parameters: []
  },
  {
    id: 'segway-ninebot-p65',
    brand: 'Segway-Ninebot',
    name: 'Segway-Ninebot KickScooter P65',
    modelCode: 'P65U / P65E',
    releaseYear: '2022–2024',
    status: 'read-only',
    statusReason: 'High-power CAN-bus protocol; configuration reads and original backup supported; modification out of scope without physical flashing.',
    stockTopSpeedKmH: 25,
    maxSafeSpeedKmH: 25,
    supportedFirmwareCount: 2,
    totalFirmwareCount: 2,
    architecture: 'Dual-core CAN bus ESC',
    bleChipset: 'Espressif ESP32-C3',
    escType: 'High voltage 48V ESC',
    firmwares: [
      { version: 'DRV 1.0.8', status: 'read-only', releaseDate: '2023-01-10', notes: 'Diagnostic read & backup supported.' },
      { version: 'DRV 1.1.4', status: 'read-only', releaseDate: '2023-07-22', notes: 'Read-only parameter inspection.' }
    ],
    parameters: []
  },
  {
    id: 'xiaomi-ultra-4',
    brand: 'Xiaomi',
    name: 'Xiaomi Electric Scooter 4 Ultra',
    modelCode: 'DDHBC03ZM',
    releaseYear: '2023–2024',
    status: 'out-of-scope',
    statusReason: 'Requires asymmetric signature validation bypass or locked hardware bootloader bypass. Explicitly out of scope per Luca’s criteria.',
    stockTopSpeedKmH: 25,
    maxSafeSpeedKmH: 25,
    supportedFirmwareCount: 0,
    totalFirmwareCount: 2,
    architecture: 'Secure Element + Hardware Crypto Bootloader',
    bleChipset: 'Secure BLE module',
    escType: 'Dual-suspension high voltage ESC',
    firmwares: [
      { version: 'v1.0.4', status: 'out-of-scope', releaseDate: '2023-06-12', notes: 'Hardware signature verification enforced. Out of scope.' },
      { version: 'v1.1.1', status: 'out-of-scope', releaseDate: '2024-01-05', notes: 'Hardware signature verification enforced. Out of scope.' }
    ],
    parameters: []
  },
  {
    id: 'segway-gt2-super-scooter',
    brand: 'Segway-Ninebot',
    name: 'Segway SuperScooter GT2',
    modelCode: 'GT2-PRO',
    releaseYear: '2022–2024',
    status: 'out-of-scope',
    statusReason: 'Requires proprietary dealer token infrastructure and cryptographic bootloader bypass. Strictly out of scope.',
    stockTopSpeedKmH: 70,
    maxSafeSpeedKmH: 70,
    supportedFirmwareCount: 0,
    totalFirmwareCount: 2,
    architecture: 'Dual 1500W hub + Dual FOC controller',
    bleChipset: 'Nordic nRF52840 (Encrypted Pairing)',
    escType: 'Dual FOC 60V controllers',
    firmwares: [
      { version: 'DRV 1.4.2', status: 'out-of-scope', releaseDate: '2023-02-18', notes: 'Hardware cryptographic authentication locked. Out of scope.' }
    ],
    parameters: []
  }
];
