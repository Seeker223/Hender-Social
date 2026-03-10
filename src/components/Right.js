
import React, { useRef } from 'react'
import Circle from '../components/Circle'

const Right = ({ circles = [], onScrollDown, onScrollUp, isLoading = false, onCircleClick }) => {
  const accumulatedDeltaRef = useRef(0)
  const pointerDownRef = useRef(false)
  const lastPointerYRef = useRef(null)
  const startPointerYRef = useRef(null)
  const isDraggingRef = useRef(false)
  const dragHappenedRef = useRef(false)

  const STEP_PX = 36
  const MAX_CYCLES_PER_EVENT = 6
  const DRAG_START_PX = 6

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
    processDelta(event.deltaY)
  }

  const handlePointerDown = (event) => {
    pointerDownRef.current = true
    lastPointerYRef.current = event.clientY
    startPointerYRef.current = event.clientY
    isDraggingRef.current = false
    dragHappenedRef.current = false
    accumulatedDeltaRef.current = 0
  }

  const handlePointerMove = (event) => {
    if (!pointerDownRef.current || typeof lastPointerYRef.current !== 'number') {
      return
    }

    const currentY = event.clientY
    const startY = startPointerYRef.current
    if (!isDraggingRef.current && typeof startY === 'number') {
      const totalDelta = startY - currentY
      if (Math.abs(totalDelta) >= DRAG_START_PX) {
        isDraggingRef.current = true
        dragHappenedRef.current = true
        if (event.currentTarget.setPointerCapture) {
          event.currentTarget.setPointerCapture(event.pointerId)
        }
      }
    }

    if (isDraggingRef.current) {
      const deltaY = lastPointerYRef.current - currentY
      processDelta(deltaY)
    }

    lastPointerYRef.current = currentY
  }

  const handlePointerUpOrCancel = () => {
    pointerDownRef.current = false
    lastPointerYRef.current = null
    startPointerYRef.current = null
    isDraggingRef.current = false
    accumulatedDeltaRef.current = 0

    // Let the subsequent click event fire normally if there was no drag.
    // If there was a drag, keep this true until the click-capture sees it.
  }

  return (
    <aside
      className='no-scrollbar h-full w-[58px] touch-none overflow-hidden bg-[#efefef] py-1 select-none'
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      onClickCapture={(event) => {
        // If the gesture turned into a drag, suppress avatar click/modal.
        if (dragHappenedRef.current) {
          event.preventDefault()
          event.stopPropagation()
          // Reset after suppressing the first click following the drag.
          dragHappenedRef.current = false
        }
      }}
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
                onClick={() => onCircleClick?.(friend)}
              />
            ))}
      </div>
    </aside>
  )
}

export default Right
