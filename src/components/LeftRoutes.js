import React from 'react'
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

const LeftRoutes = ({ isLoading = false, activePostImg = null, activePostBadgeCount = 0 }) => {
  const [isPostLoading, setIsPostLoading] = useState(true)
  const feed = useFeed()

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
      <Post
        name='ztsambad'
        img={hlogo2}
        postImg={resolvedPostImg || hlogo2}
        badgeCount={resolvedBadgeCount}
        text='efjfhjkfvdzjhnmcckn,mcn,xnc.xjfkl lcjdxc'
        react='21'
      />
      <Post name='' img={p1} text='' react='4' />
      <Post name='' img={avatar} text='' react='44' />
      <Post name='' img={p2} text='' react='34' />
      <Post name='' img={p3} text='' react='78' />
      <Post name='' img={p4} text='' react='68' />
      <Post name='' img={p5} text='' react='999' />
      <Post name='' img={p6} text='' react='766' />
      <Post name='' img={p7} text='' react='5555' />
      <Post name='' img={p8} text='' react='457' />
      <Post name='' img={p1} text='' react='455' />
      <Post name='' img={p2} text='' react='665' />
      <Post name='' img={p3} text='' react='554' />
      <Post name='' img={p4} text='' react='677' />
    </section>
  )
}

export default LeftRoutes
