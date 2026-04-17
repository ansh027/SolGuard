'use client';

import { useState } from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, RefreshCw, ArrowDownCircle, ArrowUpCircle, Cpu } from 'lucide-react';

export default function SimulatorPanel() {
  const [input, setInput] = useState('');
  const [type, setType] = useState('address');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const simulate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input.trim(), type }),
      });
      if (!res.ok) throw new Error('Simulation failed');
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Simulation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (v) => {
    if (v === 'safe') return 'var(--safe)';
    if (v === 'warning') return 'var(--warning)';
    return 'var(--danger)';
  };

  const getVerdictIcon = (v) => {
    if (v === 'safe') return <ShieldCheck size={20} color="var(--safe)" />;
    if (v === 'warning') return <ShieldAlert size={20} color="var(--warning)" />;
    return <ShieldX size={20} color="var(--danger)" />;
  };

  return (
    <div className="glass-card fade-in" style={{ padding: '20px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <Cpu size={16} color="var(--warning)" />
        <h2 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
          Pre-Transaction Simulator
        </h2>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px', marginTop: '4px' }}>
        Simulate any transaction before signing — see exact balance changes, programs called, and risk level.
      </p>

      {/* Type Toggle */}
      <div style={{ display: 'flex', background: 'var(--bg-primary)', borderRadius: 'var(--radius)', padding: '3px', marginBottom: '12px', width: 'fit-content' }}>
        {['address', 'transaction'].map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            style={{
              padding: '6px 14px', borderRadius: 'var(--radius)', border: 'none',
              background: type === t ? 'var(--accent)' : 'transparent',
              color: type === t ? 'white' : 'var(--text-muted)',
              fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {t === 'address' ? 'Contract Address' : 'Unsigned Transaction'}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && simulate()}
          placeholder={type === 'address' ? 'e.g. 7nYB4g7xKLy9V3k2Rp8x...' : 'Paste base64 unsigned transaction...'}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 'var(--radius)',
            background: 'var(--bg-primary)', border: '1px solid var(--border)',
            color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
          }}
        />
        <button
          onClick={simulate}
          disabled={loading || !input.trim()}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 16px', borderRadius: 'var(--radius)',
            background: 'var(--accent)', border: 'none',
            color: 'white', fontSize: '13px', cursor: 'pointer',
            opacity: loading || !input.trim() ? 0.6 : 1,
          }}
        >
          {loading
            ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
            : <Cpu size={14} />}
          {loading ? 'Simulating...' : 'Simulate'}
        </button>
      </div>

      {error && (
        <div style={{ fontSize: '13px', color: 'var(--danger)', padding: '10px', background: 'var(--bg-primary)', borderRadius: 'var(--radius)' }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* Verdict Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px', background: 'var(--bg-primary)', borderRadius: 'var(--radius)',
            borderLeft: `3px solid ${getVerdictColor(result.verdict)}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {getVerdictIcon(result.verdict)}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: getVerdictColor(result.verdict), textTransform: 'uppercase' }}>
                  {result.verdict}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{result.summary}</div>
              </div>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: getVerdictColor(result.verdict) }}>
              {result.score}/100
            </div>
          </div>

          {/* Simulation Details */}
          {result.simulation && (
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                Simulation Results
              </div>

              {/* SOL Change */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                {result.simulation.solChange?.includes('-')
                  ? <ArrowUpCircle size={14} color="var(--danger)" />
                  : <ArrowDownCircle size={14} color="var(--safe)" />}
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>SOL change:</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: result.simulation.solChange?.includes('-') ? 'var(--danger)' : 'var(--safe)' }}>
                  {result.simulation.solChange}
                </span>
              </div>

              {/* Token Changes */}
              {result.simulation.tokenChanges?.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Token movements:</div>
                  {result.simulation.tokenChanges.map((tc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '3px' }}>
                      {tc.direction === 'out'
                        ? <ArrowUpCircle size={12} color="var(--danger)" />
                        : <ArrowDownCircle size={12} color="var(--safe)" />}
                      <span style={{ color: tc.direction === 'out' ? 'var(--danger)' : 'var(--safe)' }}>{tc.change}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({tc.token})</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Programs Called */}
              {result.simulation.programsCalled?.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Programs called:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {result.simulation.programsCalled.map((p, i) => (
                      <span key={i} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '0.5px solid var(--border)' }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Approvals */}
              {result.simulation.approvalsGranted?.length > 0 && (
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--warning)', marginBottom: '4px' }}>Approvals being granted:</div>
                  {result.simulation.approvalsGranted.map((a, i) => (
                    <div key={i} style={{ fontSize: '12px', color: 'var(--warning)' }}>⚠ {a}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Risk Flags */}
          {result.risks?.length > 0 && (
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '11px', color: 'var(--danger)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Risk Flags</div>
              {result.risks.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--danger)', marginBottom: '3px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--danger)', flexShrink: 0 }}></span>
                  {r}
                </div>
              ))}
            </div>
          )}

          {/* Recommendation */}
          {result.recommendation && (
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius)', fontSize: '12px', color: 'var(--text-secondary)', border: '0.5px solid var(--border)' }}>
              Recommendation: {result.recommendation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
