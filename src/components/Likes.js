import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Circle from './Circle'
import { getCurrentMockUser, getFriendsForUser } from '../mock/authMock'
import {
  ensureSeededNotifications,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  removeNotification,
} from '../mock/notificationsMock'
import { getMockPosts } from '../mock/postsMock'

const Svg = ({ children }) => (
  <svg
    width='22'
    height='22'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='shrink-0'
  >
    {children}
  </svg>
)

const BellIcon = () => (
  <Svg>
    <path
      d='M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinejoin='round'
    />
    <path
      d='M13.73 21a2 2 0 0 1-3.46 0'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
  </Svg>
)

const TrashIcon = () => (
  <Svg>
    <path
      d='M3 6h18'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path
      d='M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinejoin='round'
    />
    <path
      d='M6 6l1 16h10l1-16'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinejoin='round'
    />
  </Svg>
)

const timeAgoShort = (iso) => {
  const t = new Date(iso).getTime()
  if (!Number.isFinite(t)) return ''
  const s = Math.max(0, Math.floor((Date.now() - t) / 1000))
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  return `${d}d`
}

const Pill = ({ active, label, onClick }) => (
  <button
    type='button'
    onClick={onClick}
    className={`rounded-full px-3 py-2 text-xs font-extrabold transition-colors ${
      active
        ? 'bg-[var(--hx-accent)] text-white'
        : 'bg-[var(--hx-surface)] text-[var(--hx-text)] hover:bg-[var(--hx-surface-2)]'
    }`}
  >
    {label}
  </button>
)

const Likes = () => {
  const navigate = useNavigate()
  const currentUser = useMemo(() => getCurrentMockUser(), [])
  const friends = useMemo(() => getFriendsForUser(currentUser), [currentUser])

  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all') // all | reaction | comment | mention | follow | system
  const [query, setQuery] = useState('')
  const [items, setItems] = useState([])

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    ensureSeededNotifications(friends)
    setItems(listNotifications())
  }, [friends])

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((n) => {
      if (activeFilter !== 'all' && n.kind !== activeFilter) return false
      if (!q) return true
      const hay = `${n.actorName || ''} ${n.text || ''}`.toLowerCase()
      return hay.includes(q)
    })
  }, [activeFilter, items, query])

  const openNotification = (n) => {
    const next = markNotificationRead(n.id)
    setItems(next)

    if (n.postId) {
      const post = getMockPosts().find((p) => p.id === n.postId) || null
      navigate(`/home/post/${n.postId}`, { state: { post } })
    }
  }

  return (
    <section className='h-full w-full bg-[var(--hx-app-bg)]'>
      <header className='sticky top-0 z-30 border-b border-[var(--hx-border)] bg-[var(--hx-surface-glass)] px-2 py-2 supports-[backdrop-filter]:backdrop-blur-md'>
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0'>
            <div className='flex items-center gap-2'>
              <div className='grid h-9 w-9 place-items-center rounded-full border border-[var(--hx-border)] bg-[var(--hx-surface)] text-[var(--hx-text)]'>
                <BellIcon />
              </div>
              <div className='min-w-0'>
                <p className='truncate text-sm font-extrabold text-[var(--hx-text)]'>
                  Notifications
                </p>
                <p className='truncate text-xs text-[var(--hx-text-muted)]'>
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                </p>
              </div>
            </div>
          </div>

          <button
            type='button'
            onClick={() => {
              const next = markAllNotificationsRead()
              setItems(next)
            }}
            className='rounded-full border border-[var(--hx-border)] bg-[var(--hx-surface)] px-3 py-2 text-xs font-extrabold text-[var(--hx-text)] hover:bg-[var(--hx-surface-2)]'
          >
            Mark all read
          </button>
        </div>

        <div className='mt-2 flex items-center gap-2 rounded-full border border-[var(--hx-border)] bg-[var(--hx-surface)] px-3 py-2'>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search notifications...'
            className='w-full bg-transparent text-sm text-[var(--hx-text)] outline-none placeholder:text-[var(--hx-text-muted)]'
          />
        </div>

        <div className='mt-2 flex flex-wrap gap-2'>
          <Pill active={activeFilter === 'all'} label='All' onClick={() => setActiveFilter('all')} />
          <Pill
            active={activeFilter === 'reaction'}
            label='Reactions'
            onClick={() => setActiveFilter('reaction')}
          />
          <Pill
            active={activeFilter === 'comment'}
            label='Comments'
            onClick={() => setActiveFilter('comment')}
          />
          <Pill
            active={activeFilter === 'mention'}
            label='Mentions'
            onClick={() => setActiveFilter('mention')}
          />
          <Pill
            active={activeFilter === 'follow'}
            label='Follows'
            onClick={() => setActiveFilter('follow')}
          />
          <Pill
            active={activeFilter === 'system'}
            label='System'
            onClick={() => setActiveFilter('system')}
          />
        </div>
      </header>

      <div className='p-2'>
        <div className='rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface)]'>
          {isLoading ? (
            <div className='p-3'>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`n-skel-${i + 1}`}
                  className='mb-3 flex items-center gap-3 rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface-2)] p-3 last:mb-0'
                >
                  <div className='h-12 w-12 animate-pulse rounded-full bg-[#f1f1f1]' />
                  <div className='flex-1'>
                    <div className='mb-2 h-4 w-3/4 animate-pulse rounded bg-[#f1f1f1]' />
                    <div className='h-3 w-1/2 animate-pulse rounded bg-[#f1f1f1]' />
                  </div>
                  <div className='h-12 w-12 animate-pulse rounded-xl bg-[#f1f1f1]' />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className='p-4 text-center'>
              <p className='text-sm font-extrabold text-[var(--hx-text)]'>Nothing here</p>
              <p className='mt-1 text-xs text-[var(--hx-text-muted)]'>
                Try changing filters or search.
              </p>
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                className={`flex items-center gap-3 border-b border-[var(--hx-border)] px-3 py-3 last:border-b-0 ${
                  n.read ? 'bg-[var(--hx-surface)]' : 'bg-[var(--hx-accent-bg)]'
                }`}
              >
                <div className='relative'>
                  <Circle
                    size='h-12 w-12'
                    src={n.actorAvatar}
                    name={n.actorName}
                    showBadge
                    badgeKey={n.actorId}
                  />
                  {!n.read ? (
                    <span className='absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[var(--hx-accent)] ring-2 ring-[var(--hx-surface)]' />
                  ) : null}
                </div>

                <button
                  type='button'
                  onClick={() => openNotification(n)}
                  className='min-w-0 flex-1 text-left'
                >
                  <p className='truncate text-sm font-semibold text-[var(--hx-text)]'>
                    <span className='font-extrabold'>{n.actorName}</span>{' '}
                    <span className='font-semibold text-[var(--hx-text-muted)]'>
                      {n.kind === 'system' ? n.text : n.text.replace(`${n.actorName} `, '')}
                    </span>
                  </p>
                  <div className='mt-1 flex items-center gap-2'>
                    <span className='rounded-full border border-[var(--hx-border)] bg-[var(--hx-surface)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--hx-text)]'>
                      {n.kind}
                    </span>
                    <span className='text-[10px] font-semibold text-[var(--hx-text-muted)]'>
                      {timeAgoShort(n.createdAt)}
                    </span>
                  </div>
                </button>

                {n.postImg ? (
                  <button
                    type='button'
                    aria-label='Open post'
                    onClick={() => openNotification(n)}
                    className='h-12 w-12 overflow-hidden rounded-xl border border-[var(--hx-border)] bg-[var(--hx-surface-2)]'
                  >
                    <img
                      src={n.postImg}
                      alt='post preview'
                      className='h-full w-full object-cover'
                      loading='lazy'
                      decoding='async'
                    />
                  </button>
                ) : (
                  <div className='h-12 w-12 rounded-xl border border-[var(--hx-border)] bg-[var(--hx-surface)]' />
                )}

                <button
                  type='button'
                  aria-label='Remove'
                  onClick={() => {
                    const next = removeNotification(n.id)
                    setItems(next)
                  }}
                  className='rounded-full p-2 text-[var(--hx-text)] hover:bg-[var(--hx-surface-2)]'
                >
                  <TrashIcon />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default Likes
