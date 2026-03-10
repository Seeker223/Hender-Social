
import React, { useRef } from 'react'
import Circle from '../components/Circle'

const Right = ({ circles = [], onScrollDown, onScrollUp, isLoading = false }) => {
  const railRef = useRef(null)
  const lastScrollTopRef = useRef(0)
  const isResettingRef = useRef(false)
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
    // Keep desktop wheel working even if the rail is scrollable.
    processDelta(event.deltaY)
  }

  const handleScroll = (event) => {
    if (isResettingRef.current) {
      return
    }

    const currentTop = event.currentTarget.scrollTop
    const delta = currentTop - lastScrollTopRef.current
    lastScrollTopRef.current = currentTop

    // Ignore tiny moves; reduces noise and keeps cycling snappy.
    if (Math.abs(delta) < 2) {
      return
    }

    processDelta(delta)

    // Reset scroll position to avoid drift/jank while still allowing touch scroll gestures.
    isResettingRef.current = true
    requestAnimationFrame(() => {
      if (railRef.current) {
        railRef.current.scrollTop = 0
      }
      lastScrollTopRef.current = 0
      accumulatedDeltaRef.current = 0
      isResettingRef.current = false
    })
  }

  return (
    <aside
      ref={railRef}
      className='no-scrollbar h-full w-[58px] overflow-y-auto overscroll-contain bg-[#efefef] py-1 select-none'
      onWheel={handleWheel}
      onScroll={handleScroll}
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
              <Circle
                key={friend.id}
                size='h-11 w-11'
                src={friend.avatar}
                name={friend.name}
                showBadge
                badgeKey={friend.id}
              />
            ))}
      </div>
    </aside>
  )
}

export default Right
