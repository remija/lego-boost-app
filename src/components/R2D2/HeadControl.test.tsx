import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '../../test/mocks/i18n';
import { HeadControl } from './HeadControl';

const defaultProps = {
  onRotate: vi.fn(),
  onStop: vi.fn(),
  disabled: false,
};

describe('HeadControl', () => {
  it('calls onRotate(-70) on left button mousedown', () => {
    const onRotate = vi.fn();
    render(<HeadControl {...defaultProps} onRotate={onRotate} />);
    fireEvent.mouseDown(screen.getByText('↶'));
    expect(onRotate).toHaveBeenCalledWith(-70);
  });

  it('calls onRotate(70) on right button mousedown', () => {
    const onRotate = vi.fn();
    render(<HeadControl {...defaultProps} onRotate={onRotate} />);
    fireEvent.mouseDown(screen.getByText('↷'));
    expect(onRotate).toHaveBeenCalledWith(70);
  });

  it('calls onStop on mouseup', () => {
    const onStop = vi.fn();
    render(<HeadControl {...defaultProps} onStop={onStop} />);
    fireEvent.mouseDown(screen.getByText('↶'));
    fireEvent.mouseUp(screen.getByText('↶'));
    expect(onStop).toHaveBeenCalled();
  });

  it('does not call onRotate when disabled', () => {
    const onRotate = vi.fn();
    render(<HeadControl {...defaultProps} onRotate={onRotate} disabled />);
    fireEvent.mouseDown(screen.getByText('↶'));
    expect(onRotate).not.toHaveBeenCalled();
  });
});
