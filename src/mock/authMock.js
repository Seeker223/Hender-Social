import p1 from '../assets/male/p1.jpg'
import p2 from '../assets/male/p2.jpg'
import p3 from '../assets/male/p3.jpg'
import p4 from '../assets/male/p4.jpg'
import p5 from '../assets/male/p5.jpg'
import p6 from '../assets/male/p6.jpg'
import p7 from '../assets/male/p7.jpg'
import p8 from '../assets/male/p8.jpg'
import f1 from '../assets/female/1.jpg'
import f2 from '../assets/female/2.jpg'
import f3 from '../assets/female/3.jpg'
import f4 from '../assets/female/4.jpg'
import f5 from '../assets/female/5.jpg'
import f6 from '../assets/female/6.jpg'
import f7 from '../assets/female/7.jpg'
import f8 from '../assets/female/8.jpg'
import f9 from '../assets/female/9.jpg'
import f10 from '../assets/female/10.jpg'

const MOCK_USERS_KEY = 'hender_mock_users'
const MOCK_SESSION_KEY = 'hender_mock_session'

export const MOCK_FRIENDS = [
  { id: 'f1', name: 'Alex', avatar: p1 },
  { id: 'f2', name: 'Maya', avatar: f1 },
  { id: 'f3', name: 'Chris', avatar: p2 },
  { id: 'f4', name: 'Ada', avatar: f2 },
  { id: 'f5', name: 'Noah', avatar: p3 },
  { id: 'f6', name: 'Ella', avatar: f3 },
  { id: 'f7', name: 'Zane', avatar: p4 },
  { id: 'f8', name: 'Liam', avatar: p5 },
  { id: 'f9', name: 'Tola', avatar: f4 },
  { id: 'f10', name: 'Ruby', avatar: f5 },
  { id: 'f11', name: 'Dara', avatar: f6 },
  { id: 'f12', name: 'Kemi', avatar: f7 },
  { id: 'f13', name: 'Joy', avatar: f8 },
  { id: 'f14', name: 'Bree', avatar: f9 },
  { id: 'f15', name: 'Iris', avatar: f10 },
  { id: 'f16', name: 'Theo', avatar: p6 },
  { id: 'f17', name: 'Milo', avatar: p7 },
  { id: 'f18', name: 'Evan', avatar: p8 },
]

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

  const friendSet = new Set(user.friendIds)
  return MOCK_FRIENDS.filter((friend) => friendSet.has(friend.id))
}
