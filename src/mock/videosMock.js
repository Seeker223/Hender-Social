const VIDEOS_KEY = 'hx_mock_videos_v1'

const canUseStorage = () => typeof window !== 'undefined' && !!window.localStorage

const readStoredVideos = () => {
  if (!canUseStorage()) return []
  const raw = window.localStorage.getItem(VIDEOS_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeStoredVideos = (videos) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos))
}

export const getStoredVideos = () => readStoredVideos()

export const addStoredVideo = (video) => {
  const next = [video, ...readStoredVideos()]
  writeStoredVideos(next.slice(0, 24))
  return video
}

