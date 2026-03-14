const THREADS_KEY = 'hx_chat_threads_v1'

const canUseStorage = () => typeof window !== 'undefined' && !!window.localStorage

const readThreads = () => {
  if (!canUseStorage()) return {}
  const raw = window.localStorage.getItem(THREADS_KEY)
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const writeThreads = (threads) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(THREADS_KEY, JSON.stringify(threads))
}

const seedIfMissing = (friend) => {
  const threads = readThreads()
  if (threads[friend.id]) return threads

  const now = Date.now()
  const msgs = [
    {
      id: `${friend.id}-m1`,
      from: 'them',
      text: 'Yo. You working on the offrolling today?',
      createdAt: new Date(now - 1000 * 60 * 55).toISOString(),
    },
    {
      id: `${friend.id}-m2`,
      from: 'me',
      text: 'Yeah. Pushing the perf and UI details.',
      createdAt: new Date(now - 1000 * 60 * 52).toISOString(),
    },
    {
      id: `${friend.id}-m3`,
      from: 'them',
      text: 'Nice. Ship it clean.',
      createdAt: new Date(now - 1000 * 60 * 48).toISOString(),
    },
  ]

  const unread = Math.random() < 0.45 ? Math.floor(1 + Math.random() * 4) : 0
  threads[friend.id] = { friendId: friend.id, messages: msgs, unread }
  writeThreads(threads)
  return threads
}

export const ensureSeededThreads = (friends) => {
  if (!Array.isArray(friends)) return
  friends.slice(0, 12).forEach((f) => seedIfMissing(f))
}

export const listThreads = (friends) => {
  const threads = readThreads()
  const map = new Map((friends || []).map((f) => [f.id, f]))

  const out = Object.values(threads)
    .map((t) => {
      const friend = map.get(t.friendId)
      if (!friend) return null
      const last = t.messages?.[t.messages.length - 1] || null
      return {
        friend,
        last,
        unread: Number(t.unread) || 0,
      }
    })
    .filter(Boolean)
    .sort((a, b) => {
      const at = a.last?.createdAt ? new Date(a.last.createdAt).getTime() : 0
      const bt = b.last?.createdAt ? new Date(b.last.createdAt).getTime() : 0
      return bt - at
    })

  // If nothing stored yet, fall back to friends list.
  if (out.length === 0) {
    return (friends || []).slice(0, 12).map((friend) => ({
      friend,
      last: null,
      unread: 0,
    }))
  }

  return out
}

export const getThread = (friendId) => {
  const threads = readThreads()
  const t = threads[friendId]
  if (!t) {
    return { friendId, messages: [], unread: 0 }
  }
  return t
}

export const markRead = (friendId) => {
  const threads = readThreads()
  if (!threads[friendId]) return
  threads[friendId].unread = 0
  writeThreads(threads)
}

export const sendMessage = (friendId, text) => {
  const trimmed = String(text || '').trim()
  if (!trimmed) return null
  const threads = readThreads()
  const t = threads[friendId] || { friendId, messages: [], unread: 0 }
  const msg = {
    id: `${friendId}-m${Date.now()}`,
    from: 'me',
    text: trimmed,
    createdAt: new Date().toISOString(),
  }
  t.messages = [...(t.messages || []), msg]
  t.unread = 0
  threads[friendId] = t
  writeThreads(threads)
  return msg
}

export const sendAudioMessage = (friendId, audioSrc) => {
  const src = String(audioSrc || '').trim()
  if (!src) return null
  const threads = readThreads()
  const t = threads[friendId] || { friendId, messages: [], unread: 0 }
  const msg = {
    id: `${friendId}-m${Date.now()}a`,
    from: 'me',
    text: '',
    audioSrc: src,
    createdAt: new Date().toISOString(),
  }
  t.messages = [...(t.messages || []), msg]
  t.unread = 0
  threads[friendId] = t
  writeThreads(threads)
  return msg
}

export const receiveMockReply = (friendId) => {
  const threads = readThreads()
  const t = threads[friendId]
  if (!t) return null
  const lines = [
    'Ok.',
    'Got it.',
    'That UI is clean.',
    'Try the new build on mobile.',
    'Send me the link.',
    'Nice.',
  ]
  const msg = {
    id: `${friendId}-m${Date.now()}r`,
    from: 'them',
    text: lines[Math.floor(Math.random() * lines.length)],
    createdAt: new Date().toISOString(),
  }
  t.messages = [...(t.messages || []), msg]
  t.unread = Number(t.unread) || 0
  threads[friendId] = t
  writeThreads(threads)
  return msg
}
