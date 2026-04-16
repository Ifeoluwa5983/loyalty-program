import { useState, useEffect, useCallback } from 'react'
import { fetchUserAchievements, fetchUsers, recordPurchase } from '../api/achievements'
import BadgeCard from '../components/BadgeCard'
import ProgressBar from '../components/ProgressBar'
import AchievementGrid from '../components/AchievementGrid'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Dashboard() {
  const [users, setUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  // Load users on mount
  useEffect(() => {
    fetchUsers()
      .then((list) => {
        setUsers(list)
        if (list.length > 0) setSelectedUserId(list[0].id)
      })
      .catch(() => setError('Could not load users. Is the backend running?'))
  }, [])

  const loadAchievements = useCallback(async (userId) => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const result = await fetchUserAchievements(userId)
      setData(result)
    } catch {
      setError('Failed to load achievements. Check your API connection.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAchievements(selectedUserId)
  }, [selectedUserId, loadAchievements])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handlePurchase = async () => {
    if (!selectedUserId || purchasing) return
    setPurchasing(true)
    try {
      const result = await recordPurchase(selectedUserId, 1000, 'Test purchase')
      showToast(`Purchase #${result.total_purchases} recorded!`)
      await loadAchievements(selectedUserId)
    } catch {
      showToast('Failed to record purchase.', 'error')
    } finally {
      setPurchasing(false)
    }
  }

  const selectedUser = users.find((u) => u.id === selectedUserId)
  const totalUnlocked = data?.unlocked_achievements?.length ?? 0

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            background: toast.type === 'error' ? '#dc2626' : '#10b981',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            animation: 'fadeInRight 0.3s ease',
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header
        style={{
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: '0 auto',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>🏆</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text)' }}>
              Loyalty Program
            </span>
          </div>

          {/* User selector */}
          {users.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <label
                htmlFor="user-select"
                style={{ fontSize: 13, color: 'var(--color-text-muted)' }}
              >
                Viewing:
              </label>
              <select
                id="user-select"
                value={selectedUserId ?? ''}
                onChange={(e) => setSelectedUserId(Number(e.target.value))}
                style={{
                  background: 'var(--color-surface-2)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  padding: '6px 10px',
                  fontSize: 14,
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
        {error && (
          <div
            style={{
              background: '#dc262622',
              border: '1px solid #dc2626',
              borderRadius: 10,
              padding: '14px 18px',
              color: '#fca5a5',
              marginBottom: 24,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        {loading && <LoadingSpinner message="Loading achievements..." />}

        {!loading && data && (
          <>
            {/* Greeting */}
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2 }}>
                Welcome back, {selectedUser?.name?.split(' ')[0] ?? 'Shopper'}!
              </h1>
              <p style={{ color: 'var(--color-text-muted)', marginTop: 4, fontSize: 14 }}>
                You have {totalUnlocked} achievement{totalUnlocked !== 1 ? 's' : ''} unlocked.
              </p>
            </div>

            {/* Top row: Badge + Progress */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 16,
                marginBottom: 16,
              }}
            >
              <BadgeCard
                currentBadge={data.current_badge}
                nextBadge={data.next_badge}
                remaining={data.remaining_to_unlock_next_badge}
              />
              <ProgressBar
                currentBadge={data.current_badge}
                nextBadge={data.next_badge}
                totalAchievements={totalUnlocked}
                remaining={data.remaining_to_unlock_next_badge}
              />
            </div>

            {/* Achievements grid */}
            <AchievementGrid
              unlocked={data.unlocked_achievements}
              nextAvailable={data.next_available_achievements}
            />

            {/* Demo: Simulate purchase button */}
            <div
              style={{
                marginTop: 24,
                padding: '20px 24px',
                background: 'var(--color-surface)',
                border: '1px dashed var(--color-border)',
                borderRadius: 'var(--radius)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div>
                <p style={{ fontSize: 14, fontWeight: 600 }}>Demo Mode</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  Simulate a purchase to watch achievements unlock in real time.
                </p>
              </div>
              <button
                onClick={handlePurchase}
                disabled={purchasing}
                style={{
                  background: purchasing ? 'var(--color-border)' : 'var(--color-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 22px',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: purchasing ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {purchasing ? 'Processing...' : '+ Simulate Purchase'}
              </button>
            </div>
          </>
        )}

        {!loading && !data && !error && (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 60 }}>
            Select a user to view their loyalty status.
          </p>
        )}
      </main>

      <style>{`
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
