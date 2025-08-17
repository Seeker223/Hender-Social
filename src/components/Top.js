import React from 'react'
import hlogo2 from '../assets/hlogo2.png'
import Circle from '../components/Circle'
import avatar from '../assets/avatar.png'
import { Link } from 'react-router-dom'




const Top = () => {
  return (
    <div className=' relative flex w-full h-[60px]'>
      <Link to='/home/userId'>
           <div className='relative flex  h-full w-14px  '>
            <img src={hlogo2} 
            className=' h-full w-full  object-contain '
            alt='logo' />
            </div>
            </Link>
            <div className=' relative scroll-smooth overflow-x-scroll flex w-full h-[60px]'>
            <Circle />
            <Circle />
            <Circle />
            <Circle />
            <Circle />
            <Circle />
            
            </div>
        </div>
  )
}


export default Top
