import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getCurrentMockUser, getFriendsForUser } from '../mock/authMock'
import { useFeed } from '../context/FeedContext'
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

const SendIcon = () => (
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

const EyeIcon = () => (
  <Svg>
    <path
      d='M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7S2.5 12 2.5 12Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </Svg>
)

const formatShortTime = (iso) => {
  try {
    const dt = new Date(iso)
    if (Number.isNaN(dt.getTime())) return ''
    return dt.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

const PostDetail = () => {
  const navigate = useNavigate()
  const { postId } = useParams()
  const location = useLocation()
  const feed = useFeed()

  const [isLoading, setIsLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [composer, setComposer] = useState('')
  const [comments, setComments] = useState([])
  const [replyDrafts, setReplyDrafts] = useState({})
  const [replyOpen, setReplyOpen] = useState({})

  const postFromState = location.state?.post || null

  const currentUser = useMemo(() => getCurrentMockUser(), [])
  const friends = useMemo(() => getFriendsForUser(currentUser), [currentUser])

  const post = useMemo(() => {
    if (postFromState) {
      return postFromState
    }

    // Fallback if user directly opened /home/post/:id without state.
    return {
      id: postId || 'post',
      authorName: 'ztsambad',
      authorAvatar: friends?.[0]?.avatar,
      text: 'Loading post details from mock data...',
      react: 21,
      comments: 12,
      views: 120,
      postImg: feed.activePostImg || friends?.[0]?.avatarFull || friends?.[0]?.avatar,
    }
  }, [feed.activePostImg, friends, postFromState, postId])

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 450)
    return () => clearTimeout(t)
  }, [postId])

  useEffect(() => {
    // Seed comments with mock friends
    const seed = friends.slice(0, 10).map((friend, idx) => ({
      id: `${post.id}-c${idx + 1}`,
      user: friend,
      text:
        idx % 3 === 0
          ? 'Clean layout. The offrolling feels unique.'
          : idx % 3 === 1
            ? 'This is a solid idea. Keep going.'
            : 'Nice. Add more reactions and a share flow.',
      createdAt: new Date(Date.now() - (idx + 1) * 1000 * 60 * 12).toISOString(),
      replies:
        idx < 3
          ? [
              {
                id: `${post.id}-c${idx + 1}-r1`,
                user: friends[(idx + 3) % friends.length],
                text: 'Agree. The UX is getting sharper.',
                createdAt: new Date(Date.now() - (idx + 1) * 1000 * 60 * 6).toISOString(),
              },
            ]
          : [],
    }))
    setComments(seed)
  }, [friends, post.id])

  const badgeCount = Number(feed.activePostBadgeCount) || 0

  return (
    <section className='relative h-full w-full bg-[var(--hx-app-bg)]'>
      <header className='sticky top-0 z-20 flex h-12 items-center gap-2 border-b border-[var(--hx-border)] bg-[var(--hx-surface)] px-2'>
        <button
          type='button'
          aria-label='Back'
          onClick={() => navigate(-1)}
          className='rounded-full p-2 text-[var(--hx-text)] hover:bg-[var(--hx-surface-2)]'
        >
          <BackIcon />
        </button>
        <div className='min-w-0'>
          <p className='truncate text-sm font-semibold text-[var(--hx-text)]'>Post</p>
          <p className='truncate text-xs text-[var(--hx-text-muted)]'>@{post.authorName || 'user'}</p>
        </div>
      </header>

      <div className='px-2 pb-20 pt-2'>
        {isLoading ? (
          <div className='animate-pulse'>
            <div className='mb-2 h-10 w-2/3 rounded bg-[#f1f1f1]' />
            <div className='mb-2 h-4 w-full rounded bg-[#f1f1f1]' />
            <div className='mb-2 h-4 w-5/6 rounded bg-[#f1f1f1]' />
            <div className='h-[320px] w-full rounded border border-[var(--hx-border)] bg-[#f1f1f1]' />
          </div>
        ) : (
          <>
            <div className='flex items-center gap-2'>
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                className='h-10 w-10 rounded-full border border-[var(--hx-border)] object-cover'
                loading='lazy'
                decoding='async'
              />
              <div className='min-w-0'>
                <p className='truncate text-base font-bold text-[var(--hx-text)]'>{post.authorName}</p>
                <p className='truncate text-xs text-[var(--hx-text-muted)]'>Just now</p>
              </div>
            </div>

            {post.html || post.text ? (
              <div className='mt-2 rounded border border-[var(--hx-border)] bg-[var(--hx-surface)] p-2 text-sm leading-5 text-[var(--hx-text)]'>
                {post.html ? (
                  <div
                    className='hx-rich'
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.html) }}
                  />
                ) : (
                  post.text
                )}
              </div>
            ) : null}

            <div className='relative mt-2 overflow-hidden rounded border border-[var(--hx-border)] bg-[var(--hx-surface-2)]'>
              <img
                src={post.postImg}
                alt='post'
                className='h-[320px] w-full object-cover'
                loading='lazy'
                decoding='async'
              />
              {badgeCount > 0 ? (
                <div className='absolute left-2 top-2 grid h-7 min-w-7 place-items-center rounded-full border border-[var(--hx-surface)] bg-[var(--hx-accent)] px-2 text-xs font-extrabold text-white shadow'>
                  {badgeCount}
                </div>
              ) : null}
            </div>

            <div className='mt-2 flex items-center justify-between rounded border border-[var(--hx-border)] bg-[var(--hx-surface)] px-2 py-1 text-[var(--hx-text)]'>
              <button
                type='button'
                aria-label='Like'
                onClick={() => setLiked((v) => !v)}
                className={`flex items-center gap-1 rounded px-2 py-1 transition-colors ${
                  liked ? 'text-[var(--hx-accent)]' : 'text-[var(--hx-text)]'
                }`}
              >
                <HeartIcon active={liked} />
                <span className='text-xs font-semibold text-[var(--hx-text-muted)]'>
                  {Number(post.react) || 0}
                </span>
              </button>

              <div className='flex items-center gap-1 px-2 py-1 text-[var(--hx-text)]'>
                <CommentIcon />
                <span className='text-xs font-semibold text-[var(--hx-text-muted)]'>
                  {Number(post.comments) || comments.length}
                </span>
              </div>

              <div className='flex items-center gap-1 px-2 py-1 text-[var(--hx-text)]'>
                <EyeIcon />
                <span className='text-xs font-semibold text-[var(--hx-text-muted)]'>
                  {Number(post.views) || 0}
                </span>
              </div>
            </div>

            <div className='mt-3'>
              <p className='text-sm font-bold text-[var(--hx-text)]'>Comments</p>
              <div className='mt-2 space-y-2'>
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className='rounded border border-[var(--hx-border)] bg-[var(--hx-surface)] p-2'
                  >
                    <div className='flex items-start gap-2'>
                      <img
                        src={c.user?.avatar}
                        alt={c.user?.name}
                        className='h-9 w-9 rounded-full border border-[var(--hx-border)] object-cover'
                        loading='lazy'
                        decoding='async'
                      />
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-center justify-between gap-2'>
                          <p className='truncate text-sm font-semibold text-[var(--hx-text)]'>
                            {c.user?.name}
                          </p>
                          <p className='shrink-0 text-[10px] text-[var(--hx-text-muted)]'>
                            {formatShortTime(c.createdAt)}
                          </p>
                        </div>
                        <p className='mt-1 text-sm leading-5 text-[var(--hx-text)]'>{c.text}</p>
                        <div className='mt-2 flex items-center gap-3'>
                          <button
                            type='button'
                            className='text-xs font-semibold text-[var(--hx-accent)]'
                            onClick={() =>
                              setReplyOpen((prev) => ({ ...prev, [c.id]: !prev[c.id] }))
                            }
                          >
                            Reply
                          </button>
                          {c.replies?.length ? (
                            <span className='text-[10px] text-[var(--hx-text-muted)]'>
                              {c.replies.length} repl{c.replies.length === 1 ? 'y' : 'ies'}
                            </span>
                          ) : null}
                        </div>

                        {replyOpen[c.id] ? (
                          <div className='mt-2 flex items-center gap-2'>
                            <input
                              value={replyDrafts[c.id] || ''}
                              onChange={(e) =>
                                setReplyDrafts((prev) => ({ ...prev, [c.id]: e.target.value }))
                              }
                              placeholder='Write a reply...'
                              className='h-9 w-full rounded-full border border-[var(--hx-border)] bg-[var(--hx-surface-2)] px-3 text-xs text-[var(--hx-text)] outline-none placeholder:text-[var(--hx-text-muted)] focus:border-[var(--hx-accent)]'
                            />
                            <button
                              type='button'
                              aria-label='Send reply'
                              disabled={!(replyDrafts[c.id] || '').trim()}
                              onClick={() => {
                                const text = String(replyDrafts[c.id] || '').trim()
                                if (!text) return
                                const me = currentUser || { id: 'me', name: 'You', avatar: friends?.[0]?.avatar }
                                setComments((prev) =>
                                  prev.map((item) =>
                                    item.id === c.id
                                      ? {
                                          ...item,
                                          replies: [
                                            {
                                              id: `${c.id}-r${(item.replies?.length || 0) + 1}`,
                                              user: me,
                                              text,
                                              createdAt: new Date().toISOString(),
                                            },
                                            ...(item.replies || []),
                                          ],
                                        }
                                      : item
                                  )
                                )
                                setReplyDrafts((prev) => ({ ...prev, [c.id]: '' }))
                              }}
                              className='grid h-9 w-9 place-items-center rounded-full bg-[var(--hx-accent)] text-white disabled:opacity-60'
                            >
                              <SendIcon />
                            </button>
                          </div>
                        ) : null}

                        {c.replies?.length ? (
                          <div className='mt-2 space-y-2 pl-4'>
                            {c.replies.map((r) => (
                              <div
                                key={r.id}
                                className='rounded-lg border border-[var(--hx-border)] bg-[var(--hx-surface-2)] p-2'
                              >
                                <div className='flex items-start gap-2'>
                                  <img
                                    src={r.user?.avatar}
                                    alt={r.user?.name}
                                    className='h-8 w-8 rounded-full border border-[var(--hx-border)] object-cover'
                                    loading='lazy'
                                    decoding='async'
                                  />
                                  <div className='min-w-0 flex-1'>
                                    <div className='flex items-center justify-between gap-2'>
                                      <p className='truncate text-xs font-semibold text-[var(--hx-text)]'>
                                        {r.user?.name}
                                      </p>
                                      <p className='shrink-0 text-[10px] text-[var(--hx-text-muted)]'>
                                        {formatShortTime(r.createdAt)}
                                      </p>
                                    </div>
                                    <p className='mt-1 text-xs leading-5 text-[var(--hx-text)]'>{r.text}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className='sticky bottom-0 left-0 right-0 z-30 border-t border-[var(--hx-border)] bg-[var(--hx-surface)] p-2'>
        <div className='flex items-center gap-2'>
          <input
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
            placeholder='Write a comment...'
            className='h-10 w-full rounded-full border border-[var(--hx-border)] bg-[var(--hx-surface-2)] px-4 text-sm text-[var(--hx-text)] outline-none placeholder:text-[var(--hx-text-muted)] focus:border-[var(--hx-accent)]'
          />
          <button
            type='button'
            aria-label='Send'
            disabled={!composer.trim()}
            onClick={() => {
              const text = composer.trim()
              if (!text) return
              const me = currentUser || { id: 'me', name: 'You', avatar: friends?.[0]?.avatar }
              setComments((prev) => [
                {
                  id: `${post.id}-c${prev.length + 1}`,
                  user: me,
                  text,
                  createdAt: new Date().toISOString(),
                },
                ...prev,
              ])
              setComposer('')
            }}
            className='grid h-10 w-10 place-items-center rounded-full bg-[var(--hx-accent)] text-white disabled:cursor-not-allowed disabled:opacity-60'
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </section>
  )
}

export default PostDetail
