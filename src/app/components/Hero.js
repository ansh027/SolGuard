'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Shield, Scan, Brain, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import FeatureCard from './FeatureCard';
import Link from 'next/link';

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: <Scan size={24} color="var(--accent)" />,
      title: 'Transaction Scanner',
      description: 'Analyze every transaction in your wallet for suspicious patterns and hidden risks.',
    },
    {
      icon: <Brain size={24} color="var(--safe)" />,
      title: 'AI-Powered Analysis',
      description: 'Claude AI evaluates smart contract interactions, token approvals, and program safety.',
    },
    {
      icon: <Shield size={24} color="var(--warning)" />,
      title: 'Security Score',
      description: 'Get an overall wallet health score with detailed risk breakdowns and recommendations.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px 80px' }}>
      {/* Hero Content */}
      <div className="fade-in" style={{ textAlign: 'center', maxWidth: '640px', marginBottom: '48px' }}>
        {/* Logo */}
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 'var(--radius-xl)',
          background: 'var(--accent-glow)',
          border: '1px solid var(--border-highlight)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <Shield size={36} color="var(--accent)" />
        </div>

        {/* Tagline */}
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          marginBottom: '16px',
          color: 'var(--text-primary)',
        }}>
          Protect Your Solana{' '}
          <span style={{ color: 'var(--accent)' }}>Wallet</span>{' '}
          with AI
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: '32px',
          maxWidth: '480px',
          margin: '0 auto 32px',
        }}>
          SolGuard uses Claude AI to analyze your transactions, detect threats, and keep your assets safe on Solana.
        </p>

        {/* CTA */}
        {mounted && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <WalletMultiButton />
            <Link href="/demo" className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
              Try Demo →
            </Link>
          </div>
        )}

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px' }}>
          Devnet · Free · No signup required
        </p>
      </div>

      {/* Feature Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        width: '100%',
        maxWidth: '860px',
      }}>
        {features.map((feature, i) => (
          <FeatureCard key={i} {...feature} />
        ))}
      </div>
    </div>
  );
}
