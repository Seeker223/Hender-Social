import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Circle from '../components/Circle'
import { getCurrentMockUser, getFriendsForUser } from '../mock/authMock'
import { getMockPosts } from '../mock/postsMock'

const Profile = () => {
  const navigate = useNavigate()
  const currentUser = useMemo(() => getCurrentMockUser(), [])
  const friends = useMemo(() => getFriendsForUser(currentUser), [currentUser])

  const me = useMemo(() => {
    if (currentUser) return currentUser
    return { id: 'me', name: 'You', email: 'you@hender.app' }
  }, [currentUser])

  const profileAvatar = useMemo(() => {
    const first = friends?.[0]
    return first?.avatarFull || first?.avatar || ''
  }, [friends])

  const [tab, setTab] = useState('posts') // posts | media | friends
  const [isLoading, setIsLoading] = useState(true)
  const [bio, setBio] = useState('')
  const [isEditingBio, setIsEditingBio] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 450)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const key = `hx_profile_bio_${me.id}`
    const saved = window.localStorage.getItem(key)
    setBio(saved || 'Building Hender. Offrolling-first social feed.')
  }, [me.id])

  const myPosts = useMemo(() => {
    const all = getMockPosts()
    const name = String(me.name || '').trim()
    if (!name) return []
    return all.filter((p) => String(p.authorName || '').trim() === name)
  }, [me.name])

  const myMedia = useMemo(
    () => myPosts.filter((p) => typeof p.postImg === 'string' && p.postImg.length > 0),
    [myPosts]
  )

  const Stat = ({ label, value }) => (
    <div className='min-w-[72px] rounded-xl border border-[var(--hx-border)] bg-[var(--hx-surface)] px-3 py-2 text-center'>
      <p className='text-base font-extrabold text-[var(--hx-text)]'>{value}</p>
      <p className='text-[11px] font-semibold uppercase tracking-wide text-[var(--hx-text-muted)]'>
        {label}
      </p>
    </div>
  )

  const TabButton = ({ id, label }) => (
    <button
      type='button'
      onClick={() => setTab(id)}
      className={`flex-1 rounded-full px-3 py-2 text-xs font-bold transition-colors ${
        tab === id
          ? 'bg-[var(--hx-accent)] text-white'
          : 'bg-[var(--hx-surface)] text-[var(--hx-text)] hover:bg-[var(--hx-surface-2)]'
      }`}
    >
      {label}
    </button>
  )

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

  const BackIcon = () => (
    <Svg>
      <path
        d='M15 18 9 12l6-6'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  )

  const SettingsIcon = () => (
    <Svg>
      <path
        d='M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z'
        stroke='currentColor'
        strokeWidth='2'
      />
      <path
        d='M19.4 15a7.8 7.8 0 0 0 .1-1 7.8 7.8 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7.6 7.6 0 0 0-1.7-1l-.3-2.6H11l-.3 2.6a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a7.8 7.8 0 0 0-.1 1 7.8 7.8 0 0 0 .1 1l-2 1.5 2 3.5 2.4-1a7.6 7.6 0 0 0 1.7 1l.3 2.6h4l.3-2.6a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5Z'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinejoin='round'
        strokeLinecap='round'
        opacity='0.9'
      />
    </Svg>
  )

  return (
    <section className='h-full w-full bg-[var(--hx-app-bg)]'>
      <header className='sticky top-0 z-30 flex h-12 items-center justify-between border-b border-[var(--hx-border)] bg-[var(--hx-surface-glass)] px-2 text-[var(--hx-text)] supports-[backdrop-filter]:backdrop-blur-md'>
        <button
          type='button'
          aria-label='Back'
          onClick={() => navigate(-1)}
          className='rounded-full p-2 hover:bg-[var(--hx-surface-2)]'
        >
          <BackIcon />
        </button>
        <p className='text-sm font-semibold'>Profile</p>
        <button
          type='button'
          aria-label='Settings'
          onClick={() => {}}
          className='rounded-full p-2 hover:bg-[var(--hx-surface-2)]'
        >
          <SettingsIcon />
        </button>
      </header>

      <div className='p-2'>
        <div className='relative overflow-hidden rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface)]'>
          <div className='h-24 bg-[radial-gradient(420px_circle_at_20%_0%,rgba(228,0,110,0.22),rgba(0,0,0,0)_55%),radial-gradient(380px_circle_at_90%_30%,rgba(0,0,0,0.08),rgba(0,0,0,0)_60%),linear-gradient(135deg,var(--hx-surface-2),var(--hx-surface))]' />
          <div className='-mt-10 flex items-end justify-between gap-3 px-3 pb-3'>
            <div className='flex items-end gap-3'>
              <div className='h-20 w-20 rounded-full border border-[var(--hx-border)] bg-[var(--hx-surface)] p-1 shadow'>
                {profileAvatar ? (
                  <img
                    src={profileAvatar}
                    alt={me.name}
                    className='h-full w-full rounded-full object-cover'
                    loading='lazy'
                    decoding='async'
                  />
                ) : (
                  <div className='h-full w-full animate-pulse rounded-full bg-[var(--hx-surface-2)]' />
                )}
              </div>
              <div className='pb-1'>
                <p className='text-lg font-extrabold leading-tight text-[var(--hx-text)]'>
                  {me.name || 'You'}
                </p>
                <p className='text-xs font-semibold text-[var(--hx-text-muted)]'>
                  @{String(me.email || 'user').split('@')[0]}
                </p>
              </div>
            </div>

            <button
              type='button'
              onClick={() => navigate('/home/post')}
              className='rounded-full bg-[var(--hx-accent)] px-4 py-2 text-xs font-extrabold text-white shadow hover:opacity-95'
            >
              Create Post
            </button>
          </div>

          <div className='px-3 pb-3'>
            {isLoading ? (
              <div className='h-10 w-full animate-pulse rounded-xl bg-[var(--hx-surface-2)]' />
            ) : isEditingBio ? (
              <div className='flex items-center gap-2'>
                <input
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className='h-10 w-full rounded-xl border border-[var(--hx-border)] bg-[var(--hx-surface-2)] px-3 text-sm text-[var(--hx-text)] outline-none focus:border-[var(--hx-accent)]'
                  placeholder='Write a short bio...'
                />
                <button
                  type='button'
                  className='rounded-xl bg-[var(--hx-accent)] px-3 py-2 text-xs font-extrabold text-white'
                  onClick={() => {
                    setIsEditingBio(false)
                    if (typeof window !== 'undefined') {
                      window.localStorage.setItem(`hx_profile_bio_${me.id}`, bio)
                    }
                  }}
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                type='button'
                onClick={() => setIsEditingBio(true)}
                className='w-full rounded-xl border border-[var(--hx-border)] bg-[var(--hx-surface)] px-3 py-2 text-left text-sm text-[var(--hx-text)] hover:bg-[var(--hx-surface-2)]'
              >
                <span className='block font-semibold'>Bio</span>
                <span className='block text-[13px] text-[var(--hx-text-muted)]'>{bio}</span>
              </button>
            )}

            <div className='mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar'>
              <Stat label='Posts' value={String(myPosts.length)} />
              <Stat label='Media' value={String(myMedia.length)} />
              <Stat label='Friends' value={String(friends.length)} />
            </div>
          </div>
        </div>

        <div className='mt-3 rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface)] p-2'>
          <div className='flex items-center gap-2 rounded-full bg-[var(--hx-surface-2)] p-1'>
            <TabButton id='posts' label='Posts' />
            <TabButton id='media' label='Media' />
            <TabButton id='friends' label='Friends' />
          </div>

          <div className='mt-2'>
            {tab === 'posts' ? (
              <div className='space-y-2'>
                {myPosts.length === 0 ? (
                  <div className='rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface-2)] p-4 text-center'>
                    <p className='text-sm font-bold text-[var(--hx-text)]'>No posts yet</p>
                    <p className='mt-1 text-xs text-[var(--hx-text-muted)]'>
                      Create your first post to see it here.
                    </p>
                    <button
                      type='button'
                      onClick={() => navigate('/home/post')}
                      className='mt-3 rounded-full bg-[var(--hx-accent)] px-4 py-2 text-xs font-extrabold text-white'
                    >
                      Create Post
                    </button>
                  </div>
                ) : (
                  myPosts.slice(0, 8).map((p) => (
                    <button
                      key={p.id}
                      type='button'
                      onClick={() => navigate(`/home/post/${p.id}`, { state: { post: p } })}
                      className='w-full overflow-hidden rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface)] text-left hover:bg-[var(--hx-surface-2)]'
                    >
                      <div className='flex items-start gap-3 p-3'>
                        <div className='min-w-0 flex-1'>
                          <p className='text-sm font-extrabold text-[var(--hx-text)]'>Post</p>
                          <p className='mt-1 line-clamp-2 text-sm text-[var(--hx-text-muted)]'>
                            {p.text || 'Media post'}
                          </p>
                          <div className='mt-2 flex items-center gap-3 text-[11px] font-semibold text-[var(--hx-text-muted)]'>
                            <span>{Number(p.react) || 0} likes</span>
                            <span>{Number(p.comments) || 0} comments</span>
                            <span>{Number(p.views) || 0} views</span>
                          </div>
                        </div>
                        <div className='h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[var(--hx-border)] bg-[var(--hx-surface-2)]'>
                          <img
                            src={p.postImg}
                            alt='media'
                            className='h-full w-full object-cover'
                            loading='lazy'
                            decoding='async'
                          />
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            ) : null}

            {tab === 'media' ? (
              <div className='grid grid-cols-3 gap-2'>
                {myMedia.length === 0 ? (
                  <div className='col-span-3 rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface-2)] p-4 text-center'>
                    <p className='text-sm font-bold text-[var(--hx-text)]'>No media yet</p>
                    <p className='mt-1 text-xs text-[var(--hx-text-muted)]'>Post a photo to start your grid.</p>
                  </div>
                ) : (
                  myMedia.slice(0, 24).map((p) => (
                    <button
                      key={p.id}
                      type='button'
                      onClick={() => navigate(`/home/post/${p.id}`, { state: { post: p } })}
                      className='aspect-square overflow-hidden rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface-2)]'
                    >
                      <img
                        src={p.postImg}
                        alt='media'
                        className='h-full w-full object-cover'
                        loading='lazy'
                        decoding='async'
                      />
                    </button>
                  ))
                )}
              </div>
            ) : null}

            {tab === 'friends' ? (
              <div className='space-y-2'>
                {friends.slice(0, 18).map((f) => (
                  <button
                    key={f.id}
                    type='button'
                    onClick={() => {}}
                    className='flex w-full items-center justify-between gap-3 rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface)] px-3 py-2 text-left hover:bg-[var(--hx-surface-2)]'
                  >
                    <div className='flex items-center gap-3'>
                      <Circle
                        size='h-11 w-11'
                        src={f.avatar}
                        name={f.name}
                        showBadge
                        badgeKey={f.id}
                      />
                      <div className='min-w-0'>
                        <p className='truncate text-sm font-bold text-[var(--hx-text)]'>{f.name}</p>
                        <p className='truncate text-xs text-[var(--hx-text-muted)]'>Friend</p>
                      </div>
                    </div>
                    <span className='rounded-full border border-[var(--hx-border)] bg-[var(--hx-surface)] px-3 py-1 text-[11px] font-bold text-[var(--hx-text)]'>
                      View
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile
