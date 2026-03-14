import hlogo2 from '../assets/hlogo2.png'
import p1 from '../assets/male/p1.jpg'
import p2 from '../assets/male/p2.jpg'
import p3 from '../assets/male/p3.jpg'
import p4 from '../assets/male/p4.jpg'
import p5 from '../assets/male/p5.jpg'
import p6 from '../assets/male/p6.jpg'
import p7 from '../assets/male/p7.jpg'
import p8 from '../assets/male/p8.jpg'
import avatar from '../assets/avatar.png'

const POSTS_KEY = 'hender_mock_posts'

const canUseStorage = () => typeof window !== 'undefined' && !!window.localStorage

const seededPosts = () => [
  {
    id: 'seed-1',
    authorName: 'ztsambad',
    authorAvatar: hlogo2,
    text: 'efjfhjkfvdzjhnmcckn,mcn,xnc.xjfkl lcjdxc',
    react: 21,
    comments: 12,
    views: 120,
    postImg: hlogo2,
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: 'seed-2',
    authorName: 'Alex',
    authorAvatar: p1,
    text: '',
    react: 4,
    comments: 2,
    views: 32,
    postImg: p1,
    createdAt: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
  },
  {
    id: 'seed-3',
    authorName: 'Maya',
    authorAvatar: avatar,
    text: '',
    react: 44,
    comments: 10,
    views: 88,
    postImg: avatar,
    createdAt: new Date(Date.now() - 1000 * 60 * 77).toISOString(),
  },
  { id: 'seed-4', authorName: 'Chris', authorAvatar: p2, text: '', react: 34, comments: 1, views: 40, postImg: p2, createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: 'seed-5', authorName: 'Ada', authorAvatar: p3, text: '', react: 78, comments: 5, views: 112, postImg: p3, createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
  { id: 'seed-6', authorName: 'Noah', authorAvatar: p4, text: '', react: 68, comments: 3, views: 92, postImg: p4, createdAt: new Date(Date.now() - 1000 * 60 * 260).toISOString() },
  { id: 'seed-7', authorName: 'Ella', authorAvatar: p5, text: '', react: 999, comments: 54, views: 1000, postImg: p5, createdAt: new Date(Date.now() - 1000 * 60 * 400).toISOString() },
  { id: 'seed-8', authorName: 'Zane', authorAvatar: p6, text: '', react: 766, comments: 33, views: 560, postImg: p6, createdAt: new Date(Date.now() - 1000 * 60 * 660).toISOString() },
  { id: 'seed-9', authorName: 'Liam', authorAvatar: p7, text: '', react: 5555, comments: 210, views: 4000, postImg: p7, createdAt: new Date(Date.now() - 1000 * 60 * 1100).toISOString() },
  { id: 'seed-10', authorName: 'Tola', authorAvatar: p8, text: '', react: 457, comments: 14, views: 220, postImg: p8, createdAt: new Date(Date.now() - 1000 * 60 * 1400).toISOString() },
]

const readStoredPosts = () => {
  if (!canUseStorage()) return []
  const raw = window.localStorage.getItem(POSTS_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeStoredPosts = (posts) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
}

export const getMockPosts = () => {
  const stored = readStoredPosts()
  return [...stored, ...seededPosts()]
}

export const addMockPost = (post) => {
  const next = [post, ...readStoredPosts()]
  writeStoredPosts(next.slice(0, 50))
  return post
}

