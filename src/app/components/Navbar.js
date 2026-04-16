'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Shield } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const { connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 24px',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <Shield size={26} color="var(--accent)" />
        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          SolGuard
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link
          href="/demo"
          style={{
            color: 'var(--accent-light)',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
            padding: '5px 12px',
            borderRadius: 'var(--radius)',
            background: 'var(--accent-glow)',
            border: '1px solid var(--border-highlight)',
            transition: 'opacity var(--transition)',
          }}
          onMouseEnter={(e) => e.target.style.opacity = '0.8'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          Try Demo
        </Link>
        {mounted && connected && (
          <Link
            href="/dashboard"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'color var(--transition)',
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            Dashboard
          </Link>
        )}
        {mounted && <WalletMultiButton />}
      </div>
    </nav>
  );
}
