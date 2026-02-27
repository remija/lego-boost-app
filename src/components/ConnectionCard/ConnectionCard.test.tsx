import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../test/mocks/i18n';
import { ConnectionCard } from './ConnectionCard';
import type { LegoHub } from '../../types';

const defaultProps = {
  connectionStatus: 'disconnected' as const,
  hub: null,
  isConnecting: false,
  onConnect: vi.fn(),
  onDisconnect: vi.fn(),
};

describe('ConnectionCard', () => {
  it('shows connect button when disconnected', () => {
    render(<ConnectionCard {...defaultProps} />);
    expect(screen.getByText('connectionCard.connectButton')).toBeInTheDocument();
  });

  it('disables connect button when connecting', () => {
    render(<ConnectionCard {...defaultProps} connectionStatus="connecting" isConnecting />);
    const btn = screen.getByText('connectionCard.connectingButton').closest('button')!;
    expect(btn).toBeDisabled();
  });

  it('shows connected state with hub name', () => {
    const hub = { device: { name: 'My Hub' } } as unknown as LegoHub;
    render(<ConnectionCard {...defaultProps} connectionStatus="connected" hub={hub} />);
    expect(screen.getByText('My Hub')).toBeInTheDocument();
    expect(screen.getByText('connectionCard.disconnectButton')).toBeInTheDocument();
  });

  it('disables connect button when connected', () => {
    const hub = { device: { name: 'Hub' } } as unknown as LegoHub;
    render(<ConnectionCard {...defaultProps} connectionStatus="connected" hub={hub} />);
    const connectBtn = screen.getByText('connectionCard.connectedButton').closest('button')!;
    expect(connectBtn).toBeDisabled();
  });

  it('calls onConnect', async () => {
    const onConnect = vi.fn();
    render(<ConnectionCard {...defaultProps} onConnect={onConnect} />);
    await userEvent.click(screen.getByText('connectionCard.connectButton'));
    expect(onConnect).toHaveBeenCalled();
  });

  it('calls onDisconnect', async () => {
    const onDisconnect = vi.fn();
    const hub = { device: { name: 'Hub' } } as unknown as LegoHub;
    render(
      <ConnectionCard {...defaultProps} connectionStatus="connected" hub={hub} onDisconnect={onDisconnect} />
    );
    await userEvent.click(screen.getByText('connectionCard.disconnectButton'));
    expect(onDisconnect).toHaveBeenCalled();
  });
});
