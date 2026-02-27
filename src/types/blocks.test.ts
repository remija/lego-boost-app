import { describe, it, expect } from 'vitest';
import {
  getBlockTemplate,
  createBlockFromTemplate,
  BLOCK_TEMPLATES,
  type BlockType,
} from './blocks';

describe('getBlockTemplate', () => {
  it.each([
    'move-forward',
    'move-backward',
    'turn-left',
    'turn-right',
    'stop',
    'motor',
    'led',
    'wait',
    'repeat',
  ] as BlockType[])('returns template for %s', (type) => {
    const template = getBlockTemplate(type);
    expect(template).toBeDefined();
    expect(template!.type).toBe(type);
  });

  it('returns undefined for unknown type', () => {
    expect(getBlockTemplate('unknown' as BlockType)).toBeUndefined();
  });
});

describe('createBlockFromTemplate', () => {
  it('creates block with generated id', () => {
    const template = BLOCK_TEMPLATES[0]; // move-forward
    const block = createBlockFromTemplate(template);
    expect(block.id).toMatch(/^test-uuid-/);
    expect(block.type).toBe('move-forward');
  });

  it('copies default speed and duration', () => {
    const template = getBlockTemplate('move-forward')!;
    const block = createBlockFromTemplate(template);
    expect(block.speed).toBe(50);
    expect(block.duration).toBe(1);
  });

  it('copies default port for motor', () => {
    const template = getBlockTemplate('motor')!;
    const block = createBlockFromTemplate(template);
    expect(block.port).toBe('C');
  });

  it('copies default color for led', () => {
    const template = getBlockTemplate('led')!;
    const block = createBlockFromTemplate(template);
    expect(block.color).toBe(6);
  });

  it('sets children to empty array for repeat', () => {
    const template = getBlockTemplate('repeat')!;
    const block = createBlockFromTemplate(template);
    expect(block.children).toEqual([]);
    expect(block.times).toBe(3);
  });

  it('does not set optional fields when template has no defaults', () => {
    const template = getBlockTemplate('stop')!;
    const block = createBlockFromTemplate(template);
    expect(block.speed).toBeUndefined();
    expect(block.duration).toBeUndefined();
    expect(block.port).toBeUndefined();
    expect(block.color).toBeUndefined();
  });
});
