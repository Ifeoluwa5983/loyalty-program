const BADGE_CONFIG = {
  None:     { label: 'None',     color: '#616161', bg: '#f7f7f7', dot: '#b5b5b5' },
  Beginner: { label: 'Beginner', color: '#047b5d', bg: '#e3f1ed', dot: '#047b5d' },
  Bronze:   { label: 'Bronze',   color: '#7a4510', bg: '#fdf0e1', dot: '#c07530' },
  Silver:   { label: 'Silver',   color: '#4a5568', bg: '#f0f2f5', dot: '#718096' },
  Gold:     { label: 'Gold',     color: '#7a5c00', bg: '#fdf6d8', dot: '#c49c00' },
}

export default function BadgeCard({ currentBadge, nextBadge, remaining }) {
  const config = BADGE_CONFIG[currentBadge] ?? BADGE_CONFIG['None']
  const isMaxBadge = !nextBadge

  return (
    <div style={{
      background: 'var(--p-surface)',
      border: '1px solid var(--p-border)',
      borderRadius: 'var(--r)',
      overflow: 'hidden',
    }}>
      {/* Card header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--p-border)',
      }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--p-text)' }}>Current badge</p>
      </div>

      {/* Card body */}
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Badge pill */}
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: config.bg,
            color: config.color,
            border: `1px solid ${config.dot}30`,
            borderRadius: 'var(--r-full)',
            padding: '4px 12px',
            fontSize: 13,
            fontWeight: 600,
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: config.dot,
              flexShrink: 0,
            }} />
            {config.label}
          </span>
        </div>

        <div style={{ marginTop: 16 }}>
          {isMaxBadge ? (
            <p style={{ fontSize: 13, color: 'var(--p-success)', fontWeight: 500 }}>
              Maximum tier reached
            </p>
          ) : (
            <>
              <p style={{ fontSize: 13, color: 'var(--p-text-secondary)' }}>
                Next tier: <span style={{ color: 'var(--p-text)', fontWeight: 550 }}>{nextBadge}</span>
              </p>
              <p style={{ fontSize: 12, color: 'var(--p-text-secondary)', marginTop: 4 }}>
                {remaining} more achievement{remaining !== 1 ? 's' : ''} required
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
