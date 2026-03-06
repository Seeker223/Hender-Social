import React from 'react'
import hlogo2 from '../assets/hlogo2.png'
import Circle from '../components/Circle'
import { Link } from 'react-router-dom'




const Top = ({ topCircles = [], badgeCount = 0 }) => {
  return (
    <header className='flex h-16 w-full items-center gap-2 bg-[#efefef] px-1'>
      <Link to='/home/left' className='relative h-12 w-12 shrink-0'>
        <img src={hlogo2} className='h-full w-full object-contain' alt='logo' />
        {badgeCount > 0 && (
          <span className='absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e4006e] px-1 text-[10px] font-bold leading-none text-white'>
            {badgeCount}
          </span>
        )}
      </Link>
      <div className='no-scrollbar flex flex-1 items-center gap-1 overflow-x-auto pr-1'>
        {topCircles.map((circleId) => (
          <Circle key={circleId} size='h-12 w-12' className='shrink-0' />
        ))}
      </div>
    </header>
  )
}


export default Top















