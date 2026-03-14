const COMMENTS_KEY = 'hx_post_comments_v1'

const canUseStorage = () => typeof window !== 'undefined' && !!window.localStorage

const readAll = () => {
  if (!canUseStorage()) return {}
  const raw = window.localStorage.getItem(COMMENTS_KEY)
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const writeAll = (map) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(COMMENTS_KEY, JSON.stringify(map))
}

export const getPostComments = (postId) => {
  if (!postId) return []
  const all = readAll()
  const list = all[postId]
  return Array.isArray(list) ? list : []
}

export const addPostComment = ({ postId, text, authorId = 'me', authorName = 'You', parentId = '' }) => {
  const trimmed = String(text || '').trim()
  if (!postId || !trimmed) return null

  const all = readAll()
  const next = Array.isArray(all[postId]) ? [...all[postId]] : []
  const comment = {
    id: `${postId}-lc${Date.now()}`,
    postId,
    text: trimmed,
    authorId,
    authorName,
    parentId: parentId || '',
    createdAt: new Date().toISOString(),
  }
  next.unshift(comment)
  all[postId] = next.slice(0, 250)
  writeAll(all)
  return comment
}

