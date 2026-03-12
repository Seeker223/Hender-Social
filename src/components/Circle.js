import React from 'react'
import avatar from '../assets/avatar.png'

const colorFromKey = (key) => {
  const numeric = String(key).match(/\d+/)?.[0]
  if (numeric) {
    const n = Number.parseInt(numeric, 10)
    // Golden angle distribution: keeps adjacent ids visually distinct.
    const hue = (n * 137.508) % 360
    const light = 52 + ((n % 3) * 6) // small variation to avoid similar hues looking identical
    return `hsl(${hue} 85% ${light}%)`
  }

  let hash = 0
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }
  const hue = hash % 360
  return `hsl(${hue} 85% 55%)`
}

const Circle = ({
  size = 'h-10 w-10',
  className = '',
  src = avatar,
  name = 'avatar',
  fetchPriority = 'low',
  showBadge = false,
  badgeKey = '',
  onClick,
}) => {
  const badgeColor = showBadge ? colorFromKey(badgeKey || name) : null

  return (
    <button
      type='button'
      className={`${size} ${className} relative inline-block`}
      onClick={onClick}
      aria-label={name}
    >
      <img
        src={src}
        className='h-full w-full rounded-full border-2 border-[#ff2c7b] object-cover'
        alt={name}
        title={name}
        loading='lazy'
        decoding='async'
        fetchPriority={fetchPriority}
      />
      {showBadge && (
        <span
          className='absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full ring-2 ring-white'
          style={{ backgroundColor: badgeColor }}
        />
      )}
    </button>
  )
}

export default React.memo(Circle)
