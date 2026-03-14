export const emojiToDataUrl = (emoji, size = 512) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return ''
  const e = String(emoji || '').trim()
  if (!e) return ''

  const s = Number.isFinite(Number(size)) ? Math.max(64, Math.floor(Number(size))) : 512
  const canvas = document.createElement('canvas')
  canvas.width = s
  canvas.height = s
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  // Neutral background that reads on light/dark when used as an image.
  ctx.fillStyle = '#f3f4f6'
  ctx.fillRect(0, 0, s, s)

  // Subtle accent ring to keep it visually consistent with avatar circles.
  ctx.strokeStyle = '#ff2c7b'
  ctx.lineWidth = Math.max(10, Math.round(s * 0.04))
  ctx.beginPath()
  ctx.arc(s / 2, s / 2, s / 2 - ctx.lineWidth / 2, 0, Math.PI * 2)
  ctx.stroke()

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const fontSize = Math.round(s * 0.58)
  ctx.font = `700 ${fontSize}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`
  ctx.fillStyle = '#111827'
  ctx.fillText(e, s / 2, s / 2 + Math.round(s * 0.02))

  try {
    return canvas.toDataURL('image/png')
  } catch {
    return ''
  }
}

