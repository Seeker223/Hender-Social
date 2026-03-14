import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const Svg = ({ children }) => (
  <svg
    width='22'
    height='22'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='shrink-0'
  >
    {children}
  </svg>
)

const HomeIcon = () => (
  <Svg>
    <path
      d='M3 11.5 12 4l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V11.5Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinejoin='round'
    />
  </Svg>
)

const BellIcon = () => (
  <Svg>
    <path
      d='M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinejoin='round'
    />
    <path
      d='M13.73 21a2 2 0 0 1-3.46 0'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
  </Svg>
)

const MessageIcon = () => (
  <Svg>
    <path
      d='M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </Svg>
)

const UserIcon = () => (
  <Svg>
    <path
      d='M20 21a8 8 0 1 0-16 0'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path
      d='M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinejoin='round'
    />
  </Svg>
)

const VideoIcon = () => (
  <Svg>
    <path
      d='M14 10.5 20 7v10l-6-3.5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3.5Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinejoin='round'
    />
  </Svg>
)

const SunIcon = () => (
  <Svg>
    <path
      d='M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinejoin='round'
    />
    <path
      d='M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
  </Svg>
)

const MoonIcon = () => (
  <Svg>
    <path
      d='M21 13.2A7.5 7.5 0 0 1 10.8 3a6.5 6.5 0 1 0 10.2 10.2Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinejoin='round'
    />
  </Svg>
)

const PlusSquareIcon = () => (
  <Svg>
    <path
      d='M8 3h8a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinejoin='round'
    />
    <path
      d='M12 8v8M8 12h8'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
  </Svg>
)

const Item = ({ to, label, children }) => (
  <NavLink
    to={to}
    aria-label={label}
    className={({ isActive }) =>
      `flex items-center justify-center rounded-full p-2 transition-colors ${
        isActive
          ? 'bg-[var(--hx-accent-bg)] text-[var(--hx-accent)]'
          : 'text-[var(--hx-text)] hover:bg-[var(--hx-surface-2)]'
      }`
    }
  >
    {children}
  </NavLink>
)

const IconContainer = () => {
  const navigate = useNavigate()
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return window.localStorage.getItem('hx_theme') || 'light'
  })

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.dataset.theme = theme
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('hx_theme', theme)
    }
  }, [theme])

  return (
    <nav className='sticky top-0 z-30 flex h-12 items-center justify-between border-b border-[var(--hx-border)] bg-[var(--hx-surface-glass)] px-2 text-[var(--hx-text)] supports-[backdrop-filter]:backdrop-blur-md'>
      <Item to='/home/left' label='Home'><HomeIcon /></Item>
      <Item to='/home/likes' label='Notifications'><BellIcon /></Item>
      <Item to='/home/messages' label='Messages'><MessageIcon /></Item>
      <Item to='/home/video' label='Video'><VideoIcon /></Item>
      <Item to='/home/profile' label='Profile'><UserIcon /></Item>
      <button
        type='button'
        aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        className='flex items-center justify-center rounded-full p-2 text-[var(--hx-text)] transition-colors hover:bg-[var(--hx-surface-2)]'
        onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
      <button
        type='button'
        aria-label='Post'
        className='flex items-center justify-center rounded-full p-2 text-[var(--hx-text)] transition-colors hover:bg-[var(--hx-surface-2)]'
        onClick={() => navigate('/home/post')}
      >
        <PlusSquareIcon />
      </button>
    </nav>
  )
}

export default IconContainer
