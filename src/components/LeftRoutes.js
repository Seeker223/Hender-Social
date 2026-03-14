import React, { useMemo } from 'react'
import Post from '../components/Post'
import hlogo2 from '../assets/hlogo2.png'
import p1 from '../assets/male/p1.jpg'
import p2 from '../assets/male/p2.jpg'
import p3 from '../assets/male/p3.jpg'
import p4 from '../assets/male/p4.jpg'
import p5 from '../assets/male/p5.jpg'
import p6 from '../assets/male/p6.jpg'
import p7 from '../assets/male/p7.jpg'
import p8 from '../assets/male/p8.jpg'
import avatar from '../assets/avatar.png'
import { useEffect, useState } from 'react'
import { useFeed } from '../context/FeedContext'
import { useNavigate } from 'react-router-dom'

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

  const posts = useMemo(
    () => [
      {
        id: 'p1',
        authorName: 'ztsambad',
        authorAvatar: hlogo2,
        text: 'efjfhjkfvdzjhnmcckn,mcn,xnc.xjfkl lcjdxc',
        react: 21,
        comments: 12,
        views: 120,
        postImg: resolvedPostImg || hlogo2,
        badgeCount: resolvedBadgeCount,
      },
      {
        id: 'p2',
        authorName: 'Alex',
        authorAvatar: p1,
        text: '',
        react: 4,
        comments: 2,
        views: 32,
        postImg: p1,
      },
      {
        id: 'p3',
        authorName: 'Maya',
        authorAvatar: avatar,
        text: '',
        react: 44,
        comments: 10,
        views: 88,
        postImg: avatar,
      },
      { id: 'p4', authorName: 'Chris', authorAvatar: p2, text: '', react: 34, comments: 1, views: 40, postImg: p2 },
      { id: 'p5', authorName: 'Ada', authorAvatar: p3, text: '', react: 78, comments: 5, views: 112, postImg: p3 },
      { id: 'p6', authorName: 'Noah', authorAvatar: p4, text: '', react: 68, comments: 3, views: 92, postImg: p4 },
      { id: 'p7', authorName: 'Ella', authorAvatar: p5, text: '', react: 999, comments: 54, views: 1000, postImg: p5 },
      { id: 'p8', authorName: 'Zane', authorAvatar: p6, text: '', react: 766, comments: 33, views: 560, postImg: p6 },
      { id: 'p9', authorName: 'Liam', authorAvatar: p7, text: '', react: 5555, comments: 210, views: 4000, postImg: p7 },
      { id: 'p10', authorName: 'Tola', authorAvatar: p8, text: '', react: 457, comments: 14, views: 220, postImg: p8 },
    ],
    [resolvedBadgeCount, resolvedPostImg]
  )

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
      {posts.map((post) => (
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
