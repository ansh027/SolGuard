'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { fetchTransactions, fetchTransactionDetail, formatAddress, formatTimestamp, getExplorerUrl } from '@/lib/solana';
import { analyzeTransaction } from '@/lib/claude';
import RiskBadge from './RiskBadge';
import AnalysisPanel from './AnalysisPanel';
import { ExternalLink, Search, Loader2, ArrowUpDown } from 'lucide-react';

export default function TransactionList() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(null); // signature being analyzed
  const [analyses, setAnalyses] = useState({}); // signature -> analysis
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  useEffect(() => {
    if (!connected || !publicKey) return;

    async function load() {
      setLoading(true);
      const txs = await fetchTransactions(connection, publicKey, 15);
      setTransactions(txs);
      setLoading(false);
    }

    load();
  }, [connected, publicKey, connection]);

  const handleAnalyze = async (tx) => {
    const sig = tx.signature;
    if (analyses[sig]) {
      setSelectedAnalysis(analyses[sig]);
      return;
    }

    setAnalyzing(sig);
    try {
      const detail = await fetchTransactionDetail(connection, sig);
      const result = await analyzeTransaction({
        ...tx,
        detail,
      });
      setAnalyses((prev) => ({ ...prev, [sig]: result }));
      setSelectedAnalysis(result);
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setAnalyzing(null);
    }
  };

  if (!connected) return null;

  return (
    <>
      <div className="glass-card fade-in" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
            <ArrowUpDown size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Recent Transactions
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {transactions.length} transactions
          </span>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 56 }} />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <ArrowUpDown size={32} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No transactions found on devnet</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Try requesting an airdrop first</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {transactions.map((tx) => (
              <div
                key={tx.signature}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius)',
                  background: 'var(--bg-primary)',
                  border: '1px solid transparent',
                  transition: 'border-color var(--transition)',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                {/* Left: Signature + Time */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <a
                      href={getExplorerUrl(tx.signature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate-address"
                      style={{ color: 'var(--accent-light)', textDecoration: 'none', fontSize: '0.85rem' }}
                    >
                      {formatAddress(tx.signature, 8)}
                    </a>
                    <ExternalLink size={12} color="var(--text-muted)" />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatTimestamp(tx.blockTime)}
                  </span>
                </div>

                {/* Center: Status + Risk */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge ${tx.err ? 'badge-danger' : 'badge-safe'}`}>
                    {tx.err ? 'Failed' : 'Success'}
                  </span>
                  {analyses[tx.signature] && (
                    <RiskBadge level={analyses[tx.signature].riskLevel} />
                  )}
                </div>

                {/* Right: Analyze button */}
                <button
                  className="btn-ghost"
                  onClick={() => handleAnalyze(tx)}
                  disabled={analyzing === tx.signature}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    opacity: analyzing === tx.signature ? 0.6 : 1,
                  }}
                >
                  {analyzing === tx.signature ? (
                    <>
                      <Loader2 size={14} className="spinning" style={{ animation: 'spin 1s linear infinite' }} />
                      Analyzing...
                    </>
                  ) : analyses[tx.signature] ? (
                    <>
                      <Search size={14} />
                      View
                    </>
                  ) : (
                    <>
                      <Search size={14} />
                      Analyze
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analysis Panel Overlay */}
      {selectedAnalysis && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 99,
            }}
            onClick={() => setSelectedAnalysis(null)}
          />
          <AnalysisPanel
            analysis={selectedAnalysis}
            onClose={() => setSelectedAnalysis(null)}
          />
        </>
      )}

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
