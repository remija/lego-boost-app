import { createContext } from 'react';
import type { useLegoBoost } from '../hooks/useLegoBoost';

type LegoBoostContextType = ReturnType<typeof useLegoBoost>;

export const LegoBoostContext = createContext<LegoBoostContextType | null>(null);
