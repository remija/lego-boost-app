import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../test/mocks/i18n';
import { ExternalMotors } from './ExternalMotors';
import { MOTOR_PORT } from '../../hooks/useLegoBoost';

const defaultProps = {
  onMotorChange: vi.fn(),
  onMotorStop: vi.fn(),
  portC: MOTOR_PORT.C,
  portD: MOTOR_PORT.D,
  disabled: false,
};

describe('ExternalMotors', () => {
  it('renders two sliders', () => {
    render(<ExternalMotors {...defaultProps} />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
  });

  it('calls onMotorChange on slider change for port C', () => {
    const onMotorChange = vi.fn();
    render(<ExternalMotors {...defaultProps} onMotorChange={onMotorChange} />);
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '75' } });
    expect(onMotorChange).toHaveBeenCalledWith(MOTOR_PORT.C, 75);
  });

  it('calls onMotorChange on slider change for port D', () => {
    const onMotorChange = vi.fn();
    render(<ExternalMotors {...defaultProps} onMotorChange={onMotorChange} />);
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[1], { target: { value: '-50' } });
    expect(onMotorChange).toHaveBeenCalledWith(MOTOR_PORT.D, -50);
  });

  it('stop resets slider and calls onMotorStop', async () => {
    const onMotorStop = vi.fn();
    render(<ExternalMotors {...defaultProps} onMotorStop={onMotorStop} />);
    // Change C slider first
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '50' } });
    // Click stop for C
    const stopButtons = screen.getAllByText('common.stop');
    await userEvent.click(stopButtons[0]);
    expect(onMotorStop).toHaveBeenCalledWith(MOTOR_PORT.C);
  });
});
