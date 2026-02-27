import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../test/mocks/i18n';
import { LedControl } from './LedControl';

describe('LedControl', () => {
  it('renders 11 color buttons', () => {
    render(<LedControl onColorChange={vi.fn()} disabled={false} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(11);
  });

  it('calls onColorChange with correct value on click', async () => {
    const onColorChange = vi.fn();
    render(<LedControl onColorChange={onColorChange} disabled={false} />);
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[3]); // Blue (index 3, value 3)
    expect(onColorChange).toHaveBeenCalledWith(3);
  });

  it('disables all buttons when disabled', () => {
    render(<LedControl onColorChange={vi.fn()} disabled />);
    screen.getAllByRole('button').forEach(btn => expect(btn).toBeDisabled());
  });
});
