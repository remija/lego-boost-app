import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLegoBoost } from './useLegoBoost';
import { createMockBluetooth } from '../test/mocks/webBluetooth';

describe('useLegoBoost', () => {
  describe('speed byte conversion', () => {
    it('positive speed is used as-is', async () => {
      const { bluetooth, characteristic } = createMockBluetooth();
      Object.defineProperty(navigator, 'bluetooth', { value: bluetooth, configurable: true });

      const { result } = renderHook(() => useLegoBoost());

      await act(async () => {
        await result.current.connect();
      });

      await act(async () => {
        await result.current.setMotorSpeed(0x00, 50);
      });

      const call = characteristic.writeValue.mock.calls.find(
        (c: Uint8Array[]) => c[0][2] === 0x81 && c[0][3] === 0x00
      );
      expect(call).toBeDefined();
      expect(call![0][6]).toBe(50);
    });

    it('negative speed is converted to unsigned byte', async () => {
      const { bluetooth, characteristic } = createMockBluetooth();
      Object.defineProperty(navigator, 'bluetooth', { value: bluetooth, configurable: true });

      const { result } = renderHook(() => useLegoBoost());

      await act(async () => {
        await result.current.connect();
      });

      await act(async () => {
        await result.current.setMotorSpeed(0x00, -50);
      });

      const calls = characteristic.writeValue.mock.calls.filter(
        (c: Uint8Array[]) => c[0][2] === 0x81 && c[0][3] === 0x00
      );
      const lastCall = calls[calls.length - 1];
      expect(lastCall![0][6]).toBe(206); // 256 - 50
    });

    it('clamps speed to ±100', async () => {
      const { bluetooth, characteristic } = createMockBluetooth();
      Object.defineProperty(navigator, 'bluetooth', { value: bluetooth, configurable: true });

      const { result } = renderHook(() => useLegoBoost());

      await act(async () => {
        await result.current.connect();
      });

      await act(async () => {
        await result.current.setMotorSpeed(0x00, 150);
      });

      const calls = characteristic.writeValue.mock.calls.filter(
        (c: Uint8Array[]) => c[0][2] === 0x81 && c[0][3] === 0x00
      );
      const lastCall = calls[calls.length - 1];
      expect(lastCall![0][6]).toBe(100);
    });
  });

  describe('notification parsing', () => {
    it('parses distance sensor value', async () => {
      const { bluetooth, characteristic } = createMockBluetooth();
      Object.defineProperty(navigator, 'bluetooth', { value: bluetooth, configurable: true });

      const { result } = renderHook(() => useLegoBoost());

      await act(async () => {
        await result.current.connect();
      });

      // Subscribe to sensor on port C (0x02)
      await act(async () => {
        await result.current.subscribeSensor(0x02);
      });

      // Simulate notification
      const handler = characteristic.addEventListener.mock.calls.find(
        (c: [string, (e: Event) => void]) => c[0] === 'characteristicvaluechanged'
      )![1];

      const data = new Uint8Array([0x08, 0x00, 0x45, 0x02, 0x05]);
      const event = {
        target: { value: { buffer: data.buffer } },
      };

      act(() => {
        handler(event);
      });

      expect(result.current.sensorData.distance).toBe(5);
    });

    it('parses distance 255 as null', async () => {
      const { bluetooth, characteristic } = createMockBluetooth();
      Object.defineProperty(navigator, 'bluetooth', { value: bluetooth, configurable: true });

      const { result } = renderHook(() => useLegoBoost());

      await act(async () => {
        await result.current.connect();
      });

      await act(async () => {
        await result.current.subscribeSensor(0x02);
      });

      const handler = characteristic.addEventListener.mock.calls.find(
        (c: [string, (e: Event) => void]) => c[0] === 'characteristicvaluechanged'
      )![1];

      const data = new Uint8Array([0x08, 0x00, 0x45, 0x02, 255]);
      act(() => {
        handler({ target: { value: { buffer: data.buffer } } });
      });

      expect(result.current.sensorData.distance).toBeNull();
    });

    it('parses signed tilt data', async () => {
      const { bluetooth, characteristic } = createMockBluetooth();
      Object.defineProperty(navigator, 'bluetooth', { value: bluetooth, configurable: true });

      const { result } = renderHook(() => useLegoBoost());

      await act(async () => {
        await result.current.connect();
      });

      await act(async () => {
        await result.current.subscribeTilt();
      });

      const handler = characteristic.addEventListener.mock.calls.find(
        (c: [string, (e: Event) => void]) => c[0] === 'characteristicvaluechanged'
      )![1];

      // Tilt sensor port = 0x3A, pitch=200 (=-56 signed), roll=30
      const data = new Uint8Array([0x08, 0x00, 0x45, 0x3A, 200, 30]);
      act(() => {
        handler({ target: { value: { buffer: data.buffer } } });
      });

      expect(result.current.tiltData!.pitch).toBe(-56); // 200 - 256
      expect(result.current.tiltData!.roll).toBe(30);
    });
  });

  describe('connect/disconnect flow', () => {
    it('connects and sets status', async () => {
      const { bluetooth } = createMockBluetooth();
      Object.defineProperty(navigator, 'bluetooth', { value: bluetooth, configurable: true });

      const { result } = renderHook(() => useLegoBoost());

      expect(result.current.connectionStatus).toBe('disconnected');

      await act(async () => {
        await result.current.connect();
      });

      expect(result.current.connectionStatus).toBe('connected');
      expect(result.current.hub).not.toBeNull();
    });

    it('handles missing bluetooth API', async () => {
      Object.defineProperty(navigator, 'bluetooth', { value: undefined, configurable: true });

      const { result } = renderHook(() => useLegoBoost());

      await act(async () => {
        await result.current.connect();
      });

      expect(result.current.connectionStatus).toBe('disconnected');
      expect(result.current.logs.some(l => l.type === 'error')).toBe(true);
    });
  });
});
