import type { ReactNode } from 'react';
import { useLegoBoost } from '../hooks/useLegoBoost';
import { LegoBoostContext } from './LegoBoostContextDef';

export function LegoBoostProvider({ children }: { children: ReactNode }) {
  const legoBoost = useLegoBoost();

  return (
    <LegoBoostContext.Provider value={legoBoost}>
      {children}
    </LegoBoostContext.Provider>
  );
}
