'use client';

import { Zap } from 'lucide-react';

export default function UpgradePrompt({ onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '16px',
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--accent)',
        padding: '28px', maxWidth: '400px', width: '100%',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 12px',
          }}>
            <Zap size={22} color="var(--accent)" />
          </div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px' }}>
            Free Limit Reached
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            You've used all 10 free AI analyses. Upgrade to Pro for unlimited access.
          </p>
        </div>

        <div style={{
          background: 'var(--bg-primary)', borderRadius: 'var(--radius)',
          padding: '16px', marginBottom: '20px',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '12px',
          }}>
            <span style={{ fontSize: '14px', fontWeight: 700 }}>Pro Plan</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent)' }}>
              $9<span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/month</span>
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'Unlimited AI analyses',
              'Mainnet support',
              'Real-time wallet alerts',
              'Priority support',
              'API access for developers',
            ].map((feature, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center',
                gap: '8px', fontSize: '13px', color: 'var(--text-secondary)',
              }}>
                <span style={{
                  width: '16px', height: '16px', borderRadius: '50%',
                  background: 'var(--safe)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="8" height="8" viewBox="0 0 8 8">
                    <polyline points="1,4 3,6 7,2" stroke="white"
                      strokeWidth="1.5" fill="none"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => alert('Pro launch coming soon! Follow @solguard for updates.')}
            style={{
              width: '100%', padding: '12px',
              borderRadius: 'var(--radius)', border: 'none',
              background: 'var(--accent)', color: 'white',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Upgrade to Pro — $9/month
          </button>
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '10px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-muted)',
              fontSize: '13px', cursor: 'pointer',
            }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
