import { useState, useCallback, useRef } from 'react';
import { useLegoBoostContext } from '../context';
import { MOTOR_PORT, LED_COLOR, type LedColor } from './useLegoBoost';
import type { Block } from '../types/blocks';

export function useProgramExecutor() {
  const {
    setMotorsSpeed,
    setMotorSpeed,
    stopAllMotors,
    setLedColor,
    connectionStatus,
  } = useLegoBoostContext();

  const [isExecuting, setIsExecuting] = useState(false);
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null);
  const abortRef = useRef(false);

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => {
      const start = Date.now();
      const check = () => {
        if (abortRef.current) {
          resolve();
          return;
        }
        if (Date.now() - start >= ms) {
          resolve();
          return;
        }
        requestAnimationFrame(check);
      };
      check();
    });

  const executeBlock = useCallback(
    async (block: Block): Promise<void> => {
      if (abortRef.current) return;

      setCurrentBlockId(block.id);

      const speed = block.speed || 50;
      const duration = (block.duration || 1) * 1000;

      switch (block.type) {
        case 'move-forward':
          await setMotorsSpeed(speed, speed);
          await sleep(duration);
          await stopAllMotors();
          break;

        case 'move-backward':
          await setMotorsSpeed(-speed, -speed);
          await sleep(duration);
          await stopAllMotors();
          break;

        case 'turn-left':
          await setMotorsSpeed(-speed, speed);
          await sleep(duration);
          await stopAllMotors();
          break;

        case 'turn-right':
          await setMotorsSpeed(speed, -speed);
          await sleep(duration);
          await stopAllMotors();
          break;

        case 'stop':
          await stopAllMotors();
          break;

        case 'motor': {
          const port = block.port === 'D' ? MOTOR_PORT.D : MOTOR_PORT.C;
          await setMotorSpeed(port, speed);
          await sleep(duration);
          await setMotorSpeed(port, 0);
          break;
        }

        case 'led': {
          let colorValue = block.color ?? LED_COLOR.GREEN;
          // Couleur aléatoire (-1)
          if (colorValue === -1) {
            // Choisir une couleur aléatoire entre 1 et 10 (exclure 0 = off)
            colorValue = Math.floor(Math.random() * 10) + 1;
          }
          await setLedColor(colorValue as LedColor);
          break;
        }

        case 'wait':
          await sleep(duration);
          break;

        case 'repeat': {
          const times = block.times || 3;
          const children = block.children || [];
          for (let i = 0; i < times && !abortRef.current; i++) {
            for (const child of children) {
              if (abortRef.current) break;
              await executeBlock(child);
            }
          }
          break;
        }
      }

      // Small pause between blocks for visual feedback
      if (!abortRef.current) {
        await sleep(100);
      }
    },
    [setMotorsSpeed, setMotorSpeed, stopAllMotors, setLedColor]
  );

  const execute = useCallback(
    async (blocks: Block[]) => {
      if (connectionStatus !== 'connected') {
        return;
      }

      abortRef.current = false;
      setIsExecuting(true);

      try {
        for (const block of blocks) {
          if (abortRef.current) break;
          await executeBlock(block);
        }
      } catch (error) {
        console.error('Error executing program:', error);
      } finally {
        setIsExecuting(false);
        setCurrentBlockId(null);
        // Make sure motors are stopped at the end
        await stopAllMotors();
      }
    },
    [connectionStatus, executeBlock, stopAllMotors]
  );

  const stop = useCallback(async () => {
    abortRef.current = true;
    await stopAllMotors();
    setIsExecuting(false);
    setCurrentBlockId(null);
  }, [stopAllMotors]);

  return {
    isExecuting,
    currentBlockId,
    execute,
    stop,
  };
}
