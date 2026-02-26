import { createContext, useContext, type ReactNode } from 'react';
import { useLegoBoost } from '../hooks/useLegoBoost';

type LegoBoostContextType = ReturnType<typeof useLegoBoost>;

const LegoBoostContext = createContext<LegoBoostContextType | null>(null);

export function LegoBoostProvider({ children }: { children: ReactNode }) {
  const legoBoost = useLegoBoost();

  return (
    <LegoBoostContext.Provider value={legoBoost}>
      {children}
    </LegoBoostContext.Provider>
  );
}

export function useLegoBoostContext() {
  const context = useContext(LegoBoostContext);
  if (!context) {
    throw new Error('useLegoBoostContext must be used within a LegoBoostProvider');
  }
  return context;
}
