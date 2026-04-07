import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../test/mocks/i18n';
import { TiltSensor } from './TiltSensor';

const defaultProps = {
  tiltData: null,
  isActive: false,
  onSubscribe: vi.fn(),
  onUnsubscribe: vi.fn(),
  disabled: false,
};

describe('TiltSensor', () => {
  it('renders with default centered indicator', () => {
    const { container } = render(<TiltSensor {...defaultProps} />);
    const indicator = container.querySelector('.tilt-sensor__indicator') as HTMLElement;
    expect(indicator.style.left).toBe('50%');
    expect(indicator.style.top).toBe('50%');
  });

  it('positions indicator based on pitch/roll', () => {
    const { container } = render(
      <TiltSensor {...defaultProps} tiltData={{ pitch: 0, roll: 0 }} />
    );
    const indicator = container.querySelector('.tilt-sensor__indicator') as HTMLElement;
    // (0+45)/90*100 = 50
    expect(indicator.style.left).toBe('50%');
    expect(indicator.style.top).toBe('50%');
  });

  it('positions indicator at extremes', () => {
    const { container } = render(
      <TiltSensor {...defaultProps} tiltData={{ pitch: -45, roll: 45 }} />
    );
    const indicator = container.querySelector('.tilt-sensor__indicator') as HTMLElement;
    expect(indicator.style.left).toBe('100%'); // (45+45)/90*100
    expect(indicator.style.top).toBe('0%'); // (-45+45)/90*100
  });

  it('displays pitch and roll values', () => {
    render(<TiltSensor {...defaultProps} tiltData={{ pitch: 10, roll: -20 }} />);
    expect(screen.getByText('10°')).toBeInTheDocument();
    expect(screen.getByText('-20°')).toBeInTheDocument();
  });

  it('shows -- when no tilt data', () => {
    const dashes = screen.queryAllByText('--');
    render(<TiltSensor {...defaultProps} />);
    expect(dashes).toBeDefined();
  });

  it('calls onSubscribe when activating', async () => {
    const onSubscribe = vi.fn();
    render(<TiltSensor {...defaultProps} onSubscribe={onSubscribe} />);
    await userEvent.click(screen.getByText('common.activate'));
    expect(onSubscribe).toHaveBeenCalled();
  });

  it('calls onUnsubscribe when deactivating', async () => {
    const onUnsubscribe = vi.fn();
    render(<TiltSensor {...defaultProps} isActive onUnsubscribe={onUnsubscribe} />);
    await userEvent.click(screen.getByText('common.deactivate'));
    expect(onUnsubscribe).toHaveBeenCalled();
  });

  it('disables button when disabled', () => {
    render(<TiltSensor {...defaultProps} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
