const BADGE_THRESHOLDS = {
  Beginner: 0,
  Bronze: 1,
  Silver: 3,
  Gold: 5,
}

export default function ProgressBar({ currentBadge, nextBadge, totalAchievements, remaining }) {
  const currentThreshold = BADGE_THRESHOLDS[currentBadge] ?? 0
  const nextThreshold = nextBadge ? BADGE_THRESHOLDS[nextBadge] : currentThreshold
  const isMaxBadge = !nextBadge

  const range = nextThreshold - currentThreshold
  const earned = totalAchievements - currentThreshold
  const percent = isMaxBadge ? 100 : range > 0 ? Math.min((earned / range) * 100, 100) : 100

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
          marginBottom: '12px',
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
          Badge Progress
        </p>
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--color-primary-light)',
          }}
        >
          {totalAchievements} / {isMaxBadge ? totalAchievements : nextThreshold} achievements
        </span>
      </div>

      {/* Track */}
      <div
        style={{
          height: 10,
          background: 'var(--color-border)',
          borderRadius: 99,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            background: isMaxBadge
              ? 'linear-gradient(90deg, #f59e0b, #fcd34d)'
              : 'linear-gradient(90deg, #7c3aed, #a78bfa)',
            borderRadius: 99,
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>

      <div
        style={{
          marginTop: 10,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--color-text-muted)',
        }}
      >
        <span>{currentBadge}</span>
        <span>
          {isMaxBadge ? (
            <span style={{ color: '#f59e0b', fontWeight: 600 }}>All badges unlocked!</span>
          ) : (
            nextBadge
          )}
        </span>
      </div>
    </div>
  )
}
