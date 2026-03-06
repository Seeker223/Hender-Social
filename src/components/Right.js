
import React, { useRef } from 'react'
import Circle from '../components/Circle'

const Right = ({ circles = [], onScrollDown, onScrollUp }) => {
  const touchStartYRef = useRef(null)
  const lastTriggerTimeRef = useRef(0)

  const TRIGGER_COOLDOWN_MS = 160
  const TOUCH_DELTA_THRESHOLD = 18

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
    if (event.deltaY > 0 && onScrollDown) {
      triggerByDirection('down')
    }
    if (event.deltaY < 0 && onScrollUp) {
      triggerByDirection('up')
    }
  }

  const handleTouchStart = (event) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null
  }

  const handleTouchMove = (event) => {
    const currentY = event.touches[0]?.clientY
    if (touchStartYRef.current === null || typeof currentY !== 'number') {
      return
    }

    const deltaY = touchStartYRef.current - currentY
    if (Math.abs(deltaY) < TOUCH_DELTA_THRESHOLD) {
      return
    }

    if (deltaY > 0) {
      triggerByDirection('down')
    } else {
      triggerByDirection('up')
    }

    touchStartYRef.current = currentY
  }

  const handleTouchEnd = () => {
    touchStartYRef.current = null
  }

  return (
    <aside
      className='h-full w-[58px] overflow-y-auto border-l border-[#ff2c7b] bg-[#efefef] py-1'
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className='flex flex-col items-center gap-2'>
        {circles.map((circleId) => (
          <Circle key={circleId} size='h-11 w-11' />
        ))}
      </div>
    </aside>
  )
}

export default Right
