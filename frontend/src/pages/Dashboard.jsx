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
    setTimeout(() => setToast(null), 3000)
  }

  const handlePurchase = async () => {
    if (!selectedUserId || purchasing) return
    setPurchasing(true)
    try {
      const result = await recordPurchase(selectedUserId, 1000, 'Test purchase')
      showToast(`Purchase #${result.total_purchases} recorded`)
      await loadAchievements(selectedUserId)
    } catch {
      showToast('Failed to record purchase.', 'error')
    } finally {
      setPurchasing(false)
    }
  }

  const selectedUser = (Array.isArray(users) ? users : []).find((u) => u.id === selectedUserId)
  const totalUnlocked = data?.unlocked_achievements?.length ?? 0

  return (
    <div style={{ minHeight: '100vh', background: 'var(--p-bg)' }}>

      {/* Polaris-style toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: toast.type === 'error' ? '#d72c0d' : 'var(--p-action)',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: 'var(--r)',
          fontSize: 13,
          fontWeight: 450,
          boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
          whiteSpace: 'nowrap',
          animation: 'toastIn 0.2s ease',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Top bar */}
      <div style={{
        background: 'var(--p-surface)',
        borderBottom: '1px solid var(--p-border)',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
      }}>
        <div style={{
          maxWidth: 860,
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30,
              height: 30,
              background: 'var(--p-action)',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
            }}>
              🏅
            </div>
            <span style={{ color: 'var(--p-text)', fontWeight: 600, fontSize: 14 }}>Loyalty Program</span>
          </div>

          {users.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label htmlFor="user-select" style={{ color: 'var(--p-text-secondary)', fontSize: 13 }}>
                Customer:
              </label>
              <select
                id="user-select"
                value={selectedUserId ?? ''}
                onChange={(e) => setSelectedUserId(Number(e.target.value))}
                style={{
                  background: 'var(--p-surface)',
                  color: 'var(--p-text)',
                  border: '1px solid var(--p-border)',
                  borderRadius: 'var(--r-sm)',
                  padding: '5px 10px',
                  fontSize: 13,
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Page */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 16px 48px' }}>

        {/* Page header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--p-text)' }}>
              {selectedUser ? selectedUser.name : 'Customer Dashboard'}
            </h1>
            {data && (
              <p style={{ color: 'var(--p-text-secondary)', fontSize: 13, marginTop: 3 }}>
                {totalUnlocked} achievement{totalUnlocked !== 1 ? 's' : ''} unlocked
              </p>
            )}
          </div>

          {data && (
            <button
              onClick={handlePurchase}
              disabled={purchasing}
              style={{
                background: purchasing ? 'var(--p-surface-secondary)' : 'var(--p-action)',
                color: purchasing ? 'var(--p-text-disabled)' : '#fff',
                border: '1px solid',
                borderColor: purchasing ? 'var(--p-border)' : '#035e47',
                borderRadius: 6,
                padding: '7px 16px',
                fontSize: 13,
                fontWeight: 550,
                cursor: purchasing ? 'not-allowed' : 'pointer',
                height: 36,
                whiteSpace: 'nowrap',
                transition: 'background 0.1s',
              }}
            >
              {purchasing ? 'Processing…' : 'Simulate Purchase'}
            </button>
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            background: '#fff4f4',
            border: '1px solid #ffd2d2',
            borderLeft: '3px solid #d72c0d',
            borderRadius: 'var(--r)',
            padding: '12px 16px',
            color: '#d72c0d',
            marginBottom: 16,
            fontSize: 13,
          }}>
            {error}
          </div>
        )}

        {loading && <LoadingSpinner />}

        {!loading && data && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <BadgeCard
                currentBadge={data.current_badge}
                nextBadge={data.next_badge}
                remaining={data.remaining_to_unlock_next_badge}
              />
              <ProgressBar
                currentBadge={data.current_badge}
                nextBadge={data.next_badge}
                totalAchievements={totalUnlocked}
              />
            </div>

            <AchievementGrid
              unlocked={data.unlocked_achievements}
              nextAvailable={data.next_available_achievements}
            />
          </div>
        )}

        {!loading && !data && !error && (
          <div style={{
            background: 'var(--p-surface)',
            border: '1px solid var(--p-border)',
            borderRadius: 'var(--r)',
            padding: '48px 24px',
            textAlign: 'center',
          }}>
            <p style={{ color: 'var(--p-text-secondary)', fontSize: 14 }}>
              Select a customer to view their loyalty status.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
