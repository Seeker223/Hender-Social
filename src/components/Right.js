
import React, { useRef } from 'react'
import Circle from '../components/Circle'

const Right = ({ circles = [], onScrollDown, onScrollUp, isLoading = false }) => {
  const touchStartYRef = useRef(null)
  const touchCurrentYRef = useRef(null)
  const lastTriggerTimeRef = useRef(0)

  const TRIGGER_COOLDOWN_MS = 220
  const TOUCH_DELTA_THRESHOLD = 24

  const triggerByDirection = (direction) => {
    const now = Date.now()
    if (now - lastTriggerTimeRef.current < TRIGGER_COOLDOWN_MS) {
      return
    }

    lastTriggerTimeRef.current = now
    if (direction === 'down' && onScrollDown) {
      onScrollDown()
    }
    if (direction === 'up' && onScrollUp) {
      onScrollUp()
    }
  }

  const handleWheel = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (Math.abs(event.deltaY) < 3) {
      return
    }

    if (event.deltaY > 0 && onScrollDown) {
      triggerByDirection('down')
    }
    if (event.deltaY < 0 && onScrollUp) {
      triggerByDirection('up')
    }
  }

  const handleTouchStart = (event) => {
    const startY = event.touches[0]?.clientY ?? null
    touchStartYRef.current = startY
    touchCurrentYRef.current = startY
  }

  const handleTouchMove = (event) => {
    const currentY = event.touches[0]?.clientY
    if (touchStartYRef.current === null || typeof currentY !== 'number') {
      return
    }

    touchCurrentYRef.current = currentY
  }

  const handleTouchEnd = () => {
    if (touchStartYRef.current === null || touchCurrentYRef.current === null) {
      touchStartYRef.current = null
      touchCurrentYRef.current = null
      return
    }

    const deltaY = touchStartYRef.current - touchCurrentYRef.current
    if (Math.abs(deltaY) >= TOUCH_DELTA_THRESHOLD) {
      if (deltaY > 0) {
        triggerByDirection('down')
      } else {
        triggerByDirection('up')
      }
    }

    touchStartYRef.current = null
    touchCurrentYRef.current = null
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
