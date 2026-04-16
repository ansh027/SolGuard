'use client';

export default function RiskBadge({ level }) {
  const config = {
    safe: { label: 'Safe', className: 'badge-safe' },
    low: { label: 'Low', className: 'badge-warning' },
    medium: { label: 'Medium', className: 'badge-warning' },
    high: { label: 'High', className: 'badge-danger' },
    critical: { label: 'Critical', className: 'badge-critical' },
  };

  const { label, className } = config[level] || config.safe;

  return (
    <span className={`badge ${className}`}>
      {label}
    </span>
  );
}
