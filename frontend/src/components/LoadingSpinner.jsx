export default function LoadingSpinner() {
  return (
    <div style={{
      background: 'var(--p-surface)',
      border: '1px solid var(--p-border)',
      borderRadius: 'var(--r)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      padding: '48px 24px',
      color: 'var(--p-text-secondary)',
      fontSize: 13,
    }}>
      <div style={{
        width: 16,
        height: 16,
        borderRadius: '50%',
        border: '2px solid var(--p-border)',
        borderTopColor: 'var(--p-success)',
        animation: 'spin 0.6s linear infinite',
        flexShrink: 0,
      }} />
      Loading customer data…
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
