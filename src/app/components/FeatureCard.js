'use client';

export default function FeatureCard({ icon, title, description }) {
  return (
    <div
      className="glass-card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'border-color var(--transition), transform var(--transition)',
        cursor: 'default',
      }}
    >
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 'var(--radius)',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
        {description}
      </p>
    </div>
  );
}
