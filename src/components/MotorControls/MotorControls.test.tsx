import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '../../test/mocks/i18n';
import { MotorControls } from './MotorControls';

const defaultProps = {
  onDrive: vi.fn(),
  onTurn: vi.fn(),
  onStop: vi.fn(),
  disabled: false,
};

describe('MotorControls', () => {
  it('has speed slider defaulting to 50', () => {
    render(<MotorControls {...defaultProps} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveValue('50');
  });

  it('updates speed on slider change', async () => {
    render(<MotorControls {...defaultProps} />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '80' } });
    expect(slider).toHaveValue('80');
  });

  it('calls onDrive on forward mousedown', () => {
    const onDrive = vi.fn();
    render(<MotorControls {...defaultProps} onDrive={onDrive} />);
    fireEvent.mouseDown(screen.getByText('▲'));
    expect(onDrive).toHaveBeenCalledWith(50);
  });

  it('calls onDrive with negative on backward mousedown', () => {
    const onDrive = vi.fn();
    render(<MotorControls {...defaultProps} onDrive={onDrive} />);
    fireEvent.mouseDown(screen.getByText('▼'));
    expect(onDrive).toHaveBeenCalledWith(-50);
  });

  it('calls onTurn on left mousedown', () => {
    const onTurn = vi.fn();
    render(<MotorControls {...defaultProps} onTurn={onTurn} />);
    fireEvent.mouseDown(screen.getByText('◀'));
    expect(onTurn).toHaveBeenCalledWith(-50);
  });

  it('calls onTurn on right mousedown', () => {
    const onTurn = vi.fn();
    render(<MotorControls {...defaultProps} onTurn={onTurn} />);
    fireEvent.mouseDown(screen.getByText('▶'));
    expect(onTurn).toHaveBeenCalledWith(50);
  });

  it('calls onStop on mouseup', () => {
    const onStop = vi.fn();
    render(<MotorControls {...defaultProps} onStop={onStop} />);
    fireEvent.mouseUp(screen.getByText('▲'));
    expect(onStop).toHaveBeenCalled();
  });

  it('disables all controls when disabled', () => {
    render(<MotorControls {...defaultProps} disabled />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => expect(btn).toBeDisabled());
    expect(screen.getByRole('slider')).toBeDisabled();
  });
});
