import { describe, it, expect } from 'vitest';
import {
  getAllPrograms,
  getProgram,
  saveProgram,
  updateProgram,
  renameProgram,
  deleteProgram,
  duplicateProgram,
} from './programStorage';
import type { Block } from '../types/blocks';

const STORAGE_KEY = 'lego-boost-programs';

const makeBlocks = (): Block[] => [
  { id: '1', type: 'move-forward', speed: 50, duration: 1 },
];

describe('programStorage', () => {
  describe('getAllPrograms', () => {
    it('returns empty array when no data', () => {
      expect(getAllPrograms()).toEqual([]);
    });

    it('returns parsed programs', () => {
      const programs = [{ id: 'a', name: 'Test', blocks: [], createdAt: 0, updatedAt: 0 }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
      expect(getAllPrograms()).toEqual(programs);
    });

    it('returns empty array on corrupted JSON', () => {
      localStorage.setItem(STORAGE_KEY, '{bad json');
      expect(getAllPrograms()).toEqual([]);
    });
  });

  describe('getProgram', () => {
    it('returns undefined for unknown id', () => {
      expect(getProgram('nope')).toBeUndefined();
    });

    it('returns program by id', () => {
      const program = saveProgram('Test', makeBlocks());
      expect(getProgram(program.id)).toEqual(program);
    });
  });

  describe('saveProgram', () => {
    it('creates program with generated id and timestamps', () => {
      const program = saveProgram('My Prog', makeBlocks());
      expect(program.name).toBe('My Prog');
      expect(program.id).toMatch(/^test-uuid-/);
      expect(program.blocks).toEqual(makeBlocks());
      expect(program.createdAt).toBeGreaterThan(0);
      expect(program.updatedAt).toBe(program.createdAt);
    });

    it('persists to localStorage', () => {
      saveProgram('A', makeBlocks());
      saveProgram('B', makeBlocks());
      expect(getAllPrograms()).toHaveLength(2);
    });
  });

  describe('updateProgram', () => {
    it('updates blocks and updatedAt', () => {
      const program = saveProgram('Test', makeBlocks());
      const newBlocks: Block[] = [{ id: '2', type: 'stop' }];
      const updated = updateProgram(program.id, newBlocks);
      expect(updated!.blocks).toEqual(newBlocks);
      expect(updated!.updatedAt).toBeGreaterThanOrEqual(program.updatedAt);
    });

    it('returns undefined for unknown id', () => {
      expect(updateProgram('unknown', [])).toBeUndefined();
    });
  });

  describe('renameProgram', () => {
    it('updates name', () => {
      const program = saveProgram('Old', makeBlocks());
      const renamed = renameProgram(program.id, 'New');
      expect(renamed!.name).toBe('New');
    });

    it('returns undefined for unknown id', () => {
      expect(renameProgram('unknown', 'x')).toBeUndefined();
    });
  });

  describe('deleteProgram', () => {
    it('removes program and returns true', () => {
      const program = saveProgram('Test', makeBlocks());
      expect(deleteProgram(program.id)).toBe(true);
      expect(getAllPrograms()).toHaveLength(0);
    });

    it('returns false for unknown id', () => {
      expect(deleteProgram('unknown')).toBe(false);
    });
  });

  describe('duplicateProgram', () => {
    it('creates copy with "(copie)" suffix', () => {
      const program = saveProgram('Robot', makeBlocks());
      const copy = duplicateProgram(program.id);
      expect(copy!.name).toBe('Robot (copie)');
      expect(copy!.id).not.toBe(program.id);
      expect(copy!.blocks).toEqual(program.blocks);
    });

    it('returns undefined for unknown id', () => {
      expect(duplicateProgram('unknown')).toBeUndefined();
    });
  });
});
