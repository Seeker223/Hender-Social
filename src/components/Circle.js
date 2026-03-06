import React from 'react'
import avatar from '../assets/avatar.png'


const Circle = ({ size = 'h-10 w-10', className = '', src = avatar, name = 'avatar' }) => {
  return (
    <img
      src={src}
      className={`${size} ${className} cursor-pointer rounded-full border-2 border-[#ff2c7b] object-cover`}
      alt={name}
      title={name}
    />
  )
}

export default Circle
