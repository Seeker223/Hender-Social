import React, { useCallback, useState } from 'react'
import Top from '../components/Top'
import Bottom from '../components/Bottom'

const Home = () => {
  const [topCircles, setTopCircles] = useState(
    Array.from({ length: 6 }, (_, index) => `top-${index + 1}`)
  )
  const [rightCircles, setRightCircles] = useState(
    Array.from({ length: 12 }, (_, index) => `right-${index + 1}`)
  )
  const [badgeCircles, setBadgeCircles] = useState([])

  const handleRightScrollDown = useCallback(() => {
    setRightCircles((currentRight) => {
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
  }, [])

  const handleRightScrollUp = useCallback(() => {
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
  }, [])

  return (
    <section className='min-h-screen w-full bg-[#e9e9e9] py-2 sm:py-4'>
      <div className='mx-auto h-[100dvh] max-h-[760px] w-full max-w-[390px] overflow-hidden border border-[#e4006e] bg-[#f4f4f4] shadow-lg'>
        <Top topCircles={topCircles} badgeCount={badgeCircles.length} />
        <Bottom
          rightCircles={rightCircles}
          onRightScrollDown={handleRightScrollDown}
          onRightScrollUp={handleRightScrollUp}
        />
      </div>
    </section>
  )
}

export default Home
