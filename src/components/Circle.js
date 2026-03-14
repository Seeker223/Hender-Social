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
  badgeIcon = '',
  placeholder = false,
  payload = null,
  onSelect,
  onClick,
}) => {
  const badgeColor = showBadge ? colorFromKey(badgeKey || name) : null
  const handleClick = React.useCallback(() => {
    if (typeof onSelect === 'function') {
      onSelect(payload)
      return
    }
    if (typeof onClick === 'function') {
      onClick()
    }
  }, [onSelect, payload, onClick])

  const BadgeIcon = ({ kind }) => {
    const Svg = ({ children }) => (
      <svg
        width='10'
        height='10'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='block'
      >
        {children}
      </svg>
    )

    if (kind === 'chat') {
      return (
        <Svg>
          <path
            d='M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinejoin='round'
          />
        </Svg>
      )
    }

    if (kind === 'comment') {
      return (
        <Svg>
          <path
            d='M7 18h6'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
          />
          <path
            d='M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinejoin='round'
            opacity='0.85'
          />
        </Svg>
      )
    }

    if (kind === 'reaction') {
      return (
        <Svg>
          <path
            d='M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8Z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinejoin='round'
            strokeLinecap='round'
          />
        </Svg>
      )
    }

    if (kind === 'video') {
      return (
        <Svg>
          <path
            d='M14 10.5 20 7v10l-6-3.5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3.5Z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinejoin='round'
          />
        </Svg>
      )
    }

    return null
  }

  return (
    <button
      type='button'
      className={`${size} ${className} relative inline-block`}
      onClick={handleClick}
      aria-label={name}
    >
      {placeholder ? (
        <div className='h-full w-full animate-pulse rounded-full border-2 border-[#ffd2e5] bg-[#f1f1f1]' />
      ) : (
        <img
          src={src}
          className='h-full w-full rounded-full border-2 border-[#ff2c7b] object-cover'
          alt={name}
          title={name}
          loading='lazy'
          decoding='async'
          fetchPriority={fetchPriority}
          draggable={false}
        />
      )}
      {showBadge ? (
        badgeIcon ? (
          <span className='absolute -bottom-0.5 -left-0.5 grid h-4 w-4 place-items-center rounded-full bg-[var(--hx-accent)] text-white ring-2 ring-white'>
            <BadgeIcon kind={badgeIcon} />
          </span>
        ) : (
          <span
            className='absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full ring-2 ring-white'
            style={{ backgroundColor: badgeColor }}
          />
        )
      ) : null}
    </button>
  )
}

export default React.memo(Circle)
