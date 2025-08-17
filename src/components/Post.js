import React from 'react'
import hlogo2 from '../assets/hlogo2.png'
import {AiOutlineLike,AiOutlineMessage,AiOutlineHome,AiOutlinePhone,AiOutlineSearch } from 'react-icons/ai'

const Post = (props) => {
  return (
    <div className='w-full'>
        <div className='flex pl-2 pr-2 items-center relative w-full bg-white'>
            <div className='relative flex rounded-full h-[3rem] w-[3rem] '>
            <img src={props.img} 
            className=' h-full w-full rounded-full object-cover '
            alt='logo' />
            </div>
            <p className='flex pl-2 font-bold'>{props.name}</p>
        </div>
        <div className='relative flex  rounded-lg w-full bg-white border-2 border-black'>
            <p className='flex relative flex-col rounded-lg w-full bg-white '>
            {props.text}
               
            </p>
        </div>
        <div className='relative  w-full  bg-white flex rounded-sm  '>
        <img src={props.img} 
            className=' w-full h-full object-cover '
            alt='logo' />
        </div>
        <div className='font-bold bg-white'>
            <p>you and {props.react} reacted</p>
        </div>
        <div className='flex relative flex items-center bg-white justify-around'>
            <AiOutlineLike size={30}/>
            <AiOutlineMessage size={30}/>
            <AiOutlineHome size={30}/>
            <AiOutlinePhone size={30}/>
            <AiOutlineSearch size={30}/>
            <p className='border-2 border-blue-500 pl-2 pr-2'>re-xend</p>
        </div>
        <div className=''>
        Post-most-comment
        </div>
    </div>
  )
}

export default Post