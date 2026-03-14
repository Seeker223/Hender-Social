import React from 'react'
import { sanitizeHtml } from '../utils/sanitizeHtml'

const Post = (props) => {
  const [liked, setLiked] = React.useState(false)
  const [disliked, setDisliked] = React.useState(false)
  const [reXended, setReXended] = React.useState(false)
  const canOpen = typeof props.onOpen === 'function'

  const likeCount = Number.isFinite(Number(props.react)) ? Number(props.react) : 0
  const commentCount = Number.isFinite(Number(props.comments)) ? Number(props.comments) : 0
  const viewCount = Number.isFinite(Number(props.views)) ? Number(props.views) : 0

  const IconButton = ({ active, label, onClick, children }) => (
    <button
      type='button'
      aria-label={label}
      onClick={onClick}
      className={`flex items-center gap-1 rounded p-1 transition-colors ${
        active ? 'text-[var(--hx-accent)]' : 'text-[var(--hx-text)]'
      }`}
    >
      {children}
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

  const ReXendIcon = ({ active }) => (
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
        opacity={active ? '1' : '0.65'}
      />
    </Svg>
  )

  // Instagram-like outline icons (rounded caps/joins, minimal strokes)
  const LikeIcon = ({ active }) => (
    <Svg>
      <path
        d='M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3v11Z'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        opacity={active ? '1' : '0.75'}
      />
      <path
        d='M7 11l4.5-8.2a2 2 0 0 1 3.8.9V11h3.7a2 2 0 0 1 2 2.3l-1 6.7A3 3 0 0 1 20.1 22H7'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        opacity={active ? '1' : '0.75'}
      />
    </Svg>
  )

  const DislikeIcon = ({ active }) => (
    <Svg>
      <path
        d='M7 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3V2Z'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        opacity={active ? '1' : '0.75'}
      />
      <path
        d='M7 13l4.5 8.2a2 2 0 0 0 3.8-.9V13h3.7a2 2 0 0 0 2-2.3l-1-6.7A3 3 0 0 0 20.1 2H7'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        opacity={active ? '1' : '0.75'}
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

  return (
    <article className='w-full border-b border-[var(--hx-border)] bg-[var(--hx-surface)] pb-2'>
      <div className='flex items-center gap-2 px-1 py-1'>
        <div className='h-10 w-10 rounded-full border border-[var(--hx-border)]'>
          <img
            src={props.img}
            className='h-full w-full rounded-full object-cover'
            alt='profile'
            loading="lazy"
            decoding="async"
          />
        </div>
        <p className='text-[27px] font-bold leading-none text-[var(--hx-accent)]'>hh</p>
        <p className='text-base font-semibold text-[var(--hx-text)]'>{props.name}</p>
      </div>

      <div className='mx-1 mb-1 rounded border border-[var(--hx-border)] bg-[var(--hx-surface)] px-2 py-1 text-sm leading-5 text-[var(--hx-text)]'>
        {props.html ? (
          <div
            className='hx-rich'
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(props.html) }}
          />
        ) : (
          props.text
        )}
      </div>

      <div className='relative mx-1 overflow-hidden border border-[var(--hx-border)] bg-[var(--hx-surface-2)]'>
        <img
          src={props.postImg ?? props.img}
          className={`h-[240px] w-full object-cover ${canOpen ? 'cursor-pointer' : ''}`}
          alt='post'
          loading="lazy"
          decoding="async"
          onClick={() => props.onOpen?.()}
        />
        {Number.isFinite(Number(props.badgeCount)) && Number(props.badgeCount) > 0 ? (
          <div className='absolute left-2 top-2 grid h-7 min-w-7 place-items-center rounded-full border border-[var(--hx-surface)] bg-[var(--hx-accent)] px-2 text-xs font-extrabold text-white shadow'>
            {Number(props.badgeCount)}
          </div>
        ) : null}
      </div>

      <p className='px-1 pt-1 text-lg font-bold leading-6 text-[var(--hx-text)]'>
        you and {props.react} reacted
      </p>

      <div className='mx-1 mt-2 flex items-center justify-between text-[var(--hx-text)]'>
        <IconButton
          active={reXended}
          label='Re-xend'
          onClick={() => setReXended((v) => !v)}
        >
          <ReXendIcon active={reXended} />
        </IconButton>

        <IconButton
          active={liked}
          label='Like'
          onClick={() => {
            setLiked((v) => !v)
            setDisliked(false)
          }}
        >
          <LikeIcon active={liked} />
          <span className='text-xs font-semibold text-[var(--hx-text-muted)]'>{likeCount}</span>
        </IconButton>

        <IconButton
          active={disliked}
          label='Dislike'
          onClick={() => {
            setDisliked((v) => !v)
            setLiked(false)
          }}
        >
          <DislikeIcon active={disliked} />
        </IconButton>

        <IconButton active={false} label='Comments' onClick={() => props.onOpen?.()}>
          <CommentIcon />
          <span className='text-xs font-semibold text-[var(--hx-text-muted)]'>{commentCount}</span>
        </IconButton>

        <div className='flex items-center gap-1 p-1 text-[var(--hx-text)]'>
          <EyeIcon />
          <span className='text-xs font-semibold text-[var(--hx-text-muted)]'>{viewCount}</span>
        </div>
      </div>

      <p className='px-1 text-lg leading-6 text-[var(--hx-text)]'>Post-most-comment</p>
    </article>
  )
}

export default Post
