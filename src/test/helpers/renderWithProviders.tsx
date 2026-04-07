import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { LegoBoostContext } from '../../context/LegoBoostContextDef';
import { createContextValue } from '../mocks/legoBoostContext';
import type { useLegoBoost } from '../../hooks/useLegoBoost';

type LegoBoostContextValue = ReturnType<typeof useLegoBoost>;

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  contextValue?: Partial<LegoBoostContextValue>;
}

export function renderWithProviders(
  ui: ReactElement,
  { contextValue = {}, ...options }: CustomRenderOptions = {}
) {
  const value = createContextValue(contextValue);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <LegoBoostContext.Provider value={value}>
        {children}
      </LegoBoostContext.Provider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    contextValue: value,
  };
}
