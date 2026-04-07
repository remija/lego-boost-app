import { vi } from 'vitest';

export function createMockCharacteristic() {
  return {
    writeValue: vi.fn().mockResolvedValue(undefined),
    startNotifications: vi.fn().mockResolvedValue(undefined),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
}

export function createMockBluetooth() {
  const characteristic = createMockCharacteristic();

  const service = {
    getCharacteristic: vi.fn().mockResolvedValue(characteristic),
  };

  const server = {
    getPrimaryService: vi.fn().mockResolvedValue(service),
    connected: true,
  };

  const device = {
    name: 'LEGO Move Hub',
    gatt: {
      connect: vi.fn().mockResolvedValue(server),
      connected: true,
      disconnect: vi.fn(),
    },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };

  const bluetooth = {
    requestDevice: vi.fn().mockResolvedValue(device),
  };

  return { bluetooth, device, server, service, characteristic };
}
