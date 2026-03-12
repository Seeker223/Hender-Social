import m1Full from '../assets/male/p1.jpg'
import m2Full from '../assets/male/p2.jpg'
import m3Full from '../assets/male/p3.jpg'
import m4Full from '../assets/male/p4.jpg'
import m5Full from '../assets/male/p5.jpg'
import m6Full from '../assets/male/p6.jpg'
import m8Full from '../assets/male/p8.jpg'
import m9Full from '../assets/male/p9.jpg'
import f1Full from '../assets/female/1.jpg'
import f2Full from '../assets/female/2.jpg'
import f3Full from '../assets/female/3.jpg'
import f4Full from '../assets/female/4.jpg'
import f5Full from '../assets/female/5.jpg'
import f6Full from '../assets/female/6.jpg'
import f7Full from '../assets/female/7.jpg'
import f9Full from '../assets/female/9.jpg'
import f10Full from '../assets/female/10.jpg'
import f11Full from '../assets/female/11.jpg'
import f12Full from '../assets/female/12.jpg'

import m1Thumb from '../assets/thumbs/male/p1.webp'
import m2Thumb from '../assets/thumbs/male/p2.webp'
import m3Thumb from '../assets/thumbs/male/p3.webp'
import m4Thumb from '../assets/thumbs/male/p4.webp'
import m5Thumb from '../assets/thumbs/male/p5.webp'
import m6Thumb from '../assets/thumbs/male/p6.webp'
import m8Thumb from '../assets/thumbs/male/p8.webp'
import m9Thumb from '../assets/thumbs/male/p9.webp'
import f1Thumb from '../assets/thumbs/female/1.webp'
import f2Thumb from '../assets/thumbs/female/2.webp'
import f3Thumb from '../assets/thumbs/female/3.webp'
import f4Thumb from '../assets/thumbs/female/4.webp'
import f5Thumb from '../assets/thumbs/female/5.webp'
import f6Thumb from '../assets/thumbs/female/6.webp'
import f7Thumb from '../assets/thumbs/female/7.webp'
import f9Thumb from '../assets/thumbs/female/9.webp'
import f10Thumb from '../assets/thumbs/female/10.webp'
import f11Thumb from '../assets/thumbs/female/11.webp'
import f12Thumb from '../assets/thumbs/female/12.webp'

// Full images in this pool are already < 500KB on disk in this repo.
// Thumbs are ~1-3KB WebP for fast offrolling on mobile.
const AVATAR_POOL = [
  { full: m1Full, thumb: m1Thumb },
  { full: f1Full, thumb: f1Thumb },
  { full: m2Full, thumb: m2Thumb },
  { full: f2Full, thumb: f2Thumb },
  { full: m3Full, thumb: m3Thumb },
  { full: f3Full, thumb: f3Thumb },
  { full: m4Full, thumb: m4Thumb },
  { full: f4Full, thumb: f4Thumb },
  { full: m5Full, thumb: m5Thumb },
  { full: f5Full, thumb: f5Thumb },
  { full: m6Full, thumb: m6Thumb },
  { full: f6Full, thumb: f6Thumb },
  { full: m8Full, thumb: m8Thumb },
  { full: f7Full, thumb: f7Thumb },
  { full: m9Full, thumb: m9Thumb },
  { full: f9Full, thumb: f9Thumb },
  { full: f10Full, thumb: f10Thumb },
  { full: f11Full, thumb: f11Thumb },
  { full: f12Full, thumb: f12Thumb },
]

const MOCK_USERS_KEY = 'hender_mock_users'
const MOCK_SESSION_KEY = 'hender_mock_session'

const FRIEND_NAMES = [
  'Alex',
  'Maya',
  'Chris',
  'Ada',
  'Noah',
  'Ella',
  'Zane',
  'Liam',
  'Tola',
  'Ruby',
  'Dara',
  'Kemi',
  'Joy',
  'Bree',
  'Iris',
  'Theo',
  'Milo',
  'Evan',
]

export const MOCK_FRIENDS = Array.from({ length: 48 }, (_, index) => {
  const id = `f${index + 1}`
  const name = FRIEND_NAMES[index] || `Friend ${index + 1}`
  const { full, thumb } = AVATAR_POOL[index % AVATAR_POOL.length]
  // `avatar` is used by circle UI (Top/Right) so it stays lightweight.
  return { id, name, avatar: thumb, avatarFull: full }
})

const DEFAULT_USERS = [
  {
    id: 'u1',
    name: 'Seeker223',
    email: 'seeker@hender.app',
    password: 'pass1234',
    friendIds: MOCK_FRIENDS.map((friend) => friend.id),
  },
  {
    id: 'u2',
    name: 'Ztsambad',
    email: 'ztsambad@hender.app',
    password: 'pass1234',
    friendIds: MOCK_FRIENDS.slice(0, 14).map((friend) => friend.id),
  },
]

const canUseStorage = () => typeof window !== 'undefined' && !!window.localStorage

const ensureSeededUsers = () => {
  if (!canUseStorage()) {
    return DEFAULT_USERS
  }

  const existing = window.localStorage.getItem(MOCK_USERS_KEY)
  if (!existing) {
    window.localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(DEFAULT_USERS))
    return DEFAULT_USERS
  }

  try {
    const parsed = JSON.parse(existing)
    return Array.isArray(parsed) ? parsed : DEFAULT_USERS
  } catch {
    window.localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(DEFAULT_USERS))
    return DEFAULT_USERS
  }
}

export const getMockUsers = () => ensureSeededUsers()

const saveMockUsers = (users) => {
  if (!canUseStorage()) {
    return
  }
  window.localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
}

export const setCurrentMockUser = (user) => {
  if (!canUseStorage()) {
    return
  }
  window.localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user))
}

export const getCurrentMockUser = () => {
  if (!canUseStorage()) {
    return null
  }

  const session = window.localStorage.getItem(MOCK_SESSION_KEY)
  if (!session) {
    return null
  }

  try {
    return JSON.parse(session)
  } catch {
    return null
  }
}

export const clearCurrentMockUser = () => {
  if (!canUseStorage()) {
    return
  }
  window.localStorage.removeItem(MOCK_SESSION_KEY)
}

export const isMockAuthenticated = () => !!getCurrentMockUser()

export const loginMockUser = ({ email, password }) => {
  const users = getMockUsers()
  const user = users.find(
    (item) =>
      item.email.trim().toLowerCase() === email.trim().toLowerCase() &&
      item.password === password
  )

  if (!user) {
    return { ok: false, message: 'Invalid email or password' }
  }

  setCurrentMockUser(user)
  return { ok: true, user }
}

export const registerMockUser = ({ name, email, password }) => {
  const users = getMockUsers()
  const normalizedEmail = email.trim().toLowerCase()

  const exists = users.some((user) => user.email.trim().toLowerCase() === normalizedEmail)
  if (exists) {
    return { ok: false, message: 'Email already exists in mock data' }
  }

  const newUser = {
    id: `u${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
    friendIds: MOCK_FRIENDS.map((friend) => friend.id),
  }

  const nextUsers = [...users, newUser]
  saveMockUsers(nextUsers)
  setCurrentMockUser(newUser)

  return { ok: true, user: newUser }
}

export const getFriendsForUser = (user) => {
  if (!user || !Array.isArray(user.friendIds)) {
    return MOCK_FRIENDS
  }

  // Older sessions/users may have a shorter friendIds list; default to full mock list.
  if (user.friendIds.length < 36) {
    return MOCK_FRIENDS
  }

  const friendSet = new Set(user.friendIds)
  const filtered = MOCK_FRIENDS.filter((friend) => friendSet.has(friend.id))
  return filtered.length >= 36 ? filtered : MOCK_FRIENDS
}
