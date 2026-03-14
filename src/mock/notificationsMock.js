import { getMockPosts } from './postsMock'

const KEY = 'hx_notifications_v1'

const canUseStorage = () => typeof window !== 'undefined' && !!window.localStorage

const readStored = () => {
  if (!canUseStorage()) return []
  const raw = window.localStorage.getItem(KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeStored = (items) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(KEY, JSON.stringify(items))
}

const timeAgo = (msAgo) => new Date(Date.now() - msAgo).toISOString()

const buildSeed = (friends) => {
  const posts = getMockPosts()
  const pickPost = (idx) => posts[idx % posts.length]
  const pickFriend = (idx) => friends[idx % friends.length]

  const types = [
    { kind: 'reaction', verb: 'liked your post' },
    { kind: 'comment', verb: 'commented on your post' },
    { kind: 'mention', verb: 'mentioned you' },
    { kind: 'follow', verb: 'started following you' },
    { kind: 'system', verb: 'Your profile looks great in dark mode.' },
  ]

  const seed = Array.from({ length: 18 }, (_, i) => {
    const t = types[i % types.length]
    const actor = pickFriend(i + 2)
    const post = pickPost(i + 1)

    const withPost = t.kind === 'reaction' || t.kind === 'comment' || t.kind === 'mention'
    const text =
      t.kind === 'system'
        ? t.verb
        : `${actor.name} ${t.verb}${withPost ? '' : ''}`

    return {
      id: `n${i + 1}`,
      kind: t.kind,
      actorId: actor.id,
      actorName: actor.name,
      actorAvatar: actor.avatar,
      actorAvatarFull: actor.avatarFull || actor.avatar,
      text,
      postId: withPost ? post.id : null,
      postImg: withPost ? post.postImg : null,
      createdAt: timeAgo((i + 1) * 1000 * 60 * 19),
      read: i > 4, // first few are unread
    }
  })

  return seed
}

export const ensureSeededNotifications = (friends) => {
  if (!Array.isArray(friends) || friends.length === 0) return
  const existing = readStored()
  if (existing.length > 0) return
  writeStored(buildSeed(friends))
}

export const listNotifications = () => readStored()

export const markNotificationRead = (id) => {
  const items = readStored()
  const next = items.map((n) => (n.id === id ? { ...n, read: true } : n))
  writeStored(next)
  return next
}

export const markAllNotificationsRead = () => {
  const items = readStored()
  const next = items.map((n) => ({ ...n, read: true }))
  writeStored(next)
  return next
}

export const removeNotification = (id) => {
  const items = readStored()
  const next = items.filter((n) => n.id !== id)
  writeStored(next)
  return next
}

