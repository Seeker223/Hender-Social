
import React, { useRef } from 'react'
import Circle from '../components/Circle'

const Right = ({ circles = [], onScrollDown, onScrollUp, isLoading = false }) => {
  const touchStartYRef = useRef(null)
  const lastTouchYRef = useRef(null)
  const accumulatedDeltaRef = useRef(0)

  const STEP_PX = 36
  const MAX_CYCLES_PER_EVENT = 6

  const cycleByDirection = (direction, count = 1) => {
    if (count <= 0) {
      return
    }

    for (let i = 0; i < count; i += 1) {
      if (direction === 'down' && onScrollDown) {
        onScrollDown()
      }
      if (direction === 'up' && onScrollUp) {
        onScrollUp()
      }
    }
  }

  const processDelta = (deltaY) => {
    if (deltaY === 0) {
      return
    }

    accumulatedDeltaRef.current += deltaY
    const rawCycles = Math.floor(Math.abs(accumulatedDeltaRef.current) / STEP_PX)
    const cycles = Math.min(rawCycles, MAX_CYCLES_PER_EVENT)

    if (cycles <= 0) {
      return
    }

    if (accumulatedDeltaRef.current > 0) {
      cycleByDirection('down', cycles)
    } else {
      cycleByDirection('up', cycles)
    }

    accumulatedDeltaRef.current =
      accumulatedDeltaRef.current > 0
        ? accumulatedDeltaRef.current - cycles * STEP_PX
        : accumulatedDeltaRef.current + cycles * STEP_PX
  }

  const handleWheel = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (Math.abs(event.deltaY) < 3) {
      return
    }

    processDelta(event.deltaY)
  }

  const handleTouchStart = (event) => {
    const startY = event.touches[0]?.clientY ?? null
    touchStartYRef.current = startY
    lastTouchYRef.current = startY
    accumulatedDeltaRef.current = 0
  }

  const handleTouchMove = (event) => {
    const currentY = event.touches[0]?.clientY ?? null
    if (
      touchStartYRef.current === null ||
      lastTouchYRef.current === null ||
      typeof currentY !== 'number'
    ) {
      return
    }

    const deltaY = lastTouchYRef.current - currentY
    processDelta(deltaY)
    lastTouchYRef.current = currentY
  }

  const handleTouchEnd = () => {
    touchStartYRef.current = null
    lastTouchYRef.current = null
    accumulatedDeltaRef.current = 0
  }

  return (
    <aside
      className='no-scrollbar h-full w-[58px] touch-none overflow-hidden bg-[#efefef] py-1 select-none'
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className='flex flex-col items-center gap-2'>
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <div
                key={`right-skeleton-${index + 1}`}
                className='h-11 w-11 animate-pulse rounded-full border-2 border-[#ffd2e5] bg-[#f1f1f1]'
              />
            ))
          : circles.map((friend) => (
              <Circle key={friend.id} size='h-11 w-11' src={friend.avatar} name={friend.name} />
            ))}
      </div>
    </aside>
  )
}

export default Right
