
import React from 'react'
import Circle from '../components/Circle'

const Right = ({ circles = [], onScrollUp }) => {
  const handleWheel = (event) => {
    if (event.deltaY < 0 && onScrollUp) {
      onScrollUp()
    }
  }

  return (
    <aside
      className='h-full w-[58px] overflow-y-auto border-l border-[#ff2c7b] bg-[#efefef] py-1'
      onWheel={handleWheel}
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
