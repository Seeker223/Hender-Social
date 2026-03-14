import React, { useEffect, useMemo, useRef, useState } from 'react'
import parrots from '../assets/parrots.mp4'
import river from '../assets/river.mp4'
import yviyc0jsucjgy98gjthy from '../assets/yviyc0jsucjgy98gjthy.mp4'
import { getCurrentMockUser, getFriendsForUser } from '../mock/authMock'
import { createSquareThumbDataUrlFromVideoSrc } from '../utils/thumbs'

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

const VolumeOnIcon = () => (
  <Svg>
    <path
      d='M11 5 6 9H2v6h4l5 4V5Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinejoin='round'
    />
    <path
      d='M15.5 8.5a4 4 0 0 1 0 7'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path
      d='M17.8 6.2a7 7 0 0 1 0 11.6'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      opacity='0.75'
    />
  </Svg>
)

const VolumeOffIcon = () => (
  <Svg>
    <path
      d='M11 5 6 9H2v6h4l5 4V5Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinejoin='round'
    />
    <path
      d='M23 9 17 15'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path
      d='M17 9 23 15'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
  </Svg>
)

const HeartIcon = ({ active }) => (
  <Svg>
    <path
      d='M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      opacity={active ? '1' : '0.78'}
    />
  </Svg>
)

const CommentIcon = () => (
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

const ShareIcon = () => (
  <Svg>
    <path
      d='M22 2 11 13'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M22 2 15 22l-4-9-9-4 20-7Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      opacity='0.78'
    />
  </Svg>
)

const clamp01 = (n) => Math.max(0, Math.min(1, n))

const Video = () => {
  const currentUser = useMemo(() => getCurrentMockUser(), [])
  const friends = useMemo(() => getFriendsForUser(currentUser), [currentUser])

  const items = useMemo(() => {
    const fallbackAvatar = friends?.[0]?.avatarFull || friends?.[0]?.avatar
    return [
      {
        id: 'v1',
        src: parrots,
        authorName: friends?.[1]?.name || 'Alex',
        authorAvatar: friends?.[1]?.avatarFull || friends?.[1]?.avatar || fallbackAvatar,
        caption: 'Bright color, clean motion. Swipe slow.',
        tags: ['nature', 'motion'],
      },
      {
        id: 'v2',
        src: river,
        authorName: friends?.[2]?.name || 'Maya',
        authorAvatar: friends?.[2]?.avatarFull || friends?.[2]?.avatar || fallbackAvatar,
        caption: 'Sound off. Let the visuals carry the story.',
        tags: ['calm', 'flow'],
      },
      {
        id: 'v3',
        src: yviyc0jsucjgy98gjthy,
        authorName: friends?.[3]?.name || 'Chris',
        authorAvatar: friends?.[3]?.avatarFull || friends?.[3]?.avatar || fallbackAvatar,
        caption: 'Offrolling + reels feels inevitable.',
        tags: ['hender', 'reels'],
      },
    ]
  }, [friends])

  const wrapRef = useRef(null)
  const videoRefs = useRef(new Map())
  const [activeId, setActiveId] = useState(items[0]?.id || null)
  const [muted, setMuted] = useState(true)
  const [likedById, setLikedById] = useState({})
  const [readyById, setReadyById] = useState({})
  const [progressById, setProgressById] = useState({})

  useEffect(() => {
    setActiveId(items[0]?.id || null)
  }, [items])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver !== 'function') {
      return undefined
    }

    const root = wrapRef.current
    if (!root) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most visible entry as active.
        let best = null
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry
          }
        }
        if (!best) return
        const id = best.target.getAttribute('data-video-id')
        if (id) setActiveId(id)
      },
      { root: null, threshold: [0.35, 0.6, 0.75, 0.9] }
    )

    const cards = root.querySelectorAll('[data-video-id]')
    cards.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [items])

  useEffect(() => {
    // Pause everything except the active video and try to play the active one.
    for (const [id, el] of videoRefs.current.entries()) {
      if (!el) continue
      el.muted = muted
      if (id !== activeId) {
        try {
          el.pause()
        } catch {
          // ignore
        }
      }
    }

    const active = activeId ? videoRefs.current.get(activeId) : null
    if (!active) return

    active.muted = muted
    const play = async () => {
      try {
        await active.play()
      } catch {
        // Autoplay can fail if not muted or due to browser policy.
      }
    }
    play()
  }, [activeId, muted])

  return (
    <section ref={wrapRef} className='no-scrollbar w-full bg-[var(--hx-app-bg)] p-2'>
      <div className='mb-2 flex items-center justify-between'>
        <div>
          <p className='text-sm font-extrabold text-[var(--hx-text)]'>Reels</p>
          <p className='text-xs text-[var(--hx-text-muted)]'>Autoplays in view. Tap to pause.</p>
        </div>
        <button
          type='button'
          aria-label={muted ? 'Unmute' : 'Mute'}
          onClick={() => setMuted((v) => !v)}
          className='flex items-center gap-2 rounded-full border border-[var(--hx-border)] bg-[var(--hx-surface-glass)] px-3 py-2 text-xs font-bold text-[var(--hx-text)] supports-[backdrop-filter]:backdrop-blur-md'
        >
          {muted ? <VolumeOffIcon /> : <VolumeOnIcon />}
          {muted ? 'Muted' : 'Sound'}
        </button>
      </div>

      <div className='space-y-3'>
        {items.map((item) => {
          const isActive = item.id === activeId
          const isReady = !!readyById[item.id]
          const progress = clamp01(Number(progressById[item.id] || 0))
          const liked = !!likedById[item.id]

          return (
            <article
              key={item.id}
              data-video-id={item.id}
              className='relative overflow-hidden rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface)] shadow-sm'
            >
              <div className='relative aspect-[9/14] w-full bg-black'>
                <video
                  ref={(node) => {
                    if (node) videoRefs.current.set(item.id, node)
                    else videoRefs.current.delete(item.id)
                  }}
                  src={item.src}
                  className='h-full w-full object-cover'
                  playsInline
                  preload='metadata'
                  muted={muted}
                  loop
                  onLoadedData={() =>
                    setReadyById((prev) => ({ ...prev, [item.id]: true }))
                  }
                  onTimeUpdate={(e) => {
                    const v = e.currentTarget
                    if (!v || !v.duration || Number.isNaN(v.duration)) return
                    // Only update progress for the active video.
                    if (!isActive) return
                    setProgressById((prev) => ({ ...prev, [item.id]: v.currentTime / v.duration }))
                  }}
                  onClick={async (e) => {
                    const v = e.currentTarget
                    try {
                      if (v.paused) await v.play()
                      else v.pause()
                    } catch {
                      // ignore
                    }
                  }}
                />

                {!isReady ? (
                  <div className='absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(255,255,255,0.06),rgba(255,255,255,0.12),rgba(255,255,255,0.06))]' />
                ) : null}

                <div className='pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(to_top,rgba(0,0,0,0.72),rgba(0,0,0,0))]' />

                <div className='absolute left-3 right-3 top-3 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <img
                      src={item.authorAvatar}
                      alt={item.authorName}
                      className='h-9 w-9 rounded-full border border-white/30 object-cover'
                      loading='lazy'
                      decoding='async'
                    />
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-extrabold text-white'>
                        {item.authorName}
                      </p>
                      <p className='truncate text-[10px] font-semibold text-white/70'>
                        {isActive ? 'Now playing' : 'In feed'}
                      </p>
                    </div>
                  </div>

                  <div className='rounded-full bg-black/35 px-3 py-1 text-[10px] font-bold text-white'>
                    {Math.max(1, Math.round(progress * 100))}%
                  </div>
                </div>

                <div className='absolute bottom-3 left-3 right-16'>
                  <p className='text-sm font-semibold text-white'>{item.caption}</p>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className='rounded-full bg-white/12 px-2 py-1 text-[10px] font-bold text-white/90'
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className='absolute bottom-3 right-3 flex flex-col items-center gap-2'>
                  <button
                    type='button'
                    aria-label='Like'
                    onClick={() => {
                      const next = !liked
                      setLikedById((prev) => ({ ...prev, [item.id]: next }))
                      if (next && typeof window !== 'undefined') {
                        ;(async () => {
                          try {
                            const thumb = await createSquareThumbDataUrlFromVideoSrc({ src: item.src })
                            window.dispatchEvent(
                              new CustomEvent('hender:activity-circle', {
                                detail: {
                                  id: `video-${item.id}-${Date.now()}`,
                                  name: 'Video',
                                  avatar: thumb || item.authorAvatar,
                                  avatarFull: thumb || item.authorAvatar,
                                  badgeIcon: 'video',
                                  activityType: 'video',
                                  videoId: item.id,
                                  createdAt: new Date().toISOString(),
                                  actorName: 'You',
                                  authorName: item.authorName,
                                  caption: item.caption,
                                  videoSrc: item.src,
                                },
                              })
                            )
                          } catch {
                            window.dispatchEvent(
                              new CustomEvent('hender:activity-circle', {
                                detail: {
                                  id: `video-${item.id}-${Date.now()}`,
                                  name: 'Video',
                                  avatar: item.authorAvatar,
                                  avatarFull: item.authorAvatar,
                                  badgeIcon: 'video',
                                  activityType: 'video',
                                  videoId: item.id,
                                  createdAt: new Date().toISOString(),
                                  actorName: 'You',
                                  authorName: item.authorName,
                                  caption: item.caption,
                                  videoSrc: item.src,
                                },
                              })
                            )
                          }
                        })()
                      }
                    }}
                    className={`grid h-11 w-11 place-items-center rounded-full border transition-colors ${
                      liked
                        ? 'border-[rgba(255,255,255,0.35)] bg-[rgba(228,0,110,0.9)] text-white'
                        : 'border-white/20 bg-black/35 text-white'
                    }`}
                  >
                    <HeartIcon active={liked} />
                  </button>

                  <button
                    type='button'
                    aria-label='Comment'
                    onClick={() => {}}
                    className='grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/35 text-white'
                  >
                    <CommentIcon />
                  </button>

                  <button
                    type='button'
                    aria-label='Share'
                    onClick={() => {}}
                    className='grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/35 text-white'
                  >
                    <ShareIcon />
                  </button>
                </div>

                <div className='absolute bottom-0 left-0 right-0 h-1 bg-white/10'>
                  <div
                    className='h-1 bg-[var(--hx-accent)]'
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Video
