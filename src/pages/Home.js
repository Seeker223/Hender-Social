import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Top from '../components/Top'
import Bottom from '../components/Bottom'
import { getCurrentMockUser, getFriendsForUser } from '../mock/authMock'
import UserModal from '../components/UserModal'
import ActivityModal from '../components/ActivityModal'
import { FeedProvider } from '../context/FeedContext'

const Home = () => {
  const currentUser = useMemo(() => getCurrentMockUser(), [])
  const userFriends = useMemo(() => getFriendsForUser(currentUser), [currentUser])

  const [circleState, setCircleState] = useState(() => ({
    top: userFriends.slice(0, 6),
    right: userFriends.slice(6, 36),
    badge: [],
  }))
  const [isFriendsLoading, setIsFriendsLoading] = useState(true)
  const [areAvatarsReady, setAreAvatarsReady] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false)

  const activePostImg = useMemo(() => {
    if (circleState.badge.length === 0) return null
    const last = circleState.badge[circleState.badge.length - 1]
    return last?.avatarFull ?? last?.avatar ?? null
  }, [circleState.badge])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsFriendsLoading(false)
    }, 900)

    return () => clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    let cancelled = false
    const uniqueSrcs = Array.from(
      new Set((userFriends || []).map((friend) => friend?.avatar).filter(Boolean))
    )

    const preload = async () => {
      try {
        await Promise.all(
          uniqueSrcs.map((src) => {
            const img = new Image()
            img.src = src
            if (typeof img.decode === 'function') {
              return img.decode().catch(() => undefined)
            }
            return new Promise((resolve) => {
              img.onload = () => resolve()
              img.onerror = () => resolve()
            })
          })
        )
      } finally {
        if (!cancelled) {
          setAreAvatarsReady(true)
        }
      }
    }

    preload()

    return () => {
      cancelled = true
    }
  }, [userFriends])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const applyCircle = (circle) => {
      if (!circle || !circle.id || !circle.avatar) return
      setCircleState((prev) => {
        const existing = [...prev.top, ...prev.right].some((c) => c?.id === circle.id)
        if (existing) return prev

        const top = [circle, ...prev.top].slice(0, 6)
        const overflow = [circle, ...prev.top].slice(6)
        const right = overflow.length ? [...overflow, ...prev.right] : prev.right
        return { ...prev, top, right }
      })
    }

    // Restore last created post circle (in case of refresh).
    const saved = window.localStorage.getItem('hender_last_post_circle')
    if (saved) {
      try {
        applyCircle(JSON.parse(saved))
      } catch {
        // ignore
      }
    }

    const onNew = (event) => applyCircle(event?.detail)
    window.addEventListener('hender:new-post-circle', onNew)
    const onActivity = (event) => applyCircle(event?.detail)
    window.addEventListener('hender:activity-circle', onActivity)
    return () => {
      window.removeEventListener('hender:new-post-circle', onNew)
      window.removeEventListener('hender:activity-circle', onActivity)
    }
  }, [])

  const handleRightScrollDown = useCallback((count = 1) => {
    if (isFriendsLoading) {
      return
    }

    const cycles = Number.isFinite(Number(count)) ? Math.max(1, Math.floor(Number(count))) : 1
    setCircleState((prev) => {
      let top = prev.top
      let right = prev.right
      let badge = prev.badge

      // Copy only once for the entire gesture batch.
      top = [...top]
      right = [...right]
      badge = [...badge]

      for (let i = 0; i < cycles; i += 1) {
        if (right.length <= 10 || right.length === 0) break
        const movedFromRight = right.shift()
        if (!movedFromRight) break

        if (top.length === 0) {
          top.push(movedFromRight)
          continue
        }

        const movedFromTop = top.shift()
        if (movedFromTop) badge.push(movedFromTop)
        top.push(movedFromRight)
      }

      return { top, right, badge }
    })
  }, [isFriendsLoading])

  const handleRightScrollUp = useCallback((count = 1) => {
    if (isFriendsLoading) {
      return
    }

    const cycles = Number.isFinite(Number(count)) ? Math.max(1, Math.floor(Number(count))) : 1
    setCircleState((prev) => {
      let top = prev.top
      let right = prev.right
      let badge = prev.badge

      top = [...top]
      right = [...right]
      badge = [...badge]

      for (let i = 0; i < cycles; i += 1) {
        if (badge.length === 0 || top.length === 0) break
        const restoredBadge = badge.pop()
        const restoredFromTop = top.pop()
        if (restoredFromTop) right.unshift(restoredFromTop)
        if (restoredBadge) top.unshift(restoredBadge)
      }

      return { top, right, badge }
    })
  }, [isFriendsLoading])

  const isCircleUiLoading = isFriendsLoading || !areAvatarsReady
  const isActivityCircle = useCallback((circle) => {
    if (!circle) return false
    if (circle.activityType || circle.badgeIcon) return true
    const id = circle.id
    return typeof id === 'string' && /^(reaction|comment|chat|video|post)-/.test(id)
  }, [])

  const handleCircleClick = useCallback((friend) => {
    if (!friend) return
    if (isActivityCircle(friend)) {
      setSelectedActivity(friend)
      setIsActivityModalOpen(true)
      setIsUserModalOpen(false)
      return
    }
    setSelectedUser(friend)
    setIsUserModalOpen(true)
    setIsActivityModalOpen(false)
  }, [isActivityCircle])

  return (
    <section className='min-h-screen w-full py-2 sm:py-4'>
      <div className='mx-auto h-[100dvh] max-h-[760px] w-full max-w-[390px] overflow-hidden rounded-[22px] border border-[var(--hx-border)] bg-[var(--hx-surface)] shadow-[var(--hx-frame-shadow)] ring-1 ring-[rgba(228,0,110,0.35)]'>
        <FeedProvider
          value={{
            activePostImg,
            activePostBadgeCount: circleState.badge.length,
          }}
        >
          <Top
            topCircles={circleState.top}
            badgeCount={circleState.badge.length}
            isLoading={isCircleUiLoading}
            onCircleClick={handleCircleClick}
          />
          <Bottom
            rightCircles={circleState.right}
            onRightScrollDown={handleRightScrollDown}
            onRightScrollUp={handleRightScrollUp}
            isLoading={isCircleUiLoading}
            activePostImg={activePostImg}
            activePostBadgeCount={circleState.badge.length}
            onRightCircleClick={handleCircleClick}
          />
        </FeedProvider>
      </div>
      <UserModal
        isOpen={isUserModalOpen}
        user={selectedUser}
        onClose={() => setIsUserModalOpen(false)}
      />
      <ActivityModal
        isOpen={isActivityModalOpen}
        activity={selectedActivity}
        onClose={() => setIsActivityModalOpen(false)}
      />
    </section>
  )
}

export default Home
