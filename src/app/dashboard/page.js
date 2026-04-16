'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import WalletOverview from '../components/WalletOverview';
import SecurityScore from '../components/SecurityScore';
import TransactionList from '../components/TransactionList';
import SimulatorPanel from '../components/SimulatorPanel';
import { fetchTransactions, fetchBalance, fetchTokenAccounts } from '@/lib/solana';
import { generateSecurityScore } from '@/lib/claude';
import { RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();

  const [scoreData, setScoreData] = useState({ score: null, grade: null, summary: null, risks: [] });
  const [scoreLoading, setScoreLoading] = useState(true);
  const [scoring, setScoring] = useState(false);

  useEffect(() => {
    if (!connected) {
      router.push('/');
    }
  }, [connected, router]);

  // Generate security score on mount
  useEffect(() => {
    if (!connected || !publicKey) return;
    fetchSecurityScore();
  }, [connected, publicKey]);

  const fetchSecurityScore = async () => {
    setScoreLoading(true);
    setScoring(true);
    try {
      const [transactions, balance, tokens] = await Promise.all([
        fetchTransactions(connection, publicKey, 15),
        fetchBalance(connection, publicKey),
        fetchTokenAccounts(connection, publicKey),
      ]);

      const result = await generateSecurityScore({
        address: publicKey.toString(),
        balance,
        tokenCount: tokens.length,
        transactionCount: transactions.length,
        transactions: transactions.map((tx) => ({
          signature: tx.signature,
          blockTime: tx.blockTime,
          err: tx.err,
          confirmationStatus: tx.confirmationStatus,
        })),
      });

      setScoreData(result);
    } catch (err) {
      console.error('Failed to generate security score:', err);
      setScoreData({
        score: null,
        grade: null,
        summary: 'Unable to generate score. Make sure your API key is configured.',
        risks: [],
      });
    } finally {
      setScoreLoading(false);
      setScoring(false);
    }
  };

  if (!connected) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Dashboard</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Real-time wallet security analysis
            </p>
          </div>
          <button
            className="btn-ghost"
            onClick={fetchSecurityScore}
            disabled={scoring}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} style={scoring ? { animation: 'spin 1s linear infinite' } : {}} />
            Rescan
          </button>
        </div>

        {/* Protector Simulator */}
        <SimulatorPanel />

        {/* Top Row: Wallet Overview + SecurityScore */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(240px, 1fr)',
          gap: '16px',
          marginBottom: '16px',
        }}>
          <WalletOverview />
          <SecurityScore
            score={scoreData.score}
            grade={scoreData.grade}
            summary={scoreData.summary}
            loading={scoreLoading}
          />
        </div>

        {/* AI Risk Insights */}
        {scoreData.risks && scoreData.risks.length > 0 && (
          <div className="glass-card fade-in" style={{ padding: '20px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              AI Risk Insights
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {scoreData.risks.map((risk, i) => (
                <div key={i} style={{
                  padding: '12px',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius)',
                  borderLeft: `3px solid ${risk.severity === 'high' ? 'var(--danger)' : risk.severity === 'medium' ? 'var(--warning)' : 'var(--info)'}`,
                }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                    {risk.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {risk.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Positives */}
        {scoreData.positives && scoreData.positives.length > 0 && (
          <div className="glass-card fade-in" style={{ padding: '20px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--safe)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
              ✓ Positive Findings
            </h2>
            <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {scoreData.positives.map((p, i) => (
                <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Transaction List */}
        <TransactionList />
      </main>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 700px) {
          main > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
