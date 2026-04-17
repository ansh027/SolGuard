'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { getTokenApprovals, revokeTokenApproval } from '@/lib/solana';
import { ShieldAlert, ShieldCheck, RefreshCw, XCircle } from 'lucide-react';

export default function TokenApprovalManager() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(null);

  useEffect(() => {
    if (!connected || !publicKey) return;
    loadApprovals();
  }, [connected, publicKey]);

  const loadApprovals = async () => {
    setLoading(true);
    try {
      const data = await getTokenApprovals(connection, publicKey);
      setApprovals(data);
    } catch (err) {
      console.error('Failed to load approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (approval) => {
    setRevoking(approval.mint);
    try {
      await revokeTokenApproval(connection, publicKey, approval, sendTransaction);
      setApprovals((prev) => prev.filter((a) => a.mint !== approval.mint));
    } catch (err) {
      console.error('Revoke failed:', err);
    } finally {
      setRevoking(null);
    }
  };

  return (
    <div className="glass-card fade-in" style={{ padding: '20px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={16} color="var(--warning)" />
          <h2 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
            Token Approval Manager
          </h2>
        </div>
        <button className="btn-ghost" onClick={loadApprovals} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <RefreshCw size={12} style={loading ? { animation: 'spin 1s linear infinite' } : {}} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
          <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
          <div>Scanning token approvals...</div>
        </div>
      ) : approvals.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius)', border: '1px solid var(--safe)' }}>
          <ShieldCheck size={18} color="var(--safe)" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--safe)' }}>No active approvals found</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Your wallet has no risky token approvals</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '12px', color: 'var(--warning)', marginBottom: '4px' }}>
            {approvals.length} active approval{approvals.length > 1 ? 's' : ''} found — review and revoke any you don't recognize
          </div>
          {approvals.map((approval) => (
            <div key={approval.mint} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius)',
              borderLeft: '3px solid var(--warning)', gap: '12px', flexWrap: 'wrap'
            }}>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '2px' }}>
                  {approval.mint.slice(0, 8)}...{approval.mint.slice(-6)}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Delegate: {approval.delegate.slice(0, 8)}...{approval.delegate.slice(-6)}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Amount: {approval.amount}
                </div>
              </div>
              <button
                onClick={() => handleRevoke(approval)}
                disabled={revoking === approval.mint}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: 'var(--radius)',
                  background: 'transparent', border: '1px solid var(--danger)',
                  color: 'var(--danger)', fontSize: '12px', cursor: 'pointer'
                }}
              >
                {revoking === approval.mint
                  ? <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />
                  : <XCircle size={12} />}
                {revoking === approval.mint ? 'Revoking...' : 'Revoke'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
