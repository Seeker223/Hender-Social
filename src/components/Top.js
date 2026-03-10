import React from 'react'
import hlogo2 from '../assets/hlogo2.png'
import Circle from '../components/Circle'
import { Link } from 'react-router-dom'




const Top = ({ topCircles = [], badgeCount = 0, isLoading = false }) => {
  const visibleCircles = topCircles.slice(0, 6)
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
      <div className='flex flex-1 items-center gap-1 overflow-hidden pr-1'>
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`top-skeleton-${index + 1}`}
                className='h-12 w-12 shrink-0 animate-pulse rounded-full border-2 border-[#ffd2e5] bg-[#f1f1f1]'
              />
            ))
          : visibleCircles.map((friend) => (
              <Circle
                key={friend.id}
                size='h-12 w-12'
                className='shrink-0'
                src={friend.avatar}
                name={friend.name}
              />
            ))}
      </div>
    </header>
  )
}


export default Top















