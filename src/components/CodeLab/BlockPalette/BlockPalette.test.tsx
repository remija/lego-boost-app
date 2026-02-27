import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../../test/mocks/i18n';
import { BlockPalette } from './BlockPalette';

describe('BlockPalette', () => {
  it('renders 9 palette items', () => {
    const { container } = render(<BlockPalette onAddBlock={vi.fn()} />);
    const items = container.querySelectorAll('.block-palette__item');
    expect(items).toHaveLength(9);
  });

  it('calls onAddBlock on click', async () => {
    const onAddBlock = vi.fn();
    render(<BlockPalette onAddBlock={onAddBlock} />);
    const items = screen.getAllByRole('button');
    await userEvent.click(items[0]);
    expect(onAddBlock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'move-forward' })
    );
  });
});
