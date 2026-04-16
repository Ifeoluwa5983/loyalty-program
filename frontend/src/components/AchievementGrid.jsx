const ACHIEVEMENT_META = {
  'First Purchase': { icon: '🛍️' },
  '5 Purchases':    { icon: '⭐' },
  '10 Purchases':   { icon: '🔥' },
  '25 Purchases':   { icon: '💎' },
  '50 Purchases':   { icon: '👑' },
}

function StatusBadge({ unlocked }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 12,
      fontWeight: 500,
      padding: '3px 10px',
      borderRadius: 'var(--r-full)',
      background: unlocked ? '#e3f1ed' : 'var(--p-surface-secondary)',
      color: unlocked ? 'var(--p-success-text)' : 'var(--p-text-secondary)',
      border: `1px solid ${unlocked ? '#b2ddd0' : 'var(--p-border)'}`,
    }}>
      <span style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: unlocked ? 'var(--p-success)' : 'var(--p-text-disabled)',
        flexShrink: 0,
      }} />
      {unlocked ? 'Unlocked' : 'Locked'}
    </span>
  )
}

export default function AchievementGrid({ unlocked, nextAvailable }) {
  const all = [
    ...unlocked.map((name) => ({ name, unlocked: true })),
    ...nextAvailable.map((name) => ({ name, unlocked: false })),
  ]

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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--p-text)' }}>Achievements</p>
        <span style={{ fontSize: 12, color: 'var(--p-text-secondary)' }}>
          {unlocked.length} of {all.length} unlocked
        </span>
      </div>

      {/* Resource list */}
      {all.length === 0 ? (
        <div style={{ padding: '32px 16px', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--p-text-secondary)' }}>
            No achievements available yet.
          </p>
        </div>
      ) : (
        <ul style={{ listStyle: 'none' }}>
          {all.map(({ name, unlocked: isUnlocked }, i) => {
            const meta = ACHIEVEMENT_META[name] ?? { icon: '🏅' }
            return (
              <li
                key={name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderTop: i === 0 ? 'none' : '1px solid var(--p-border)',
                  background: 'var(--p-surface)',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--r-sm)',
                    background: isUnlocked ? '#e3f1ed' : 'var(--p-surface-secondary)',
                    border: '1px solid var(--p-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    flexShrink: 0,
                    filter: isUnlocked ? 'none' : 'grayscale(1) opacity(0.5)',
                  }}>
                    {meta.icon}
                  </div>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 450,
                    color: isUnlocked ? 'var(--p-text)' : 'var(--p-text-secondary)',
                  }}>
                    {name}
                  </span>
                </div>
                <StatusBadge unlocked={isUnlocked} />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
