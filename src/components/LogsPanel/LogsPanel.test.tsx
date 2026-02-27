import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../test/mocks/i18n';
import { LogsPanel } from './LogsPanel';

describe('LogsPanel', () => {
  it('shows empty state when no logs', () => {
    render(<LogsPanel logs={[]} onClear={vi.fn()} />);
    expect(screen.getByText('logsPanel.empty')).toBeInTheDocument();
  });

  it('does not show clear button when empty', () => {
    render(<LogsPanel logs={[]} onClear={vi.fn()} />);
    expect(screen.queryByText('logsPanel.clear')).not.toBeInTheDocument();
  });

  it('renders entries with type class', () => {
    const logs = [
      { message: 'Hello', type: 'success' as const, timestamp: '10:00' },
      { message: 'Error!', type: 'error' as const, timestamp: '10:01' },
    ];
    const { container } = render(<LogsPanel logs={logs} onClear={vi.fn()} />);
    expect(container.querySelector('.logs-panel__entry--success')).toBeInTheDocument();
    expect(container.querySelector('.logs-panel__entry--error')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Error!')).toBeInTheDocument();
  });

  it('shows clear button and calls onClear', async () => {
    const onClear = vi.fn();
    const logs = [{ message: 'Test', type: 'info' as const, timestamp: '10:00' }];
    render(<LogsPanel logs={logs} onClear={onClear} />);
    await userEvent.click(screen.getByText('logsPanel.clear'));
    expect(onClear).toHaveBeenCalled();
  });
});
