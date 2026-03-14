import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Circle from '../components/Circle'
import { getCurrentMockUser, getFriendsForUser } from '../mock/authMock'
import { ensureSeededThreads, getThread, listThreads, markRead, receiveMockReply, sendMessage } from '../mock/chatMock'

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

const BackIcon = () => (
  <Svg>
    <path
      d='M15 18 9 12l6-6'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </Svg>
)

const SearchIcon = () => (
  <Svg>
    <path
      d='M21 21l-4.3-4.3'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path
      d='M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinejoin='round'
    />
  </Svg>
)

const SendIcon = () => (
  <Svg>
    <path
      d='M22 2 11 13'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M22 2 15 22l-4-9-9-4 20-7Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      opacity='0.78'
    />
  </Svg>
)

const formatTime = (iso) => {
  try {
    const dt = new Date(iso)
    if (Number.isNaN(dt.getTime())) return ''
    return dt.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

const Message = () => {
  const { userId } = useParams()
  const navigate = useNavigate()

  const currentUser = useMemo(() => getCurrentMockUser(), [])
  const friends = useMemo(() => getFriendsForUser(currentUser), [currentUser])

  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [threadTick, setThreadTick] = useState(0)
  const [threads, setThreads] = useState([])
  const [thread, setThread] = useState(null)

  const scrollRef = useRef(null)

  useEffect(() => {
    ensureSeededThreads(friends)
  }, [friends])

  useEffect(() => {
    setThreads(listThreads(friends))
  }, [friends, threadTick])

  const filteredThreads = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return threads
    return threads.filter((t) => String(t.friend?.name || '').toLowerCase().includes(q))
  }, [query, threads])

  const activeFriend = useMemo(() => {
    if (!userId) return null
    return friends.find((f) => f.id === userId) || null
  }, [friends, userId])

  useEffect(() => {
    if (!activeFriend) {
      setThread(null)
      return
    }
    setThread(getThread(activeFriend.id))
  }, [activeFriend, threadTick])

  useEffect(() => {
    if (!activeFriend) return
    markRead(activeFriend.id)
    setThreadTick((t) => t + 1)
  }, [activeFriend])

  useEffect(() => {
    // Scroll to bottom on open/new messages.
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [userId, thread?.messages?.length])

  const openThread = (friend) => {
    if (!friend?.id) return
    navigate(`/home/${friend.id}`)
  }

  const meName = currentUser?.name || 'You'

  if (!activeFriend) {
    return (
      <section className='h-full w-full bg-[var(--hx-app-bg)]'>
        <header className='sticky top-0 z-20 border-b border-[var(--hx-border)] bg-[var(--hx-surface-glass)] px-2 py-2 supports-[backdrop-filter]:backdrop-blur-md'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-extrabold text-[var(--hx-text)]'>Messages</p>
              <p className='text-xs text-[var(--hx-text-muted)]'>Fast, clean threads.</p>
            </div>
            <button
              type='button'
              onClick={() => setThreadTick((t) => t + 1)}
              className='rounded-full border border-[var(--hx-border)] bg-[var(--hx-surface)] px-3 py-2 text-xs font-bold text-[var(--hx-text)] hover:bg-[var(--hx-surface-2)]'
            >
              Refresh
            </button>
          </div>

          <div className='mt-2 flex items-center gap-2 rounded-full border border-[var(--hx-border)] bg-[var(--hx-surface)] px-3 py-2 text-[var(--hx-text)]'>
            <SearchIcon />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search friends...'
              className='w-full bg-transparent text-sm outline-none placeholder:text-[var(--hx-text-muted)]'
            />
          </div>
        </header>

        <div className='p-2'>
          <div className='rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface)]'>
            {filteredThreads.length === 0 ? (
              <div className='p-4 text-center'>
                <p className='text-sm font-bold text-[var(--hx-text)]'>No matches</p>
                <p className='mt-1 text-xs text-[var(--hx-text-muted)]'>Try a different name.</p>
              </div>
            ) : (
              filteredThreads.map((t) => (
                <button
                  key={t.friend.id}
                  type='button'
                  onClick={() => openThread(t.friend)}
                  className='flex w-full items-center gap-3 border-b border-[var(--hx-border)] px-3 py-3 text-left last:border-b-0 hover:bg-[var(--hx-surface-2)]'
                >
                  <div className='relative'>
                    <Circle
                      size='h-12 w-12'
                      src={t.friend.avatar}
                      name={t.friend.name}
                      showBadge
                      badgeKey={t.friend.id}
                    />
                    {t.unread > 0 ? (
                      <span className='absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--hx-accent)] px-1 text-[10px] font-extrabold text-white'>
                        {t.unread}
                      </span>
                    ) : null}
                  </div>

                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center justify-between gap-2'>
                      <p className='truncate text-sm font-extrabold text-[var(--hx-text)]'>
                        {t.friend.name}
                      </p>
                      <p className='shrink-0 text-[10px] font-semibold text-[var(--hx-text-muted)]'>
                        {t.last?.createdAt ? formatTime(t.last.createdAt) : ''}
                      </p>
                    </div>
                    <p className='mt-1 truncate text-xs text-[var(--hx-text-muted)]'>
                      {t.last ? `${t.last.from === 'me' ? `${meName}: ` : ''}${t.last.text}` : 'Tap to start chatting'}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </section>
    )
  }

  const messages = thread?.messages || []

  return (
    <section className='flex h-full w-full flex-col bg-[var(--hx-app-bg)]'>
      <header className='sticky top-0 z-20 flex items-center gap-2 border-b border-[var(--hx-border)] bg-[var(--hx-surface-glass)] px-2 py-2 text-[var(--hx-text)] supports-[backdrop-filter]:backdrop-blur-md'>
        <button
          type='button'
          aria-label='Back'
          onClick={() => navigate('/home/messages')}
          className='rounded-full p-2 hover:bg-[var(--hx-surface-2)]'
        >
          <BackIcon />
        </button>
        <div className='flex items-center gap-2 min-w-0'>
          <img
            src={activeFriend.avatar}
            alt={activeFriend.name}
            className='h-10 w-10 rounded-full border border-[var(--hx-border)] object-cover'
            loading='lazy'
            decoding='async'
          />
          <div className='min-w-0'>
            <p className='truncate text-sm font-extrabold'>{activeFriend.name}</p>
            <p className='truncate text-[10px] font-semibold text-[var(--hx-text-muted)]'>
              {isTyping ? 'typing…' : 'online'}
            </p>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className='no-scrollbar flex-1 overflow-y-auto p-2'>
        <div className='mx-auto flex w-full max-w-[360px] flex-col gap-2'>
          {messages.map((m) => {
            const mine = m.from === 'me'
            return (
              <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[88%] rounded-2xl border px-3 py-2 text-sm leading-5 shadow-sm ${
                    mine
                      ? 'border-[rgba(228,0,110,0.35)] bg-[var(--hx-accent-bg)] text-[var(--hx-text)]'
                      : 'border-[var(--hx-border)] bg-[var(--hx-surface)] text-[var(--hx-text)]'
                  }`}
                >
                  <p className='whitespace-pre-wrap break-words'>{m.text}</p>
                  <p className='mt-1 text-[10px] font-semibold text-[var(--hx-text-muted)]'>
                    {formatTime(m.createdAt)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className='sticky bottom-0 z-30 border-t border-[var(--hx-border)] bg-[var(--hx-surface)] p-2'>
        <div className='mx-auto flex w-full max-w-[360px] items-end gap-2'>
          <div className='flex-1 rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface-2)] p-2'>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder='Message...'
              rows={1}
              className='no-scrollbar max-h-28 w-full resize-none bg-transparent text-sm text-[var(--hx-text)] outline-none placeholder:text-[var(--hx-text-muted)]'
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  const msg = sendMessage(activeFriend.id, draft)
                  if (!msg) return
                  setDraft('')
                  setThreadTick((t) => t + 1)
                  setIsTyping(true)
                  window.setTimeout(() => {
                    receiveMockReply(activeFriend.id)
                    setIsTyping(false)
                    setThreadTick((t) => t + 1)
                  }, 650 + Math.floor(Math.random() * 500))
                }
              }}
            />
            <div className='mt-1 flex items-center justify-between'>
              <div className='flex items-center gap-1'>
                {['😀', '🔥', '💯', '❤️', '👍'].map((e) => (
                  <button
                    key={e}
                    type='button'
                    className='grid h-8 w-8 place-items-center rounded-full hover:bg-[var(--hx-surface)]'
                    onClick={() => setDraft((d) => `${d}${e}`)}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <p className='text-[10px] font-semibold text-[var(--hx-text-muted)]'>
                Enter to send, Shift+Enter new line
              </p>
            </div>
          </div>

          <button
            type='button'
            aria-label='Send'
            disabled={!draft.trim()}
            onClick={() => {
              const msg = sendMessage(activeFriend.id, draft)
              if (!msg) return
              setDraft('')
              setThreadTick((t) => t + 1)
              setIsTyping(true)
              if (typeof window !== 'undefined') {
                window.dispatchEvent(
                  new CustomEvent('hender:activity-circle', {
                    detail: {
                      id: `chat-${activeFriend.id}-${Date.now()}`,
                      name: 'Chat',
                      avatar: activeFriend.avatar,
                      avatarFull: activeFriend.avatarFull || activeFriend.avatar,
                      badgeIcon: 'chat',
                    },
                  })
                )
              }
              window.setTimeout(() => {
                receiveMockReply(activeFriend.id)
                setIsTyping(false)
                setThreadTick((t) => t + 1)
              }, 650 + Math.floor(Math.random() * 500))
            }}
            className='grid h-11 w-11 place-items-center rounded-full bg-[var(--hx-accent)] text-white disabled:opacity-60'
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </section>
  )
}

export default Message
