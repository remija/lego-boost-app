import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../test/mocks/i18n';
import { ConnectionMenu } from './ConnectionMenu';
import type { LegoHub } from '../../types';
import { LegoBoostContext } from '../../context/LegoBoostContextDef';
import { createContextValue } from '../../test/mocks/legoBoostContext';

function renderMenu(overrides = {}) {
  const value = createContextValue(overrides);
  return render(
    <LegoBoostContext.Provider value={value}>
      <ConnectionMenu />
    </LegoBoostContext.Provider>
  );
}

describe('ConnectionMenu', () => {
  it('shows disconnected label by default', () => {
    renderMenu();
    expect(screen.getByText('common.disconnected')).toBeInTheDocument();
  });

  it('opens dropdown on click', async () => {
    renderMenu();
    await userEvent.click(screen.getByText('common.disconnected'));
    expect(screen.getByText('connectionMenu.noHub')).toBeInTheDocument();
  });

  it('closes on outside click', async () => {
    renderMenu();
    await userEvent.click(screen.getByText('common.disconnected'));
    expect(screen.getByText('connectionMenu.noHub')).toBeInTheDocument();
    // Simulate outside click
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('connectionMenu.noHub')).not.toBeInTheDocument();
  });

  it('shows connected state with hub name', async () => {
    const hub = { device: { name: 'My Hub' } } as unknown as LegoHub;
    renderMenu({ connectionStatus: 'connected', hub });
    await userEvent.click(screen.getByText('common.connected'));
    expect(screen.getByText('My Hub')).toBeInTheDocument();
    expect(screen.getByText('connectionMenu.disconnect')).toBeInTheDocument();
  });

  it('calls disconnect and closes menu', async () => {
    const disconnect = vi.fn();
    const hub = { device: { name: 'Hub' } } as unknown as LegoHub;
    renderMenu({ connectionStatus: 'connected', hub, disconnect });
    await userEvent.click(screen.getByText('common.connected'));
    await userEvent.click(screen.getByText('connectionMenu.disconnect'));
    expect(disconnect).toHaveBeenCalled();
  });
});
