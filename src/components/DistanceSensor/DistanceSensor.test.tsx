import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../test/mocks/i18n';
import { DistanceSensor } from './DistanceSensor';
import { MOTOR_PORT } from '../../hooks/useLegoBoost';

const defaultProps = {
  sensorData: { distance: null, color: null },
  onSubscribe: vi.fn(),
  onUnsubscribe: vi.fn(),
  disabled: false,
};

describe('DistanceSensor', () => {
  it('shows placeholder when distance is null', () => {
    render(<DistanceSensor {...defaultProps} />);
    expect(screen.getByText('--')).toBeInTheDocument();
  });

  it('shows bar width 0% when distance is null', () => {
    const { container } = render(<DistanceSensor {...defaultProps} />);
    const bar = container.querySelector('.distance-sensor__bar') as HTMLElement;
    expect(bar.style.width).toBe('0%');
  });

  it('shows bar width 50% for distance 5', () => {
    const { container } = render(
      <DistanceSensor {...defaultProps} sensorData={{ distance: 5, color: null }} />
    );
    const bar = container.querySelector('.distance-sensor__bar') as HTMLElement;
    expect(bar.style.width).toBe('50%');
  });

  it('caps bar width at 100% for distance > 10', () => {
    const { container } = render(
      <DistanceSensor {...defaultProps} sensorData={{ distance: 15, color: null }} />
    );
    const bar = container.querySelector('.distance-sensor__bar') as HTMLElement;
    expect(bar.style.width).toBe('100%');
  });

  it('shows bar width 100% for distance 10', () => {
    const { container } = render(
      <DistanceSensor {...defaultProps} sensorData={{ distance: 10, color: null }} />
    );
    const bar = container.querySelector('.distance-sensor__bar') as HTMLElement;
    expect(bar.style.width).toBe('100%');
  });

  it('toggles active state on click', async () => {
    const onSubscribe = vi.fn();
    render(<DistanceSensor {...defaultProps} onSubscribe={onSubscribe} />);
    await userEvent.click(screen.getByText('common.activate'));
    expect(onSubscribe).toHaveBeenCalledWith(MOTOR_PORT.C);
  });

  it('unsubscribes and deactivates on port change while active', async () => {
    const onUnsubscribe = vi.fn();
    const onSubscribe = vi.fn();
    render(
      <DistanceSensor {...defaultProps} onSubscribe={onSubscribe} onUnsubscribe={onUnsubscribe} />
    );
    // Activate
    await userEvent.click(screen.getByText('common.activate'));
    // Change port to D
    await userEvent.click(screen.getByText('D'));
    expect(onUnsubscribe).toHaveBeenCalledWith(MOTOR_PORT.C);
  });
});
