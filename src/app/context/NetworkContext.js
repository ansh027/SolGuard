'use client';

import { createContext, useContext, useState } from 'react';

const NetworkContext = createContext();

export function NetworkProvider({ children }) {
  const [network, setNetwork] = useState('devnet');

  const toggleNetwork = () => {
    setNetwork((prev) => (prev === 'devnet' ? 'mainnet' : 'devnet'));
  };

  return (
    <NetworkContext.Provider value={{ network, setNetwork, toggleNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  return useContext(NetworkContext);
}
