import React, { useEffect } from 'react'

const UserModal = ({ isOpen, user, onClose }) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !user) {
    return null
  }

  return (
    <div
      className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.()
        }
      }}
    >
      <div className='w-full max-w-sm rounded-lg border border-[#ff2c7b] bg-white p-4 shadow-xl'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <img
              src={user.avatarFull || user.avatar}
              alt={user.name}
              className='h-14 w-14 rounded-full border-2 border-[#ff2c7b] object-cover'
              loading='lazy'
              decoding='async'
            />
            <div>
              <p className='text-lg font-bold text-black'>{user.name}</p>
              <p className='text-xs text-gray-600'>ID: {user.id}</p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => onClose?.()}
            className='rounded border border-gray-200 px-2 py-1 text-sm text-black'
          >
            Close
          </button>
        </div>

        <div className='mt-4 rounded border border-[#ffd2e5] bg-[#fff5fa] p-3 text-sm text-black'>
          <p className='font-semibold'>Mock Profile</p>
          <p className='mt-1'>This is mock friend data used for Top/Right avatars.</p>
        </div>
      </div>
    </div>
  )
}

export default UserModal
