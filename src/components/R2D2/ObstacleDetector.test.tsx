import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '../../test/mocks/i18n';
import { ObstacleDetector } from './ObstacleDetector';

describe('ObstacleDetector', () => {
  it('shows inactive state when distance is null', () => {
    const { container } = render(<ObstacleDetector distance={null} />);
    expect(screen.getByText('--')).toBeInTheDocument();
    expect(screen.getByText('obstacleDetector.inactive')).toBeInTheDocument();
    expect(container.querySelector('.obstacle-detector__blip')).not.toBeInTheDocument();
  });

  it('shows danger when distance <= 3', () => {
    const { container } = render(<ObstacleDetector distance={2} />);
    expect(container.querySelector('.obstacle-detector--danger')).toBeInTheDocument();
    expect(screen.getByText('obstacleDetector.danger')).toBeInTheDocument();
  });

  it('shows warning when distance <= 6', () => {
    const { container } = render(<ObstacleDetector distance={5} />);
    expect(container.querySelector('.obstacle-detector--warning')).toBeInTheDocument();
    expect(screen.getByText('obstacleDetector.warning')).toBeInTheDocument();
  });

  it('shows safe when distance > 6', () => {
    const { container } = render(<ObstacleDetector distance={8} />);
    expect(container.querySelector('.obstacle-detector--safe')).toBeInTheDocument();
    expect(screen.getByText('obstacleDetector.safe')).toBeInTheDocument();
  });

  it('shows blip with correct position', () => {
    const { container } = render(<ObstacleDetector distance={5} />);
    const blip = container.querySelector('.obstacle-detector__blip') as HTMLElement;
    expect(blip).toBeInTheDocument();
    expect(blip.style.bottom).toBe('45%'); // 5 * 9 = 45
  });

  it('caps blip position at 90%', () => {
    const { container } = render(<ObstacleDetector distance={15} />);
    const blip = container.querySelector('.obstacle-detector__blip') as HTMLElement;
    expect(blip.style.bottom).toBe('90%'); // min(90, 15*9=135) = 90
  });

  it('boundary: distance = 3 is danger', () => {
    render(<ObstacleDetector distance={3} />);
    expect(screen.getByText('obstacleDetector.danger')).toBeInTheDocument();
  });

  it('boundary: distance = 6 is warning', () => {
    render(<ObstacleDetector distance={6} />);
    expect(screen.getByText('obstacleDetector.warning')).toBeInTheDocument();
  });
});
