import avatar from '../assets/avatar.png'

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
  return { id, name, avatar }
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
