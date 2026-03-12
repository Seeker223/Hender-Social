import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Top from '../components/Top'
import Bottom from '../components/Bottom'
import { getCurrentMockUser, getFriendsForUser } from '../mock/authMock'
import UserModal from '../components/UserModal'
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
  const [selectedUser, setSelectedUser] = useState(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)

  const activePostImg = useMemo(() => {
    if (circleState.badge.length === 0) return null
    const last = circleState.badge[circleState.badge.length - 1]
    return last?.avatar ?? null
  }, [circleState.badge])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsFriendsLoading(false)
    }, 900)

    return () => clearTimeout(timeoutId)
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

  return (
    <section className='min-h-screen w-full bg-[var(--hx-app-bg)] py-2 sm:py-4'>
      <div className='mx-auto h-[100dvh] max-h-[760px] w-full max-w-[390px] overflow-hidden border border-[#e4006e] bg-[var(--hx-surface)] shadow-lg'>
        <FeedProvider
          value={{
            activePostImg,
            activePostBadgeCount: circleState.badge.length,
          }}
        >
          <Top
            topCircles={circleState.top}
            badgeCount={circleState.badge.length}
            isLoading={isFriendsLoading}
            onCircleClick={(friend) => {
              setSelectedUser(friend)
              setIsUserModalOpen(true)
            }}
          />
          <Bottom
            rightCircles={circleState.right}
            onRightScrollDown={handleRightScrollDown}
            onRightScrollUp={handleRightScrollUp}
            isLoading={isFriendsLoading}
            activePostImg={activePostImg}
            activePostBadgeCount={circleState.badge.length}
            onRightCircleClick={(friend) => {
              setSelectedUser(friend)
              setIsUserModalOpen(true)
            }}
          />
        </FeedProvider>
      </div>
      <UserModal
        isOpen={isUserModalOpen}
        user={selectedUser}
        onClose={() => setIsUserModalOpen(false)}
      />
    </section>
  )
}

export default Home
