export const createSquareThumbDataUrlFromImageSrc = async ({
  src,
  size = 96,
  quality = 0.6,
}) => {
  if (!src) return ''
  const res = await fetch(src)
  const blob = await res.blob()
  const bitmap = await createImageBitmap(blob)

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { alpha: false })

  const side = Math.min(bitmap.width, bitmap.height)
  const sx = Math.max(0, Math.floor((bitmap.width - side) / 2))
  const sy = Math.max(0, Math.floor((bitmap.height - side) / 2))
  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, size, size)
  return canvas.toDataURL('image/jpeg', quality)
}

export const createSquareThumbDataUrlFromVideoSrc = async ({
  src,
  size = 96,
  quality = 0.6,
  atSeconds = 0.1,
}) => {
  if (!src) return ''

  const video = document.createElement('video')
  video.src = src
  video.muted = true
  video.playsInline = true
  video.crossOrigin = 'anonymous'

  await new Promise((resolve, reject) => {
    const onLoaded = () => resolve()
    const onErr = () => reject(new Error('video load failed'))
    video.addEventListener('loadeddata', onLoaded, { once: true })
    video.addEventListener('error', onErr, { once: true })
  })

  const seekTo = Math.min(Math.max(0, atSeconds), Math.max(0, (video.duration || 0) - 0.05))
  if (Number.isFinite(seekTo) && seekTo > 0) {
    await new Promise((resolve) => {
      const onSeek = () => resolve()
      video.addEventListener('seeked', onSeek, { once: true })
      video.currentTime = seekTo
    })
  }

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { alpha: false })

  const w = video.videoWidth || size
  const h = video.videoHeight || size
  const side = Math.min(w, h)
  const sx = Math.max(0, Math.floor((w - side) / 2))
  const sy = Math.max(0, Math.floor((h - side) / 2))
  ctx.drawImage(video, sx, sy, side, side, 0, 0, size, size)

  return canvas.toDataURL('image/jpeg', quality)
}

