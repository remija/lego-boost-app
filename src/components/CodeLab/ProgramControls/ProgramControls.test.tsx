import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../../test/mocks/i18n';
import { ProgramControls } from './ProgramControls';

const defaultProps = {
  isExecuting: false,
  isConnected: true,
  hasBlocks: true,
  onPlay: vi.fn(),
  onStop: vi.fn(),
  onSave: vi.fn(),
  onClear: vi.fn(),
};

describe('ProgramControls', () => {
  describe('canPlay matrix', () => {
    it('play enabled when connected + hasBlocks + not executing', () => {
      render(<ProgramControls {...defaultProps} />);
      const playBtn = screen.getByText('codeLab.play').closest('button')!;
      expect(playBtn).not.toBeDisabled();
    });

    it('play disabled when not connected', () => {
      render(<ProgramControls {...defaultProps} isConnected={false} />);
      const playBtn = screen.getByText('codeLab.play').closest('button')!;
      expect(playBtn).toBeDisabled();
    });

    it('play disabled when no blocks', () => {
      render(<ProgramControls {...defaultProps} hasBlocks={false} />);
      const playBtn = screen.getByText('codeLab.play').closest('button')!;
      expect(playBtn).toBeDisabled();
    });
  });

  it('shows stop button when executing', () => {
    render(<ProgramControls {...defaultProps} isExecuting />);
    expect(screen.getByText('codeLab.stop')).toBeInTheDocument();
    expect(screen.queryByText('codeLab.play')).not.toBeInTheDocument();
  });

  it('calls onPlay', async () => {
    const onPlay = vi.fn();
    render(<ProgramControls {...defaultProps} onPlay={onPlay} />);
    await userEvent.click(screen.getByText('codeLab.play'));
    expect(onPlay).toHaveBeenCalled();
  });

  it('calls onStop', async () => {
    const onStop = vi.fn();
    render(<ProgramControls {...defaultProps} isExecuting onStop={onStop} />);
    await userEvent.click(screen.getByText('codeLab.stop'));
    expect(onStop).toHaveBeenCalled();
  });

  it('clear disabled when no blocks', () => {
    render(<ProgramControls {...defaultProps} hasBlocks={false} />);
    const clearBtn = screen.getByText('codeLab.clear').closest('button')!;
    expect(clearBtn).toBeDisabled();
  });

  it('clear disabled when executing', () => {
    render(<ProgramControls {...defaultProps} isExecuting />);
    // When executing, stop button shows instead of play, but clear should still render
    // Actually when executing, the stop replaces play, clear still exists
    const clearBtn = screen.getByText('codeLab.clear').closest('button')!;
    expect(clearBtn).toBeDisabled();
  });
});
