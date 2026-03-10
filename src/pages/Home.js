import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Top from '../components/Top'
import Bottom from '../components/Bottom'
import { getCurrentMockUser, getFriendsForUser } from '../mock/authMock'
import UserModal from '../components/UserModal'

const Home = () => {
  const currentUser = useMemo(() => getCurrentMockUser(), [])
  const userFriends = useMemo(() => getFriendsForUser(currentUser), [currentUser])

  const [topCircles, setTopCircles] = useState(() => userFriends.slice(0, 6))
  const [rightCircles, setRightCircles] = useState(() => userFriends.slice(6, 36))
  const [badgeCircles, setBadgeCircles] = useState([])
  const [isFriendsLoading, setIsFriendsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsFriendsLoading(false)
    }, 900)

    return () => clearTimeout(timeoutId)
  }, [])

  const handleRightScrollDown = useCallback(() => {
    if (isFriendsLoading) {
      return
    }

    setRightCircles((currentRight) => {
      if (currentRight.length <= 10) {
        return currentRight
      }

      if (currentRight.length === 0) {
        return currentRight
      }

      const [movedFromRight, ...remainingRight] = currentRight

      setTopCircles((currentTop) => {
        if (currentTop.length === 0) {
          return [movedFromRight]
        }

        const [movedFromTop, ...remainingTop] = currentTop
        setBadgeCircles((currentBadge) => [...currentBadge, movedFromTop])
        return [...remainingTop, movedFromRight]
      })

      return remainingRight
    })
  }, [isFriendsLoading])

  const handleRightScrollUp = useCallback(() => {
    if (isFriendsLoading) {
      return
    }

    setBadgeCircles((currentBadge) => {
      if (currentBadge.length === 0) {
        return currentBadge
      }

      const restoredBadge = currentBadge[currentBadge.length - 1]

      setTopCircles((currentTop) => {
        if (currentTop.length === 0) {
          return currentTop
        }

        const restoredFromTop = currentTop[currentTop.length - 1]
        const remainingTop = currentTop.slice(0, -1)
        setRightCircles((currentRight) => [restoredFromTop, ...currentRight])
        return [restoredBadge, ...remainingTop]
      })

      return currentBadge.slice(0, -1)
    })
  }, [isFriendsLoading])

  return (
    <section className='min-h-screen w-full bg-[#e9e9e9] py-2 sm:py-4'>
      <div className='mx-auto h-[100dvh] max-h-[760px] w-full max-w-[390px] overflow-hidden border border-[#e4006e] bg-[#f4f4f4] shadow-lg'>
        <Top
          topCircles={topCircles}
          badgeCount={badgeCircles.length}
          isLoading={isFriendsLoading}
          onCircleClick={(friend) => {
            setSelectedUser(friend)
            setIsUserModalOpen(true)
          }}
        />
        <Bottom
          rightCircles={rightCircles}
          onRightScrollDown={handleRightScrollDown}
          onRightScrollUp={handleRightScrollUp}
          isLoading={isFriendsLoading}
          onRightCircleClick={(friend) => {
            setSelectedUser(friend)
            setIsUserModalOpen(true)
          }}
        />
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
