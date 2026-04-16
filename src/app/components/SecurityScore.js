'use client';

import { useEffect, useState } from 'react';

export default function SecurityScore({ score, grade, summary, loading }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    if (loading || score == null) return;
    // Animate from 0 to score
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score, loading]);

  const getColor = (s) => {
    if (s >= 80) return 'var(--safe)';
    if (s >= 60) return 'var(--warning)';
    if (s >= 40) return '#f97316';
    return 'var(--danger)';
  };

  const color = getColor(animatedScore);

  return (
    <div className="glass-card fade-in" style={{ padding: '24px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px' }}>
        Security Score
      </h2>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div className="skeleton" style={{ width: 140, height: 140, borderRadius: '50%' }} />
          <div className="skeleton" style={{ width: 120, height: 16 }} />
        </div>
      ) : (
        <>
          <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto' }}>
            <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background ring */}
              <circle
                cx="70" cy="70" r={radius}
                fill="none"
                stroke="var(--bg-card-hover)"
                strokeWidth="10"
              />
              {/* Score ring */}
              <circle
                className="score-ring"
                cx="70" cy="70" r={radius}
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: color }}>
                {animatedScore}
              </div>
              {grade && (
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Grade {grade}
                </div>
              )}
            </div>
          </div>

          {summary && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '16px', lineHeight: 1.5 }}>
              {summary}
            </p>
          )}
        </>
      )}
    </div>
  );
}
