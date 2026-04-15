const BADGE_CONFIG = {
  None: { icon: '🎯', color: '#6b7280', glow: '#6b728033' },
  Beginner: { icon: '🌱', color: '#10b981', glow: '#10b98133' },
  Bronze: { icon: '🥉', color: '#b45309', glow: '#b4530933' },
  Silver: { icon: '🥈', color: '#94a3b8', glow: '#94a3b833' },
  Gold: { icon: '🥇', color: '#f59e0b', glow: '#f59e0b33' },
}

export default function BadgeCard({ currentBadge, nextBadge, remaining }) {
  const config = BADGE_CONFIG[currentBadge] ?? BADGE_CONFIG['None']
  const isMaxBadge = !nextBadge

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: `2px solid ${config.color}40`,
        borderRadius: 'var(--radius)',
        padding: '28px',
        boxShadow: `0 0 40px ${config.glow}, var(--shadow)`,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <p
        style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
        }}
      >
        Current Badge
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: `${config.color}22`,
            border: `3px solid ${config.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            flexShrink: 0,
          }}
        >
          {config.icon}
        </div>

        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: config.color }}>
            {currentBadge}
          </h2>
          {isMaxBadge ? (
            <p style={{ fontSize: '13px', color: 'var(--color-success)', fontWeight: 600 }}>
              ✨ Maximum level reached!
            </p>
          ) : (
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              Next: <strong style={{ color: 'var(--color-text)' }}>{nextBadge}</strong>
              {' — '}
              <span style={{ color: 'var(--color-primary-light)' }}>
                {remaining} achievement{remaining !== 1 ? 's' : ''} away
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
