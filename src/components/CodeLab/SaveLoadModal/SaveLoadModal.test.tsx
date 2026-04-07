import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../../test/mocks/i18n';
import { SaveLoadModal } from './SaveLoadModal';
import type { Block } from '../../../types/blocks';

const blocks: Block[] = [{ id: '1', type: 'move-forward', speed: 50, duration: 1 }];

const defaultProps = {
  blocks,
  currentProgramId: null,
  onLoad: vi.fn(),
  onSave: vi.fn(),
  onClose: vi.fn(),
};

describe('SaveLoadModal', () => {
  it('shows save button when blocks exist', () => {
    render(<SaveLoadModal {...defaultProps} />);
    expect(screen.getByText(/codeLab\.saveModal\.saveAs/)).toBeInTheDocument();
  });

  it('does not show save section when no blocks', () => {
    render(<SaveLoadModal {...defaultProps} blocks={[]} />);
    expect(screen.queryByText(/codeLab\.saveModal\.saveAs/)).not.toBeInTheDocument();
  });

  it('save button disabled when name is empty', async () => {
    render(<SaveLoadModal {...defaultProps} />);
    await userEvent.click(screen.getByText(/codeLab\.saveModal\.saveAs/));
    const saveBtn = screen.getByText('codeLab.saveModal.save');
    expect(saveBtn.closest('button')).toBeDisabled();
  });

  it('saves program with name', async () => {
    const onSave = vi.fn();
    render(<SaveLoadModal {...defaultProps} onSave={onSave} />);
    await userEvent.click(screen.getByText(/codeLab\.saveModal\.saveAs/));
    await userEvent.type(screen.getByPlaceholderText('codeLab.saveModal.programName'), 'My Robot');
    await userEvent.click(screen.getByText('codeLab.saveModal.save'));
    expect(onSave).toHaveBeenCalled();
  });

  it('renders example programs', () => {
    render(<SaveLoadModal {...defaultProps} />);
    expect(screen.getByText(/Danse/)).toBeInTheDocument();
    expect(screen.getByText(/Carré/)).toBeInTheDocument();
  });

  it('loads example on click', async () => {
    const onLoad = vi.fn();
    render(<SaveLoadModal {...defaultProps} onLoad={onLoad} />);
    await userEvent.click(screen.getByText(/Danse/));
    expect(onLoad).toHaveBeenCalled();
  });
});
