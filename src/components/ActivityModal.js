import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMockPosts } from '../mock/postsMock'
import { getPostComments } from '../mock/commentsMock'
import { getThread } from '../mock/chatMock'
import { sanitizeHtml } from '../utils/sanitizeHtml'

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

const iconFor = (kind) => {
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
          d='M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinejoin='round'
        />
        <path
          d='M7 18h6'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
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
  if (kind === 'post') {
    return (
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
  }
  if (kind === 'emoji') {
    return (
      <Svg>
        <path
          d='M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z'
          stroke='currentColor'
          strokeWidth='2'
        />
        <path
          d='M9 10h.01M15 10h.01'
          stroke='currentColor'
          strokeWidth='3'
          strokeLinecap='round'
        />
        <path
          d='M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
        />
      </Svg>
    )
  }
  return null
}

const formatTime = (iso) => {
  try {
    const dt = new Date(iso)
    if (Number.isNaN(dt.getTime())) return ''
    return dt.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

const ActivityModal = ({ isOpen, activity, onClose }) => {
  const navigate = useNavigate()

  const kind = activity?.activityType || activity?.badgeIcon || ''
  const createdAt = activity?.createdAt || ''

  const post = useMemo(() => {
    if (!activity?.postId) return null
    return getMockPosts().find((p) => p.id === activity.postId) || null
  }, [activity?.postId])

  const storedComments = useMemo(() => {
    if (!activity?.postId) return []
    return getPostComments(activity.postId)
  }, [activity?.postId])

  const thread = useMemo(() => {
    if (!activity?.friendId) return null
    return getThread(activity.friendId)
  }, [activity?.friendId])

  const title = useMemo(() => {
    if (kind === 'chat') return 'New Chat'
    if (kind === 'comment') return 'New Comment'
    if (kind === 'reaction') return 'New Reaction'
    if (kind === 'video') return 'Video Activity'
    if (kind === 'post') return 'New Post'
    if (kind === 'emoji') return 'Emoji'
    return 'Activity'
  }, [kind])

  const narrative = useMemo(() => {
    const actor = activity?.actorName || 'You'
    if (kind === 'reaction') {
      const who = activity?.targetAuthorName ? `${activity.targetAuthorName}'s post` : 'a post'
      return `${actor} reacted to ${who}.`
    }
    if (kind === 'comment') {
      const who = activity?.targetAuthorName ? `${activity.targetAuthorName}'s post` : 'a post'
      return `${actor} commented on ${who}.`
    }
    if (kind === 'post') {
      return `${actor} created a new post.`
    }
    if (kind === 'chat') {
      const to = activity?.friendName ? ` to ${activity.friendName}` : ''
      return `${actor} sent a message${to}.`
    }
    if (kind === 'video') {
      const who = activity?.authorName ? ` on ${activity.authorName}'s video` : ' on a video'
      return `${actor} interacted${who}.`
    }
    if (kind === 'emoji') {
      return `${actor} used ${activity?.emoji || 'an emoji'}.`
    }
    return 'This item was generated by your activity feed.'
  }, [activity, kind])

  const hint = useMemo(() => {
    if (kind === 'chat') return 'A message was sent. Jump back into the thread.'
    if (kind === 'comment') return 'A comment was added. Open the post to view the thread.'
    if (kind === 'reaction') return 'A reaction was made. Open the post to see details.'
    if (kind === 'video') return 'A video interaction happened. Open reels to continue.'
    if (kind === 'post') return 'A new post was created. Open it to view.'
    if (kind === 'emoji') return 'Your most recent emoji is pinned to the top row.'
    return 'This item was generated by your activity feed.'
  }, [kind])

  useEffect(() => {
    if (!isOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen || !activity) return null

  const PostCard = ({ item }) => {
    if (!item) {
      return (
        <div className='rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface-2)] p-3 text-sm text-[var(--hx-text-muted)]'>
          Post data not available.
        </div>
      )
    }

    return (
      <div className='overflow-hidden rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface)]'>
        <div className='flex items-center justify-between gap-2 border-b border-[var(--hx-border)] bg-[var(--hx-surface-glass)] px-3 py-2 supports-[backdrop-filter]:backdrop-blur-md'>
          <div className='min-w-0'>
            <p className='truncate text-sm font-extrabold text-[var(--hx-text)]'>{item.authorName}</p>
            <p className='truncate text-[10px] font-semibold text-[var(--hx-text-muted)]'>
              {item.createdAt ? formatTime(item.createdAt) : ''}
            </p>
          </div>
          <div className='rounded-full border border-[var(--hx-border)] bg-[var(--hx-surface)] px-2 py-1 text-[10px] font-extrabold text-[var(--hx-text)]'>
            {Number(item.react) || 0} likes
          </div>
        </div>
        <div className='p-3'>
          {item.html ? (
            <div
              className='hx-rich text-sm leading-6 text-[var(--hx-text)]'
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.html) }}
            />
          ) : item.text ? (
            <p className='text-sm leading-6 text-[var(--hx-text)]'>{item.text}</p>
          ) : (
            <p className='text-sm text-[var(--hx-text-muted)]'>No text.</p>
          )}
        </div>
        {item.postImg ? (
          <div className='border-t border-[var(--hx-border)] bg-[var(--hx-surface-2)]'>
            <img
              src={item.postImg}
              alt='post'
              className='h-56 w-full object-cover'
              loading='lazy'
              decoding='async'
            />
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div
      className='fixed inset-0 z-[1100] flex items-center justify-center bg-black/55 p-4'
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.()
      }}
    >
      <div className='flex max-h-[85dvh] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface)] shadow-xl'>
        <div className='flex items-start justify-between gap-3 border-b border-[var(--hx-border)] bg-[var(--hx-surface-glass)] p-4 supports-[backdrop-filter]:backdrop-blur-md'>
          <div className='flex items-start gap-3'>
            <div className='grid h-10 w-10 place-items-center rounded-full border border-[var(--hx-border)] bg-[var(--hx-surface)] text-[var(--hx-text)]'>
              {iconFor(kind)}
            </div>
            <div className='min-w-0'>
              <p className='truncate text-base font-extrabold text-[var(--hx-text)]'>{title}</p>
              <p className='truncate text-xs text-[var(--hx-text-muted)]'>
                {createdAt ? formatTime(createdAt) : ''}
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => onClose?.()}
            className='rounded-full border border-[var(--hx-border)] bg-[var(--hx-surface)] px-3 py-1.5 text-xs font-bold text-[var(--hx-text)] hover:bg-[var(--hx-surface-2)]'
          >
            Close
          </button>
        </div>

        <div className='no-scrollbar overflow-y-auto p-4'>
          <p className='text-sm font-semibold text-[var(--hx-text)]'>{narrative}</p>
          <p className='mt-1 text-sm text-[var(--hx-text-muted)]'>{hint}</p>

          {kind === 'post' ? (
            <div className='mt-3'>
              <PostCard item={post} />
            </div>
          ) : null}

          {kind === 'emoji' ? (
            <div className='mt-3 space-y-3'>
              <div className='grid place-items-center rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface-2)] p-6'>
                <div className='text-[56px] leading-none'>{activity.emoji || '✨'}</div>
                <p className='mt-3 text-sm font-semibold text-[var(--hx-text)]'>
                  {activity.actorName || 'You'}
                </p>
                <p className='mt-1 text-xs text-[var(--hx-text-muted)]'>
                  Last used emoji
                </p>
              </div>
            </div>
          ) : null}

          {kind === 'reaction' ? (
            <div className='mt-3 space-y-3'>
              <div className='rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface-2)] p-3'>
                <p className='text-xs font-extrabold text-[var(--hx-text)]'>Reaction Details</p>
                <p className='mt-1 text-sm text-[var(--hx-text)]'>
                  <span className='font-bold'>{activity.actorName || 'You'}</span>{' '}
                  reacted to{' '}
                  <span className='font-bold'>
                    {activity.targetAuthorName ? `${activity.targetAuthorName}'s post` : 'a post'}
                  </span>
                  .
                </p>
              </div>
              <PostCard item={post} />
            </div>
          ) : null}

          {kind === 'comment' ? (
            <div className='mt-3 space-y-3'>
              <div className='rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface-2)] p-3'>
                <p className='text-xs font-extrabold text-[var(--hx-text)]'>Comment</p>
                {activity.commentAudioSrc ? (
                  <audio controls src={activity.commentAudioSrc} className='mt-2 w-full' />
                ) : null}
                <p className='mt-1 whitespace-pre-wrap break-words text-sm text-[var(--hx-text)]'>
                  {activity.commentText || 'Comment text not available.'}
                </p>
                {activity.parentCommentId ? (
                  <p className='mt-2 text-[11px] font-semibold text-[var(--hx-text-muted)]'>
                    Replying to: {activity.parentCommentId}
                  </p>
                ) : null}
              </div>

              {storedComments.length ? (
                <div className='rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface)]'>
                  <div className='border-b border-[var(--hx-border)] bg-[var(--hx-surface-glass)] px-3 py-2 supports-[backdrop-filter]:backdrop-blur-md'>
                    <p className='text-xs font-extrabold text-[var(--hx-text)]'>Recent Comments</p>
                    <p className='text-[10px] font-semibold text-[var(--hx-text-muted)]'>
                      Stored locally for mock activity
                    </p>
                  </div>
                  <div className='max-h-48 overflow-auto p-3 no-scrollbar'>
                    <div className='space-y-2'>
                      {storedComments.slice(0, 8).map((c) => (
                        <div
                          key={c.id}
                          className='rounded-xl border border-[var(--hx-border)] bg-[var(--hx-surface-2)] p-2'
                        >
                          <div className='flex items-center justify-between gap-2'>
                            <p className='truncate text-[11px] font-extrabold text-[var(--hx-text)]'>
                              {c.authorName || 'User'}
                            </p>
                            <p className='shrink-0 text-[10px] font-semibold text-[var(--hx-text-muted)]'>
                              {c.createdAt ? formatTime(c.createdAt) : ''}
                            </p>
                          </div>
                          {c.audioSrc ? (
                            <audio controls src={c.audioSrc} className='mt-2 w-full' />
                          ) : null}
                          {c.text ? (
                            <p className='mt-1 text-xs leading-5 text-[var(--hx-text)]'>{c.text}</p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              <PostCard item={post} />
            </div>
          ) : null}

          {kind === 'chat' ? (
            <div className='mt-3 space-y-3'>
              <div className='rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface-2)] p-3'>
                <p className='text-xs font-extrabold text-[var(--hx-text)]'>Message</p>
                <p className='mt-1 text-sm text-[var(--hx-text)]'>
                  To: <span className='font-bold'>{activity.friendName || activity.friendId || 'Friend'}</span>
                </p>
                {activity.messageAudioSrc ? (
                  <audio controls src={activity.messageAudioSrc} className='mt-2 w-full' />
                ) : null}
                <p className='mt-2 whitespace-pre-wrap break-words rounded-xl border border-[var(--hx-border)] bg-[var(--hx-surface)] p-2 text-sm text-[var(--hx-text)]'>
                  {activity.messageText || 'Message text not available.'}
                </p>
              </div>

              {thread?.messages?.length ? (
                <div className='rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface)]'>
                  <div className='border-b border-[var(--hx-border)] bg-[var(--hx-surface-glass)] px-3 py-2 supports-[backdrop-filter]:backdrop-blur-md'>
                    <p className='text-xs font-extrabold text-[var(--hx-text)]'>Thread Preview</p>
                  </div>
                  <div className='max-h-48 overflow-auto p-3 no-scrollbar'>
                    <div className='space-y-2'>
                      {thread.messages.slice(-6).map((m) => (
                        <div
                          key={m.id}
                          className={`rounded-xl border p-2 text-xs leading-5 ${
                            m.from === 'me'
                              ? 'border-[rgba(228,0,110,0.35)] bg-[var(--hx-accent-bg)] text-[var(--hx-text)]'
                              : 'border-[var(--hx-border)] bg-[var(--hx-surface-2)] text-[var(--hx-text)]'
                          }`}
                        >
                          <p className='whitespace-pre-wrap break-words'>{m.text}</p>
                          <p className='mt-1 text-[10px] font-semibold text-[var(--hx-text-muted)]'>
                            {m.createdAt ? formatTime(m.createdAt) : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {kind === 'video' ? (
            <div className='mt-3 space-y-3'>
              <div className='rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface-2)] p-3'>
                <p className='text-xs font-extrabold text-[var(--hx-text)]'>Video</p>
                <p className='mt-1 text-sm text-[var(--hx-text)]'>
                  Author: <span className='font-bold'>{activity.authorName || 'Unknown'}</span>
                </p>
                {activity.caption ? (
                  <p className='mt-1 text-sm text-[var(--hx-text-muted)]'>{activity.caption}</p>
                ) : null}
              </div>

              {activity.videoSrc ? (
                <div className='overflow-hidden rounded-2xl border border-[var(--hx-border)] bg-black'>
                  <video
                    src={activity.videoSrc}
                    className='h-64 w-full object-cover'
                    controls
                    playsInline
                    preload='metadata'
                  />
                </div>
              ) : (
                <div className='rounded-2xl border border-[var(--hx-border)] bg-[var(--hx-surface-2)] p-3 text-sm text-[var(--hx-text-muted)]'>
                  Video source not available.
                </div>
              )}
            </div>
          ) : null}

          <div className='mt-4 flex flex-wrap items-center justify-end gap-2'>
            {kind === 'chat' && activity.friendId ? (
              <button
                type='button'
                onClick={() => {
                  onClose?.()
                  navigate(`/home/${activity.friendId}`)
                }}
                className='rounded-full border border-[var(--hx-border)] bg-[var(--hx-surface)] px-4 py-2 text-xs font-extrabold text-[var(--hx-text)] hover:bg-[var(--hx-surface-2)]'
              >
                Open Chat
              </button>
            ) : null}

            {(kind === 'reaction' || kind === 'comment' || kind === 'post') && activity.postId ? (
              <button
                type='button'
                onClick={() => {
                  onClose?.()
                  navigate(`/home/post/${activity.postId}`, { state: { post } })
                }}
                className='rounded-full border border-[var(--hx-border)] bg-[var(--hx-surface)] px-4 py-2 text-xs font-extrabold text-[var(--hx-text)] hover:bg-[var(--hx-surface-2)]'
              >
                Open Post
              </button>
            ) : null}

            {kind === 'video' ? (
              <button
                type='button'
                onClick={() => {
                  onClose?.()
                  navigate('/home/video')
                }}
                className='rounded-full border border-[var(--hx-border)] bg-[var(--hx-surface)] px-4 py-2 text-xs font-extrabold text-[var(--hx-text)] hover:bg-[var(--hx-surface-2)]'
              >
                Open Reels
              </button>
            ) : null}

            <button
              type='button'
              onClick={() => onClose?.()}
              className='rounded-full bg-[var(--hx-accent)] px-4 py-2 text-xs font-extrabold text-white'
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityModal
