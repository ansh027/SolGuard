'use client';

import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function Providers({ children }) {
  const endpoint = useMemo(() => clusterApiUrl('devnet'), []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider 
        wallets={[]} 
        autoConnect={false}
        onError={(error) => {
          if (error.name === 'WalletConnectionError') return;
          console.error(error);
        }}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
