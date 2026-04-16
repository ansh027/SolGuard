'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { fetchBalance, fetchTokenAccounts, formatAddress } from '@/lib/solana';
import { Wallet, Coins, CircleDot, Copy, Check } from 'lucide-react';

export default function WalletOverview() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!connected || !publicKey) return;

    async function load() {
      setLoading(true);
      const [bal, tkns] = await Promise.all([
        fetchBalance(connection, publicKey),
        fetchTokenAccounts(connection, publicKey),
      ]);
      setBalance(bal);
      setTokens(tkns);
      setLoading(false);
    }

    load();
  }, [connected, publicKey, connection]);

  const handleCopy = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!connected) return null;

  return (
    <div className="glass-card fade-in" style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
        Wallet Overview
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {/* Address */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={20} color="var(--accent)" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Address</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="truncate-address" style={{ color: 'var(--text-primary)' }}>
                {formatAddress(publicKey, 6)}
              </span>
              <button
                onClick={handleCopy}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}
              >
                {copied ?
                  <Check size={14} color="var(--safe)" /> :
                  <Copy size={14} color="var(--text-muted)" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* SOL Balance */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'var(--safe-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coins size={20} color="var(--safe)" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SOL Balance</div>
            {loading ? (
              <div className="skeleton" style={{ width: 80, height: 20 }} />
            ) : (
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {balance?.toFixed(4)} SOL
              </div>
            )}
          </div>
        </div>

        {/* Token Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'var(--info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircleDot size={20} color="var(--info)" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tokens Held</div>
            {loading ? (
              <div className="skeleton" style={{ width: 40, height: 20 }} />
            ) : (
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {tokens.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
