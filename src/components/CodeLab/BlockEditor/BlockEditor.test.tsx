import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../../test/mocks/i18n';
import { BlockEditor } from './BlockEditor';
import type { Block } from '../../../types/blocks';

const defaultProps = {
  onUpdate: vi.fn(),
  onDelete: vi.fn(),
  onClose: vi.fn(),
};

describe('BlockEditor', () => {
  it('shows speed section for move-forward', () => {
    const block: Block = { id: '1', type: 'move-forward', speed: 50, duration: 1 };
    render(<BlockEditor block={block} {...defaultProps} />);
    expect(screen.getByText('codeLab.editor.speed')).toBeInTheDocument();
  });

  it('shows duration section for wait', () => {
    const block: Block = { id: '1', type: 'wait', duration: 1 };
    render(<BlockEditor block={block} {...defaultProps} />);
    expect(screen.getByText('codeLab.editor.duration')).toBeInTheDocument();
    expect(screen.queryByText('codeLab.editor.speed')).not.toBeInTheDocument();
  });

  it('shows port section for motor', () => {
    const block: Block = { id: '1', type: 'motor', speed: 50, duration: 1, port: 'C' };
    render(<BlockEditor block={block} {...defaultProps} />);
    expect(screen.getByText('codeLab.editor.port')).toBeInTheDocument();
  });

  it('shows color section for led', () => {
    const block: Block = { id: '1', type: 'led', color: 6 };
    render(<BlockEditor block={block} {...defaultProps} />);
    expect(screen.getByText('codeLab.editor.color')).toBeInTheDocument();
  });

  it('shows times and actions for repeat', () => {
    const block: Block = { id: '1', type: 'repeat', times: 3, children: [] };
    render(<BlockEditor block={block} {...defaultProps} />);
    expect(screen.getByText('codeLab.editor.times')).toBeInTheDocument();
    expect(screen.getByText('codeLab.editor.actions')).toBeInTheDocument();
  });

  it('calls onDelete', async () => {
    const onDelete = vi.fn();
    const block: Block = { id: '1', type: 'stop' };
    render(<BlockEditor block={block} {...defaultProps} onDelete={onDelete} />);
    await userEvent.click(screen.getByText('codeLab.editor.delete'));
    expect(onDelete).toHaveBeenCalled();
  });

  it('calls onUpdate on save', async () => {
    const onUpdate = vi.fn();
    const block: Block = { id: '1', type: 'stop' };
    render(<BlockEditor block={block} {...defaultProps} onUpdate={onUpdate} />);
    await userEvent.click(screen.getByText('codeLab.editor.close'));
    expect(onUpdate).toHaveBeenCalled();
  });

  it('returns null for unknown block type', () => {
    const block = { id: '1', type: 'unknown' } as unknown as Block;
    const { container } = render(<BlockEditor block={block} {...defaultProps} />);
    expect(container.querySelector('.block-editor')).not.toBeInTheDocument();
  });
});
