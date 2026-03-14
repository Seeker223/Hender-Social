import React, { useEffect, useMemo, useState } from 'react'
import Post from '../components/Post'
import { useFeed } from '../context/FeedContext'
import { useNavigate } from 'react-router-dom'
import { getMockPosts } from '../mock/postsMock'

const LeftRoutes = ({ isLoading = false, activePostImg = null, activePostBadgeCount = 0 }) => {
  const [isPostLoading, setIsPostLoading] = useState(true)
  const feed = useFeed()
  const navigate = useNavigate()

  const resolvedPostImg = activePostImg ?? feed.activePostImg
  const resolvedBadgeCount =
    Number.isFinite(Number(activePostBadgeCount)) && Number(activePostBadgeCount) > 0
      ? Number(activePostBadgeCount)
      : Number(feed.activePostBadgeCount) || 0

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsPostLoading(false)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [])

  const showSkeleton = isLoading || isPostLoading
  const [posts, setPosts] = useState([])

  useEffect(() => {
    // Load posts after mount so localStorage is available.
    setPosts(getMockPosts())
  }, [])

  const postsWithActiveMedia = useMemo(() => {
    if (!posts.length) return posts
    const first = posts[0]
    return [
      {
        ...first,
        postImg: resolvedPostImg || first.postImg,
        badgeCount: resolvedBadgeCount,
      },
      ...posts.slice(1),
    ]
  }, [posts, resolvedBadgeCount, resolvedPostImg])

  if (showSkeleton) {
    return (
      <section className='h-full w-full bg-[var(--hx-app-bg)] p-1'>
        {Array.from({ length: 4 }).map((_, index) => (
          <article
            key={`post-skeleton-${index + 1}`}
            className='mb-2 animate-pulse rounded border border-[var(--hx-border)] bg-[var(--hx-surface)] p-2'
          >
            <div className='mb-2 h-8 w-2/3 rounded bg-[#f1f1f1]' />
            <div className='mb-2 h-4 w-full rounded bg-[#f1f1f1]' />
            <div className='mb-2 h-4 w-5/6 rounded bg-[#f1f1f1]' />
            <div className='h-40 w-full rounded bg-[#f1f1f1]' />
          </article>
        ))}
      </section>
    )
  }

  return (
    <section className='h-full w-full bg-[var(--hx-app-bg)]'>
      {postsWithActiveMedia.map((post) => (
        <Post
          key={post.id}
          name={post.authorName}
          img={post.authorAvatar}
          postImg={post.postImg}
          badgeCount={post.badgeCount}
          text={post.text}
          react={String(post.react ?? '')}
          comments={String(post.comments ?? '')}
          views={String(post.views ?? '')}
          onOpen={() => navigate(`/home/post/${post.id}`, { state: { post } })}
        />
      ))}
    </section>
  )
}

export default LeftRoutes
