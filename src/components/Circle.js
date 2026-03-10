import React from 'react'
import avatar from '../assets/avatar.png'

const colorFromKey = (key) => {
  let hash = 0
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }
  const hue = hash % 360
  return `hsl(${hue} 80% 55%)`
}

const Circle = ({
  size = 'h-10 w-10',
  className = '',
  src = avatar,
  name = 'avatar',
  fetchPriority = 'low',
  showBadge = false,
  badgeKey = '',
}) => {
  const badgeColor = showBadge ? colorFromKey(badgeKey || name) : null

  return (
    <div className={`${size} ${className} relative inline-block`}>
      <img
        src={src}
        className='h-full w-full cursor-pointer rounded-full border-2 border-[#ff2c7b] object-cover'
        alt={name}
        title={name}
        loading="lazy"
        decoding="async"
        fetchPriority={fetchPriority}
      />
      {showBadge && (
        <span
          className='absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full ring-2 ring-white'
          style={{ backgroundColor: badgeColor }}
        />
      )}
    </div>
  )
}

export default Circle
