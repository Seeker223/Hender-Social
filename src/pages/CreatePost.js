import React, { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentMockUser, getFriendsForUser } from '../mock/authMock'
import { addMockPost } from '../mock/postsMock'
import { sanitizeHtml } from '../utils/sanitizeHtml'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { emojiToDataUrl } from '../utils/emojiThumb'
import { NAIRALAND_GREEN_EMOJIS, NAIRALAND_GREEN_FACE_EMOJIS } from '../utils/emojiSets'

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

const ImageIcon = () => (
  <Svg>
    <path
      d='M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinejoin='round'
    />
    <path
      d='M8.5 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinejoin='round'
    />
    <path
      d='M21 15l-5-5L5 21'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </Svg>
)

const compressImageToJpegDataUrl = async (file) => {
  const bitmap = await createImageBitmap(file)
  const maxDim = 1080
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
  const w = Math.max(1, Math.round(bitmap.width * scale))
  const h = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { alpha: false })
  ctx.drawImage(bitmap, 0, 0, w, h)

  // Progressive quality fallback: try to stay under ~450KB (keeps localStorage reasonable).
  const targetBytes = 450 * 1024
  const qualities = [0.82, 0.75, 0.68, 0.6, 0.52]
  for (const q of qualities) {
    const dataUrl = canvas.toDataURL('image/jpeg', q)
    const bytes = Math.ceil((dataUrl.length * 3) / 4) // approximate base64 bytes
    if (bytes <= targetBytes) {
      return dataUrl
    }
  }

  return canvas.toDataURL('image/jpeg', 0.5)
}

const createCircleThumbFromJpegDataUrl = async (jpegDataUrl) => {
  const res = await fetch(jpegDataUrl)
  const blob = await res.blob()
  const bitmap = await createImageBitmap(blob)

  const size = 96
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { alpha: false })

  // Cover-crop to a square thumbnail.
  const side = Math.min(bitmap.width, bitmap.height)
  const sx = Math.max(0, Math.floor((bitmap.width - side) / 2))
  const sy = Math.max(0, Math.floor((bitmap.height - side) / 2))
  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, size, size)

  // Keep this tiny for fast offrolling.
  return canvas.toDataURL('image/jpeg', 0.6)
}

const stripTextFromHtml = (html) => {
  if (typeof html !== 'string') return ''
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  }
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim()
}

const CreatePost = () => {
  const navigate = useNavigate()
  const currentUser = useMemo(() => getCurrentMockUser(), [])
  const friends = useMemo(() => getFriendsForUser(currentUser), [currentUser])
  const me = currentUser || { id: 'me', name: 'You', avatar: friends?.[0]?.avatar }

  const fileInputRef = useRef(null)
  const [html, setHtml] = useState('')
  const [mediaDataUrls, setMediaDataUrls] = useState([])
  const [isCompressing, setIsCompressing] = useState(false)
  const [isEmojiOpen, setIsEmojiOpen] = useState(false)
  const [error, setError] = useState('')

  const plainText = useMemo(() => stripTextFromHtml(html), [html])
  const canPost = plainText.trim().length > 0 || mediaDataUrls.length > 0
  const safeHtml = useMemo(() => sanitizeHtml(html), [html])

  const insertEmoji = (emoji) => {
    editor?.chain().focus().insertContent(emoji).run()
    if (typeof window !== 'undefined') {
      const emojiImg = emojiToDataUrl(emoji, 512)
      const circle = {
        id: `emoji-${me.id || 'me'}-${Date.now()}`,
        name: me.name || 'You',
        emoji,
        avatar: emojiImg,
        avatarFull: emojiImg,
        activityType: 'emoji',
        createdAt: new Date().toISOString(),
        actorName: me.name || 'You',
      }
      window.localStorage.setItem('hender_last_emoji_circle', JSON.stringify(circle))
      window.dispatchEvent(new CustomEvent('hender:emoji-circle', { detail: circle }))
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Placeholder.configure({
        placeholder: "What's happening?",
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class:
          'min-h-[120px] px-3 py-3 text-sm leading-6 outline-none hx-rich',
      },
    },
    onUpdate: ({ editor: ed }) => {
      setHtml(ed.getHTML())
    },
  })

  const ToolbarButton = ({ active, disabled, onClick, children, label }) => (
    <button
      type='button'
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? 'border-[rgba(228,0,110,0.35)] bg-[var(--hx-accent-bg)] text-[var(--hx-accent)]'
          : 'border-[var(--hx-border)] bg-[var(--hx-surface)] text-[var(--hx-text)] hover:bg-[var(--hx-surface-2)]'
      } disabled:opacity-60`}
    >
      {children}
    </button>
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
        <p className='text-sm font-semibold'>Create Post</p>
        <button
          type='button'
          disabled={!canPost || isCompressing}
          onClick={async () => {
            setError('')
            try {
              const now = new Date().toISOString()
              const id = `u-${Date.now()}`
              const post = {
                id,
                authorName: me.name || 'You',
                authorAvatar: me.avatar,
                text: plainText.trim(),
                html: safeHtml,
                react: 0,
                comments: 0,
                views: 0,
                postImg: mediaDataUrls[0] || me.avatar,
                media: mediaDataUrls,
                createdAt: now,
              }
              addMockPost(post)

              // If the post has media, surface it immediately in Top circles (unshift).
                if (mediaDataUrls[0] && typeof window !== 'undefined') {
                  const thumb = await createCircleThumbFromJpegDataUrl(mediaDataUrls[0])
                  const circle = {
                    id: `post-${id}`,
                    name: me.name || 'You',
                    avatar: thumb,
                    avatarFull: mediaDataUrls[0],
                    badgeIcon: 'post',
                    activityType: 'post',
                    postId: post.id,
                    createdAt: now,
                    actorName: me.name || 'You',
                  }
                  window.localStorage.setItem('hender_last_post_circle', JSON.stringify(circle))
                  window.dispatchEvent(new CustomEvent('hender:new-post-circle', { detail: circle }))
                }

              navigate('/home/left')
            } catch (e) {
              setError('Could not create post. Try removing the image and posting text only.')
            }
          }}
          className='rounded-full bg-[var(--hx-accent)] px-4 py-1.5 text-sm font-bold text-white disabled:opacity-60'
        >
          Post
        </button>
      </header>

      <div className='p-2'>
        <div className='rounded-xl border border-[var(--hx-border)] bg-[var(--hx-surface)] p-2'>
          <div className='flex items-center gap-2'>
            <img
              src={me.avatar}
              alt={me.name}
              className='h-10 w-10 rounded-full border border-[var(--hx-border)] object-cover'
              loading='lazy'
              decoding='async'
            />
            <div className='min-w-0'>
              <p className='truncate text-sm font-semibold text-[var(--hx-text)]'>{me.name || 'You'}</p>
              <p className='truncate text-xs text-[var(--hx-text-muted)]'>Public</p>
            </div>
          </div>

          <div className='mt-2 overflow-hidden rounded-lg border border-[var(--hx-border)] bg-[var(--hx-surface-2)]'>
            <div className='flex flex-wrap items-center gap-2 border-b border-[var(--hx-border)] bg-[var(--hx-surface)] p-2'>
              <ToolbarButton
                label='Heading'
                active={editor?.isActive('heading', { level: 2 })}
                disabled={!editor}
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              >
                H2
              </ToolbarButton>
              <ToolbarButton
                label='Bold'
                active={editor?.isActive('bold')}
                disabled={!editor}
                onClick={() => editor?.chain().focus().toggleBold().run()}
              >
                Bold
              </ToolbarButton>
              <ToolbarButton
                label='Italic'
                active={editor?.isActive('italic')}
                disabled={!editor}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
              >
                Italic
              </ToolbarButton>
              <ToolbarButton
                label='Underline'
                active={editor?.isActive('underline')}
                disabled={!editor}
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
              >
                Underline
              </ToolbarButton>
              <ToolbarButton
                label='Bullets'
                active={editor?.isActive('bulletList')}
                disabled={!editor}
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
              >
                Bullets
              </ToolbarButton>
              <ToolbarButton
                label='Numbered list'
                active={editor?.isActive('orderedList')}
                disabled={!editor}
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              >
                Numbered
              </ToolbarButton>
              <ToolbarButton
                label='Link'
                active={editor?.isActive('link')}
                disabled={!editor}
                onClick={() => {
                  const url = window.prompt('Paste link URL')
                  if (!url) return
                  editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
                }}
              >
                Link
              </ToolbarButton>
              <ToolbarButton
                label='Clear formatting'
                active={false}
                disabled={!editor}
                onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}
              >
                Clear
              </ToolbarButton>
            </div>

            <EditorContent editor={editor} />
          </div>

          <div className='mt-2 flex items-center justify-between gap-2'>
            <div className='relative'>
              <button
                type='button'
                aria-label='Emoji'
                onClick={() => setIsEmojiOpen((v) => !v)}
                className='rounded-full border border-[var(--hx-border)] bg-[var(--hx-surface)] px-3 py-2 text-sm font-semibold text-[var(--hx-text)] hover:bg-[var(--hx-surface-2)]'
              >
                Emoji
              </button>
              {isEmojiOpen ? (
                <div className='absolute left-0 top-12 z-40 w-[240px] rounded-xl border border-[var(--hx-border)] bg-[var(--hx-surface)] p-2 shadow'>
                  <div className='grid grid-cols-8 gap-1 text-base'>
                    {[
                      ...NAIRALAND_GREEN_EMOJIS,
                      ...NAIRALAND_GREEN_FACE_EMOJIS,
                      '😀',
                      '😁',
                      '😂',
                      '😍',
                      '😮',
                      '😢',
                      '😡',
                      '🙏',
                      '🔥',
                      '💯',
                      '🎉',
                      '✨',
                      '❤️',
                      '👍',
                      '👎',
                      '🤝',
                    ].map((e) => (
                      <button
                        key={e}
                        type='button'
                        className='grid h-8 w-8 place-items-center rounded hover:bg-[var(--hx-surface-2)]'
                        onClick={() => {
                          insertEmoji(e)
                          setIsEmojiOpen(false)
                        }}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <p className='text-xs text-[var(--hx-text-muted)]'>
              {isCompressing ? 'Optimizing image...' : 'Fast upload (auto-compress)'}
            </p>
          </div>

          <div className='mt-2'>
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='flex items-center gap-2 rounded-full border border-[var(--hx-border)] bg-[var(--hx-surface)] px-3 py-2 text-sm font-semibold text-[var(--hx-text)] hover:bg-[var(--hx-surface-2)]'
            >
              <ImageIcon />
              Add photos
            </button>
          </div>

          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            multiple
            className='hidden'
            onChange={async (e) => {
              const picked = Array.from(e.target.files || [])
              e.target.value = ''
              if (!picked.length) return
              setError('')
              setIsCompressing(true)
              try {
                const maxTotal = 6
                const keep = Math.max(0, maxTotal - mediaDataUrls.length)
                const files = picked.slice(0, keep)
                const next = []
                for (const file of files) {
                  // Only images for now.
                  if (!file.type.startsWith('image/')) continue
                  // eslint-disable-next-line no-await-in-loop
                  const dataUrl = await compressImageToJpegDataUrl(file)
                  next.push(dataUrl)
                }
                if (next.length) {
                  setMediaDataUrls((prev) => [...prev, ...next].slice(0, maxTotal))
                }
              } catch {
                setError('Could not read this image. Try a different photo.')
              } finally {
                setIsCompressing(false)
              }
            }}
          />

          {error ? (
            <div className='mt-2 rounded-lg border border-[rgba(228,0,110,0.35)] bg-[var(--hx-accent-bg)] p-2 text-sm text-[var(--hx-text)]'>
              {error}
            </div>
          ) : null}

          {mediaDataUrls.length ? (
            <div className='relative mt-2 overflow-hidden rounded-xl border border-[var(--hx-border)] bg-[var(--hx-surface-2)]'>
              <div className='no-scrollbar flex snap-x snap-mandatory overflow-x-auto'>
                {mediaDataUrls.map((src, idx) => (
                  <div key={`${src.slice(0, 24)}-${idx + 1}`} className='relative w-full shrink-0 snap-center'>
                    <img src={src} alt={`preview-${idx + 1}`} className='h-[260px] w-full object-cover' />
                    <button
                      type='button'
                      aria-label='Remove image'
                      onClick={() => setMediaDataUrls((prev) => prev.filter((_, i) => i !== idx))}
                      className='absolute right-2 top-2 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white'
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type='button'
                onClick={() => setMediaDataUrls([])}
                className='absolute left-2 top-2 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white'
              >
                Clear all
              </button>
              <div className='absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white'>
                {mediaDataUrls.length}/6
              </div>
            </div>
          ) : null}
        </div>

        <div className='mt-2 rounded-xl border border-[var(--hx-border)] bg-[var(--hx-surface)] p-2'>
          <p className='text-sm font-bold text-[var(--hx-text)]'>Preview</p>
          <div className='mt-2 rounded-xl border border-[var(--hx-border)] bg-[var(--hx-surface)] p-2'>
            <div className='flex items-center gap-2'>
              <img
                src={me.avatar}
                alt={me.name}
                className='h-9 w-9 rounded-full border border-[var(--hx-border)] object-cover'
                loading='lazy'
                decoding='async'
              />
              <p className='text-sm font-semibold text-[var(--hx-text)]'>{me.name || 'You'}</p>
            </div>
            {plainText.trim() ? (
              <div
                className='mt-2 hx-rich text-sm leading-5'
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            ) : (
              <p className='mt-2 text-sm text-[var(--hx-text-muted)]'>Your text will appear here.</p>
            )}
            <div className='mt-2 overflow-hidden rounded-xl border border-[var(--hx-border)] bg-[var(--hx-surface-2)]'>
              <div className='relative'>
                {mediaDataUrls.length ? (
                  <div className='no-scrollbar flex snap-x snap-mandatory overflow-x-auto'>
                    {mediaDataUrls.map((src, idx) => (
                      <img
                        key={`${src.slice(0, 24)}-${idx + 1}`}
                        src={src}
                        alt={`preview-media-${idx + 1}`}
                        className='h-[220px] w-full shrink-0 snap-center object-cover'
                      />
                    ))}
                  </div>
                ) : (
                  <div className='grid h-[220px] place-items-center text-sm text-[var(--hx-text-muted)]'>
                    Add a photo to enhance your post.
                  </div>
                )}
                {isCompressing ? (
                  <div className='absolute inset-0 grid place-items-center bg-black/25 text-sm font-bold text-white'>
                    Optimizing...
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreatePost
