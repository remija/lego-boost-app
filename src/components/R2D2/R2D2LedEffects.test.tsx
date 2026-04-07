import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../test/mocks/i18n';
import { R2D2LedEffects } from './R2D2LedEffects';

describe('R2D2LedEffects', () => {
  it('renders 11 color buttons', () => {
    render(<R2D2LedEffects onColorChange={vi.fn()} disabled={false} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(11);
  });

  it('calls onColorChange on click', async () => {
    const onColorChange = vi.fn();
    render(<R2D2LedEffects onColorChange={onColorChange} disabled={false} />);
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[2]); // Purple (index 2, value 2)
    expect(onColorChange).toHaveBeenCalledWith(2);
  });

  it('disables buttons when disabled', () => {
    render(<R2D2LedEffects onColorChange={vi.fn()} disabled />);
    screen.getAllByRole('button').forEach(btn => expect(btn).toBeDisabled());
  });
});
