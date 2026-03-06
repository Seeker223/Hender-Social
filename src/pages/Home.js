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
  const [chartCircles, setChartCircles] = useState([])

  const handleRightScrollUp = useCallback(() => {
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
        setChartCircles((currentChart) => [...currentChart, movedFromTop])
        return [...remainingTop, movedFromRight]
      })

      return remainingRight
    })
  }, [])

  return (
    <section className='min-h-screen w-full bg-[#e9e9e9] py-2 sm:py-4'>
      <div className='mx-auto h-[100dvh] max-h-[760px] w-full max-w-[390px] overflow-hidden border border-[#e4006e] bg-[#f4f4f4] shadow-lg'>
        <Top topCircles={topCircles} chartCircles={chartCircles} />
        <Bottom rightCircles={rightCircles} onRightScrollUp={handleRightScrollUp} />
      </div>
    </section>
  )
}

export default Home
