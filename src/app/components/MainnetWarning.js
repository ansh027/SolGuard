'use client';

import { useState, useEffect } from 'react';
import { useNetwork } from '../context/NetworkContext';
import { ShieldAlert } from 'lucide-react';

export default function MainnetWarning() {
  const { network, setNetwork } = useNetwork();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (network === 'mainnet') setShow(true);
  }, [network]);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--warning)', padding: '28px',
        maxWidth: '420px', width: '100%',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <ShieldAlert size={22} color="var(--warning)" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--warning)' }}>
            Switching to Mainnet
          </h2>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '8px' }}>
          You are about to switch to <strong style={{ color: 'var(--text-primary)' }}>Solana Mainnet</strong>. This means:
        </p>

        <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '18px', marginBottom: '20px' }}>
          <li>You will be viewing your <strong style={{ color: 'var(--text-primary)' }}>real wallet</strong> with real funds</li>
          <li>All analysis uses <strong style={{ color: 'var(--text-primary)' }}>real on-chain data</strong></li>
          <li>SolGuard <strong style={{ color: 'var(--safe)' }}>never</strong> requests transaction signing in analysis mode</li>
          <li>Always verify before signing anything on mainnet</li>
        </ul>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => { setNetwork('devnet'); setShow(false); }}
            style={{
              flex: 1, padding: '10px', borderRadius: 'var(--radius)',
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer',
            }}
          >
            Stay on Devnet
          </button>
          <button
            onClick={() => setShow(false)}
            style={{
              flex: 1, padding: '10px', borderRadius: 'var(--radius)',
              border: 'none', background: 'var(--safe)',
              color: 'white', fontSize: '13px', cursor: 'pointer', fontWeight: 600,
            }}
          >
            Switch to Mainnet
          </button>
        </div>
      </div>
    </div>
  );
}
