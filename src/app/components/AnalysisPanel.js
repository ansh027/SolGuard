'use client';

import { useState } from 'react';
import RiskBadge from './RiskBadge';
import { X, AlertTriangle, Shield, ArrowRight } from 'lucide-react';

export default function AnalysisPanel({ analysis, onClose }) {
  if (!analysis) return null;

  const { riskLevel, score, summary, details, flags, recommendation } = analysis;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      maxWidth: '440px',
      background: 'var(--bg-secondary)',
      borderLeft: '1px solid var(--border-color)',
      zIndex: 100,
      overflowY: 'auto',
      padding: '24px',
    }}
    className="fade-in"
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={20} color="var(--accent)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>AI Analysis</h3>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}
        >
          <X size={20} color="var(--text-muted)" />
        </button>
      </div>

      {/* Risk Level + Score */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '16px', textAlign: 'center' }}>
        <div style={{ marginBottom: '8px' }}>
          <RiskBadge level={riskLevel} />
        </div>
        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: score >= 70 ? 'var(--safe)' : score >= 40 ? 'var(--warning)' : 'var(--danger)' }}>
          {score}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Safety Score</div>
      </div>

      {/* Summary */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '16px' }}>
        <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          Summary
        </h4>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
          {summary}
        </p>
      </div>

      {/* Details */}
      {details && (
        <div className="glass-card" style={{ padding: '16px', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Details
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {details}
          </p>
        </div>
      )}

      {/* Flags */}
      {flags && flags.length > 0 && (
        <div className="glass-card" style={{ padding: '16px', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            <AlertTriangle size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Risk Flags
          </h4>
          <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {flags.map((flag, i) => (
              <li key={i} style={{ fontSize: '0.85rem', color: 'var(--warning)' }}>{flag}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendation */}
      {recommendation && (
        <div style={{
          padding: '16px',
          background: 'var(--accent-glow)',
          border: '1px solid var(--border-highlight)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <h4 style={{ fontSize: '0.75rem', color: 'var(--accent-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            <ArrowRight size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Recommendation
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
            {recommendation}
          </p>
        </div>
      )}
    </div>
  );
}
