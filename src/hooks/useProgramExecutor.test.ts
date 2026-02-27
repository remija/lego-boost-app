import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { LegoBoostContext } from '../context/LegoBoostContextDef';
import { createContextValue } from '../test/mocks/legoBoostContext';
import { useProgramExecutor } from './useProgramExecutor';
import type { Block } from '../types/blocks';

// Mock requestAnimationFrame for sleep
vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
  setTimeout(() => cb(Date.now()), 0);
  return 0;
});

function createWrapper(overrides = {}) {
  const value = createContextValue({ connectionStatus: 'connected', ...overrides });
  return {
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(LegoBoostContext.Provider, { value }, children),
    value,
  };
}

describe('useProgramExecutor', () => {
  it('does not execute when not connected', async () => {
    const { wrapper, value } = createWrapper({ connectionStatus: 'disconnected' });
    const { result } = renderHook(() => useProgramExecutor(), { wrapper });

    const blocks: Block[] = [{ id: '1', type: 'move-forward', speed: 50, duration: 0.01 }];

    await act(async () => {
      await result.current.execute(blocks);
    });

    expect(value.setMotorsSpeed).not.toHaveBeenCalled();
  });

  it('executes move-forward block', async () => {
    const { wrapper, value } = createWrapper();
    const { result } = renderHook(() => useProgramExecutor(), { wrapper });

    const blocks: Block[] = [{ id: '1', type: 'move-forward', speed: 50, duration: 0.01 }];

    await act(async () => {
      await result.current.execute(blocks);
    });

    expect(value.setMotorsSpeed).toHaveBeenCalledWith(50, 50);
    expect(value.stopAllMotors).toHaveBeenCalled();
  });

  it('executes move-backward block', async () => {
    const { wrapper, value } = createWrapper();
    const { result } = renderHook(() => useProgramExecutor(), { wrapper });

    const blocks: Block[] = [{ id: '1', type: 'move-backward', speed: 75, duration: 0.01 }];

    await act(async () => {
      await result.current.execute(blocks);
    });

    expect(value.setMotorsSpeed).toHaveBeenCalledWith(-75, -75);
  });

  it('executes turn-left block', async () => {
    const { wrapper, value } = createWrapper();
    const { result } = renderHook(() => useProgramExecutor(), { wrapper });

    const blocks: Block[] = [{ id: '1', type: 'turn-left', speed: 50, duration: 0.01 }];

    await act(async () => {
      await result.current.execute(blocks);
    });

    expect(value.setMotorsSpeed).toHaveBeenCalledWith(-50, 50);
  });

  it('executes turn-right block', async () => {
    const { wrapper, value } = createWrapper();
    const { result } = renderHook(() => useProgramExecutor(), { wrapper });

    const blocks: Block[] = [{ id: '1', type: 'turn-right', speed: 50, duration: 0.01 }];

    await act(async () => {
      await result.current.execute(blocks);
    });

    expect(value.setMotorsSpeed).toHaveBeenCalledWith(50, -50);
  });

  it('executes stop block', async () => {
    const { wrapper, value } = createWrapper();
    const { result } = renderHook(() => useProgramExecutor(), { wrapper });

    const blocks: Block[] = [{ id: '1', type: 'stop' }];

    await act(async () => {
      await result.current.execute(blocks);
    });

    expect(value.stopAllMotors).toHaveBeenCalled();
  });

  it('executes motor block on correct port', async () => {
    const { wrapper, value } = createWrapper();
    const { result } = renderHook(() => useProgramExecutor(), { wrapper });

    const blocks: Block[] = [{ id: '1', type: 'motor', speed: 50, duration: 0.01, port: 'D' }];

    await act(async () => {
      await result.current.execute(blocks);
    });

    expect(value.setMotorSpeed).toHaveBeenCalledWith(0x03, 50); // MOTOR_PORT.D
  });

  it('executes led block', async () => {
    const { wrapper, value } = createWrapper();
    const { result } = renderHook(() => useProgramExecutor(), { wrapper });

    const blocks: Block[] = [{ id: '1', type: 'led', color: 3 }];

    await act(async () => {
      await result.current.execute(blocks);
    });

    expect(value.setLedColor).toHaveBeenCalledWith(3);
  });

  it('executes led random color', async () => {
    const { wrapper, value } = createWrapper();
    const { result } = renderHook(() => useProgramExecutor(), { wrapper });

    const blocks: Block[] = [{ id: '1', type: 'led', color: -1 }];

    await act(async () => {
      await result.current.execute(blocks);
    });

    const call = (value.setLedColor as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(call).toBeGreaterThanOrEqual(1);
    expect(call).toBeLessThanOrEqual(10);
  });

  it('executes repeat block N times', async () => {
    const { wrapper, value } = createWrapper();
    const { result } = renderHook(() => useProgramExecutor(), { wrapper });

    const blocks: Block[] = [{
      id: '1',
      type: 'repeat',
      times: 2,
      children: [{ id: '2', type: 'stop' }],
    }];

    await act(async () => {
      await result.current.execute(blocks);
    });

    // stopAllMotors called: 2x from stop blocks + 1x from finally
    const stopCalls = (value.stopAllMotors as ReturnType<typeof vi.fn>).mock.calls.length;
    expect(stopCalls).toBeGreaterThanOrEqual(3);
  });

  it('aborts execution on stop', async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useProgramExecutor(), { wrapper });

    // Don't await, call stop during execution
    act(() => {
      result.current.execute([
        { id: '1', type: 'wait', duration: 10 },
        { id: '2', type: 'move-forward', speed: 50, duration: 10 },
      ]);
    });

    await act(async () => {
      await result.current.stop();
    });

    expect(result.current.isExecuting).toBe(false);
  });
});
