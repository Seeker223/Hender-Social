import React from 'react'

const RouteSkeleton = () => {
  return (
    <div className='flex min-h-screen w-full items-center justify-center bg-[#ececec]'>
      <div className='w-full max-w-[390px] animate-pulse rounded border border-[#ffd0e3] bg-white p-4'>
        <div className='mb-4 h-12 rounded bg-[#f2f2f2]' />
        <div className='mb-2 h-24 rounded bg-[#f2f2f2]' />
        <div className='mb-2 h-24 rounded bg-[#f2f2f2]' />
        <div className='h-24 rounded bg-[#f2f2f2]' />
      </div>
    </div>
  )
}

export default RouteSkeleton
