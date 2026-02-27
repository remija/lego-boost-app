import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '../../../test/mocks/i18n';
import { Block } from './Block';
import type { Block as BlockType } from '../../../types/blocks';

describe('Block', () => {
  describe('getSpeedLabel boundaries', () => {
    it('shows slow for speed 25', () => {
      const block: BlockType = { id: '1', type: 'move-forward', speed: 25, duration: 1 };
      render(<Block block={block} />);
      expect(screen.getByText(/codeLab\.speed\.slow/)).toBeInTheDocument();
    });

    it('shows medium for speed 50', () => {
      const block: BlockType = { id: '1', type: 'move-forward', speed: 50, duration: 1 };
      render(<Block block={block} />);
      expect(screen.getByText(/codeLab\.speed\.medium/)).toBeInTheDocument();
    });

    it('shows fast for speed 75', () => {
      const block: BlockType = { id: '1', type: 'move-forward', speed: 75, duration: 1 };
      render(<Block block={block} />);
      expect(screen.getByText(/codeLab\.speed\.fast/)).toBeInTheDocument();
    });

    it('shows veryFast for speed 100', () => {
      const block: BlockType = { id: '1', type: 'move-forward', speed: 100, duration: 1 };
      render(<Block block={block} />);
      expect(screen.getByText(/codeLab\.speed\.veryFast/)).toBeInTheDocument();
    });
  });

  describe('getLedCssColor', () => {
    it('shows color preview for led block', () => {
      const block: BlockType = { id: '1', type: 'led', color: 6 };
      const { container } = render(<Block block={block} />);
      const preview = container.querySelector('.block__color-preview') as HTMLElement;
      expect(preview).toBeInTheDocument();
      expect(preview.style.background).toBe('rgb(34, 197, 94)'); // #22c55e
    });

    it('shows rainbow gradient for random color (-1)', () => {
      const block: BlockType = { id: '1', type: 'led', color: -1 };
      const { container } = render(<Block block={block} />);
      const preview = container.querySelector('.block__color-preview') as HTMLElement;
      expect(preview.classList.contains('block__color-preview--random')).toBe(true);
    });
  });

  describe('getBlockInfo', () => {
    it('shows speed and duration', () => {
      const block: BlockType = { id: '1', type: 'move-forward', speed: 50, duration: 1 };
      render(<Block block={block} />);
      expect(screen.getByText(/codeLab\.speed\.medium/)).toBeInTheDocument();
    });

    it('shows port for motor block', () => {
      const block: BlockType = { id: '1', type: 'motor', speed: 50, duration: 1, port: 'C' };
      render(<Block block={block} />);
      expect(screen.getByText(/C/)).toBeInTheDocument();
    });

    it('shows times for repeat block', () => {
      const block: BlockType = { id: '1', type: 'repeat', times: 5, children: [] };
      render(<Block block={block} />);
      expect(screen.getByText('x5')).toBeInTheDocument();
    });
  });

  it('returns null for unknown block type', () => {
    const block = { id: '1', type: 'unknown' } as unknown as BlockType;
    const { container } = render(<Block block={block} />);
    expect(container.innerHTML).toBe('');
  });

  it('does not show info when isInPalette', () => {
    const block: BlockType = { id: '1', type: 'move-forward', speed: 50, duration: 1 };
    const { container } = render(<Block block={block} isInPalette />);
    expect(container.querySelector('.block__info')).not.toBeInTheDocument();
  });
});
