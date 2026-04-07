import { vi } from 'vitest';
import type { useLegoBoost } from '../../hooks/useLegoBoost';

type LegoBoostContextValue = ReturnType<typeof useLegoBoost>;

export function createContextValue(overrides: Partial<LegoBoostContextValue> = {}): LegoBoostContextValue {
  return {
    hub: null,
    isConnecting: false,
    connectionStatus: 'disconnected',
    logs: [],
    connect: vi.fn(),
    disconnect: vi.fn(),
    clearLogs: vi.fn(),
    setMotorSpeed: vi.fn(),
    setMotorsSpeed: vi.fn(),
    stopMotor: vi.fn(),
    stopAllMotors: vi.fn(),
    drive: vi.fn(),
    turn: vi.fn(),
    setLedColor: vi.fn(),
    sensorData: { distance: null, color: null },
    subscribeSensor: vi.fn(),
    unsubscribeSensor: vi.fn(),
    tiltData: null,
    isTiltActive: false,
    subscribeTilt: vi.fn(),
    unsubscribeTilt: vi.fn(),
    ...overrides,
  };
}
