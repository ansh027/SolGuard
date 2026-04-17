'use client';

import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { NetworkProvider, useNetwork } from './context/NetworkContext';
import '@solana/wallet-adapter-react-ui/styles.css';

function SolanaProviders({ children }) {
  const { network } = useNetwork();

  const endpoint = useMemo(() => {
    if (network === 'mainnet') {
      return process.env.NEXT_PUBLIC_MAINNET_RPC_URL || 'https://api.mainnet-beta.solana.com';
    }
    return process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl('devnet');
  }, [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect={false}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default function Providers({ children }) {
  return (
    <NetworkProvider>
      <SolanaProviders>
        {children}
      </SolanaProviders>
    </NetworkProvider>
  );
}
