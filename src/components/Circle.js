import React from 'react'
import avatar from '../assets/avatar.png'


const Circle = (props) => {
  return (

            <img src={avatar} 
            className='cursor-pointer border-2 border-red-500 rounded-full object-cover '
            alt='logo' />
    
  )
}

export default Circle