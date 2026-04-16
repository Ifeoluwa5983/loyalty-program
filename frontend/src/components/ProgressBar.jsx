const BADGE_THRESHOLDS = { Beginner: 0, Bronze: 1, Silver: 3, Gold: 5 }

const STEPS = ['Beginner', 'Bronze', 'Silver', 'Gold']

export default function ProgressBar({ currentBadge, nextBadge, totalAchievements }) {
  const currentThreshold = BADGE_THRESHOLDS[currentBadge] ?? 0
  const nextThreshold    = nextBadge ? BADGE_THRESHOLDS[nextBadge] : currentThreshold
  const isMaxBadge       = !nextBadge

  const range   = nextThreshold - currentThreshold
  const earned  = totalAchievements - currentThreshold
  const percent = isMaxBadge ? 100 : range > 0 ? Math.min((earned / range) * 100, 100) : 100

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
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--p-text)' }}>Badge progress</p>
      </div>

      {/* Card body */}
      <div style={{ padding: '16px' }}>
        {/* Step indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}>
          {STEPS.map((step) => {
            const threshold = BADGE_THRESHOLDS[step]
            const done = totalAchievements >= threshold
            const isCurrent = step === currentBadge
            return (
              <span key={step} style={{
                fontSize: 11,
                fontWeight: isCurrent ? 600 : 400,
                color: done ? 'var(--p-success)' : 'var(--p-text-disabled)',
              }}>
                {step}
              </span>
            )
          })}
        </div>

        {/* Track */}
        <div style={{
          height: 6,
          background: 'var(--p-surface-secondary)',
          border: '1px solid var(--p-border)',
          borderRadius: 'var(--r-full)',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${percent}%`,
            background: isMaxBadge ? '#c49c00' : 'var(--p-success)',
            borderRadius: 'var(--r-full)',
            transition: 'width 0.5s ease',
          }} />
        </div>

        {/* Label */}
        <p style={{ fontSize: 12, color: 'var(--p-text-secondary)', marginTop: 8 }}>
          {isMaxBadge
            ? 'All tiers unlocked'
            : `${totalAchievements} / ${nextThreshold} achievements`}
        </p>
      </div>
    </div>
  )
}
