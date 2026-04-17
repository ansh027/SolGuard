'use client';

import { useState } from 'react';
import { Search, ShieldCheck, ShieldAlert, ShieldX, RefreshCw } from 'lucide-react';
import UpgradePrompt from './UpgradePrompt';

export default function AddressReputation() {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const checkReputation = async () => {
    if (!address.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch('/api/reputation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: address.trim() }),
      });

      const data = await res.json();
      if (res.status === 429 || data.error === 'rate_limit') {
        setShowUpgrade(true);
        return;
      }
      if (!res.ok) throw new Error('Failed to check reputation');
      setResult(data);
    } catch (err) {
      setError('Failed to check address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    if (level === 'safe') return 'var(--safe)';
    if (level === 'suspicious') return 'var(--warning)';
    if (level === 'dangerous') return 'var(--danger)';
    return 'var(--text-muted)';
  };

  const getRiskIcon = (level) => {
    if (level === 'safe') return <ShieldCheck size={20} color="var(--safe)" />;
    if (level === 'suspicious') return <ShieldAlert size={20} color="var(--warning)" />;
    return <ShieldX size={20} color="var(--danger)" />;
  };

  const getRiskBorder = (level) => {
    if (level === 'safe') return 'var(--safe)';
    if (level === 'suspicious') return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <>
    <div className="glass-card fade-in" style={{ padding: '20px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Search size={16} color="var(--info)" />
        <h2 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
          Address Reputation Checker
        </h2>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && checkReputation()}
          placeholder="Enter any Solana wallet or contract address..."
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 'var(--radius)',
            background: 'var(--bg-primary)', border: '1px solid var(--border)',
            color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
          }}
        />
        <button
          onClick={checkReputation}
          disabled={loading || !address.trim()}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 16px', borderRadius: 'var(--radius)',
            background: 'var(--accent)', border: 'none',
            color: 'white', fontSize: '13px', cursor: 'pointer',
            opacity: loading || !address.trim() ? 0.6 : 1,
          }}
        >
          {loading
            ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
            : <Search size={14} />}
          {loading ? 'Checking...' : 'Check'}
        </button>
      </div>

      {error && (
        <div style={{ fontSize: '13px', color: 'var(--danger)', padding: '10px', background: 'var(--bg-primary)', borderRadius: 'var(--radius)' }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{
          padding: '16px', background: 'var(--bg-primary)',
          borderRadius: 'var(--radius)',
          borderLeft: `3px solid ${getRiskBorder(result.riskLevel)}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            {getRiskIcon(result.riskLevel)}
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: getRiskColor(result.riskLevel), textTransform: 'uppercase' }}>
                {result.riskLevel}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {address.slice(0, 8)}...{address.slice(-6)}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '24px', fontWeight: 800, color: getRiskColor(result.riskLevel) }}>
              {result.score}/100
            </div>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.5 }}>
            {result.summary}
          </div>

          {result.flags && result.flags.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
              {result.flags.map((flag, i) => (
                <div key={i} style={{ fontSize: '12px', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--danger)', flexShrink: 0 }}></span>
                  {flag}
                </div>
              ))}
            </div>
          )}

          {result.recommendation && (
            <div style={{ fontSize: '12px', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius)', color: 'var(--text-secondary)' }}>
              Recommendation: {result.recommendation}
            </div>
          )}
        </div>
      )}
    </div>

    {showUpgrade && <UpgradePrompt onClose={() => setShowUpgrade(false)} />}
    </>
  );
}
