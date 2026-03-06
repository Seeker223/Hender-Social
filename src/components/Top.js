import React from 'react'
import hlogo2 from '../assets/hlogo2.png'
import Circle from '../components/Circle'
import { Link } from 'react-router-dom'




const Top = ({ topCircles = [], chartCircles = [] }) => {
  return (
    <header className='flex h-16 w-full items-center gap-2 border-b border-[#ff2c7b] bg-[#efefef] px-1'>
      <Link to='/home/left' className='h-12 w-12 shrink-0'>
        <img src={hlogo2} className='h-full w-full object-contain' alt='logo' />
      </Link>
      <div className='flex flex-1 items-center gap-1 overflow-x-auto pr-1'>
        {topCircles.map((circleId) => (
          <Circle key={circleId} size='h-12 w-12' className='shrink-0' />
        ))}
      </div>
      <div className='flex h-12 w-16 shrink-0 items-center gap-1 overflow-x-auto rounded border border-[#ff2c7b] px-1'>
        {chartCircles.map((circleId) => (
          <Circle key={circleId} size='h-6 w-6' className='shrink-0 border' />
        ))}
      </div>
    </header>
  )
}


export default Top















