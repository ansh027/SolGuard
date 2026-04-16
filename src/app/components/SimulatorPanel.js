'use client';

import { useState } from 'react';
import { ShieldAlert, Search, Loader2, Info } from 'lucide-react';
import RiskBadge from './RiskBadge';
import AnalysisPanel from './AnalysisPanel';

export default function SimulatorPanel() {
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState('address'); // 'address' or 'transaction'
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleSimulate = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: input, type: inputType }),
      });

      if (!response.ok) {
        throw new Error('Simulation failed');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
      setError('Simulation failed to run. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="glass-card fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <ShieldAlert size={20} color="var(--warning)" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Pre-Transaction Protector</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Before you sign a transaction, paste the smart contract address or unsigned base64 string here. 
          SolGuard AI will simulate and audit it to identify honeypots, drainers, and malicious intents.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <button 
            className="btn" 
            style={{ 
              background: inputType === 'address' ? 'var(--accent)' : 'var(--bg-secondary)',
              color: inputType === 'address' ? 'white' : 'var(--text-secondary)',
              flex: 1 
            }}
            onClick={() => setInputType('address')}
          >
            Contract Address
          </button>
          <button 
            className="btn" 
            style={{ 
              background: inputType === 'transaction' ? 'var(--accent)' : 'var(--bg-secondary)',
              color: inputType === 'transaction' ? 'white' : 'var(--text-secondary)',
              flex: 1 
            }}
            onClick={() => setInputType('transaction')}
          >
            Unsigned Transaction
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputType === 'address' ? "e.g. 7nYB4g7xKLy9V3k2Rp8x..." : "Paste unsigned base64 payload..."}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 'var(--radius)',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <button 
            className="btn btn-primary" 
            onClick={handleSimulate} 
            disabled={loading || !input.trim()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 24px' }}
          >
            {loading ? <Loader2 size={18} className="spin" /> : <Search size={18} />}
            Simulate
          </button>
        </div>

        {error && (
          <div style={{ marginTop: '16px', padding: '12px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius)', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}
      </div>

      {analysis && (
        <AnalysisPanel analysis={analysis} onClose={() => setAnalysis(null)} title="Simulation Results" />
      )}
    </>
  );
}
