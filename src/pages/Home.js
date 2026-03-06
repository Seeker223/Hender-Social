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
  const [badgeCount, setBadgeCount] = useState(0)

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

        const [, ...remainingTop] = currentTop
        setBadgeCount((currentCount) => currentCount + 1)
        return [...remainingTop, movedFromRight]
      })

      return remainingRight
    })
  }, [])

  return (
    <section className='min-h-screen w-full bg-[#e9e9e9] py-2 sm:py-4'>
      <div className='mx-auto h-[100dvh] max-h-[760px] w-full max-w-[390px] overflow-hidden border border-[#e4006e] bg-[#f4f4f4] shadow-lg'>
        <Top topCircles={topCircles} badgeCount={badgeCount} />
        <Bottom rightCircles={rightCircles} onRightScrollDown={handleRightScrollDown} />
      </div>
    </section>
  )
}

export default Home
