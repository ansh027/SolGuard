'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import SecurityScore from '../components/SecurityScore';
import RiskBadge from '../components/RiskBadge';
import AnalysisPanel from '../components/AnalysisPanel';
import {
  DEMO_WALLET,
  DEMO_SCORE,
  DEMO_TRANSACTIONS,
  DEMO_ANALYSIS,
  DEMO_ANALYSIS_SAFE,
  DEMO_ANALYSIS_DANGER,
} from '@/lib/mockData';
import { formatAddress, formatTimestamp, getExplorerUrl } from '@/lib/solana';
import { Wallet, Coins, CircleDot, ExternalLink, Search, Zap, ArrowUpDown } from 'lucide-react';

const ANALYSES_MAP = {
  0: DEMO_ANALYSIS_SAFE,
  1: DEMO_ANALYSIS_SAFE,
  2: DEMO_ANALYSIS,
  3: DEMO_ANALYSIS_DANGER,
  4: DEMO_ANALYSIS,
  5: DEMO_ANALYSIS_SAFE,
};

export default function DemoPage() {
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [analyzedTxs, setAnalyzedTxs] = useState({});

  const handleAnalyze = (tx, index) => {
    const analysis = ANALYSES_MAP[index] || DEMO_ANALYSIS_SAFE;
    setAnalyzedTxs((prev) => ({ ...prev, [tx.signature]: analysis }));
    setSelectedAnalysis(analysis);
  };

  return (
    <>
      {/* Demo banner */}
      <div style={{
        background: 'linear-gradient(90deg, var(--accent), #7c3aed)',
        color: 'white',
        textAlign: 'center',
        padding: '8px 16px',
        fontSize: '0.8rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
      }}>
        <Zap size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
        DEMO MODE — Viewing simulated data to showcase SolGuard&apos;s capabilities
      </div>

      <Navbar />

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Real-time wallet security analysis
          </p>
        </div>

        {/* Top Row: Wallet Overview + Security Score */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(240px, 1fr)',
          gap: '16px',
          marginBottom: '16px',
        }}>
          {/* Wallet Overview */}
          <div className="glass-card fade-in" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Wallet Overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wallet size={20} color="var(--accent)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Address</div>
                  <span className="truncate-address" style={{ color: 'var(--text-primary)' }}>
                    {formatAddress(DEMO_WALLET.address, 6)}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'var(--safe-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Coins size={20} color="var(--safe)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SOL Balance</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {DEMO_WALLET.balance} SOL
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'var(--info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircleDot size={20} color="var(--info)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tokens Held</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {DEMO_WALLET.tokenCount}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Score */}
          <SecurityScore
            score={DEMO_SCORE.score}
            grade={DEMO_SCORE.grade}
            summary={DEMO_SCORE.summary}
            loading={false}
          />
        </div>

        {/* AI Risk Insights */}
        <div className="glass-card fade-in" style={{ padding: '20px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            AI Risk Insights
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {DEMO_SCORE.risks.map((risk, i) => (
              <div key={i} style={{
                padding: '12px',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius)',
                borderLeft: `3px solid ${risk.severity === 'high' ? 'var(--danger)' : risk.severity === 'medium' ? 'var(--warning)' : 'var(--info)'}`,
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>{risk.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{risk.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Positives */}
        <div className="glass-card fade-in" style={{ padding: '20px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--safe)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            ✓ Positive Findings
          </h2>
          <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {DEMO_SCORE.positives.map((p, i) => (
              <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p}</li>
            ))}
          </ul>
        </div>

        {/* Transaction List */}
        <div className="glass-card fade-in" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              <ArrowUpDown size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Recent Transactions
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {DEMO_TRANSACTIONS.length} transactions
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {DEMO_TRANSACTIONS.map((tx, i) => (
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="truncate-address" style={{ color: 'var(--accent-light)', fontSize: '0.85rem' }}>
                      {formatAddress(tx.signature, 8)}
                    </span>
                    <ExternalLink size={12} color="var(--text-muted)" />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatTimestamp(tx.blockTime)}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge ${tx.err ? 'badge-danger' : 'badge-safe'}`}>
                    {tx.err ? 'Failed' : 'Success'}
                  </span>
                  {analyzedTxs[tx.signature] && (
                    <RiskBadge level={analyzedTxs[tx.signature].riskLevel} />
                  )}
                </div>

                <button
                  className="btn-ghost"
                  onClick={() => handleAnalyze(tx, i)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                >
                  <Search size={14} />
                  {analyzedTxs[tx.signature] ? 'View' : 'Analyze'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

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
        @media (max-width: 700px) {
          main > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
