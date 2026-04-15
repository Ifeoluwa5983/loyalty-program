const ACHIEVEMENT_ICONS = {
  'First Purchase': '🛍️',
  '5 Purchases': '⭐',
  '10 Purchases': '🔥',
  '25 Purchases': '💎',
  '50 Purchases': '👑',
}

function AchievementChip({ name, unlocked }) {
  const icon = ACHIEVEMENT_ICONS[name] ?? '🏅'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 18px',
        background: unlocked ? 'var(--color-surface-2)' : 'var(--color-surface)',
        border: unlocked
          ? '1.5px solid var(--color-primary)'
          : '1.5px solid var(--color-border)',
        borderRadius: 10,
        opacity: unlocked ? 1 : 0.55,
        transition: 'all 0.2s ease',
        cursor: 'default',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: unlocked ? '#7c3aed22' : '#374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          flexShrink: 0,
          filter: unlocked ? 'none' : 'grayscale(1)',
        }}
      >
        {icon}
      </div>

      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: unlocked ? 'var(--color-text)' : 'var(--color-text-muted)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontSize: '11px',
            color: unlocked ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
            fontWeight: 500,
          }}
        >
          {unlocked ? '✓ Unlocked' : '🔒 Locked'}
        </p>
      </div>
    </div>
  )
}

export default function AchievementGrid({ unlocked, nextAvailable }) {
  const allAchievements = [
    ...unlocked.map((name) => ({ name, unlocked: true })),
    ...nextAvailable.map((name) => ({ name, unlocked: false })),
  ]

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        padding: '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
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
          Achievements
        </p>
        <span
          style={{
            background: '#7c3aed22',
            color: 'var(--color-primary-light)',
            fontSize: '12px',
            fontWeight: 700,
            padding: '2px 10px',
            borderRadius: 99,
            border: '1px solid var(--color-primary)',
          }}
        >
          {unlocked.length} / {allAchievements.length}
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '10px',
        }}
      >
        {allAchievements.map(({ name, unlocked: isUnlocked }) => (
          <AchievementChip key={name} name={name} unlocked={isUnlocked} />
        ))}
      </div>

      {allAchievements.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', textAlign: 'center' }}>
          No achievements yet. Start shopping!
        </p>
      )}
    </div>
  )
}
