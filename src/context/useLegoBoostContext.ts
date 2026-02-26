import { useContext } from 'react';
import { LegoBoostContext } from './LegoBoostContextDef';

export function useLegoBoostContext() {
  const context = useContext(LegoBoostContext);
  if (!context) {
    throw new Error('useLegoBoostContext must be used within a LegoBoostProvider');
  }
  return context;
}
